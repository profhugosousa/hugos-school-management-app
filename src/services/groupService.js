import { supabase } from '../config/supabase'

export const groupService = {
	async getAll() {
		const { data, error } = await supabase
			.from('view_groups')
			.select('*')
			.order('level_name', { ascending: true, nullsFirst: false })
			.order('name', { ascending: true, nullsFirst: false })

		if (error) throw new Error(`Failed to fetch groups: ${error.message}`)

		return data.map((g) => ({
			id: g.id,
			name: g.name || '',
			levelId: g.level_id || null,
			levelName: g.level_name || '',
			displayName: g.display_name || g.id
		}))
	},

	async getById(id) {
		const { data, error } = await supabase
			.from('view_groups')
			.select('*')
			.eq('id', id)
			.single()

		if (error) throw new Error(`Failed to fetch group ${id}: ${error.message}`)

		return {
			id: data.id,
			name: data.name || '',
			levelId: data.level_id || null,
			levelName: data.level_name || '',
			displayName: data.display_name || data.id
		}
	},

	async create(name, levelId) {
		const { data: root, error } = await supabase
			.from('groups')
			.insert({})
			.select('id')
			.single()

		if (error) throw new Error(`Failed group creation: ${error.message}`)

		await Promise.all([
			supabase.from('group_names').insert({ group_id: root.id, name }),
			supabase.from('group_level_assignments').insert({ group_id: root.id, level_id: levelId })
		])

		return this.getById(root.id)
	},

	async update(id, { name, levelId }) {
		const updates = []

		if (name !== undefined) {
			updates.push(supabase.from('group_names').upsert({ group_id: id, name }))
		}
		if (levelId !== undefined) {
			updates.push(supabase.from('group_level_assignments').upsert({ group_id: id, level_id: levelId }))
		}

		const results = await Promise.all(updates)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed updating group: ${failed.error.message}`)

		return this.getById(id)
	},

	async delete(id) {
		const { error } = await supabase.from('groups').delete().eq('id', id)
		if (error) throw new Error(`Failed to delete group: ${error.message}`)
		return true
	},

	async deleteAll() {
		const { error } = await supabase
			.from('groups')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all groups: ${error.message}`)
		return true
	},

	async getGroupStudents(groupId) {
		const { data: enrolments, error } = await supabase
			.from('enrolment_groups')
			.select('enrolment_id')
			.eq('group_id', groupId)

		if (error) throw new Error(`Failed to fetch group enrolments: ${error.message}`)
		if (!enrolments || enrolments.length === 0) return []

		const enrolmentIds = enrolments.map((e) => e.enrolment_id)

		const [studentsRes, numbersRes] = await Promise.all([
			supabase
				.from('enrolment_students')
				.select('enrolment_id, student_id')
				.in('enrolment_id', enrolmentIds),
			supabase
				.from('enrolment_group_numbers')
				.select('enrolment_id, group_number')
				.in('enrolment_id', enrolmentIds)
		])

		if (studentsRes.error) throw new Error(studentsRes.error.message)

		const studentIds = studentsRes.data.map((s) => s.student_id)
		if (studentIds.length === 0) return []

		const { data: studentsData, error: stErr } = await supabase
			.from('view_students')
			.select('*')
			.in('id', studentIds)

		if (stErr) throw new Error(stErr.message)

		const numberMap = new Map((numbersRes.data || []).map((n) => [n.enrolment_id, n.group_number]))
		const enrolmentMap = new Map((studentsRes.data || []).map((s) => [s.student_id, s.enrolment_id]))

		return studentsData
			.map((st) => {
				const enrolmentId = enrolmentMap.get(st.id)
				return {
					...st,
					enrolment_id: enrolmentId,
					group_number: numberMap.get(enrolmentId) ?? null
				}
			})
			.sort((a, b) => (a.group_number || 999) - (b.group_number || 999))
	},

	async getAllStudents() {
		const { data, error } = await supabase
			.from('view_students')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(`Failed to fetch all students: ${error.message}`)
		return data || []
	},

	async enrolStudent(groupId, studentId, academicYearId = null, groupNumber = null) {
		const { data: root, error: rootErr } = await supabase
			.from('student_enrolments')
			.insert({})
			.select('id')
			.single()

		if (rootErr) throw new Error(`Enrolment creation failed: ${rootErr.message}`)

		const enrolmentId = root.id

		let callNumber = groupNumber
		if (callNumber === null || callNumber === undefined || callNumber === '') {
			const { data: groupEnrolments } = await supabase
				.from('enrolment_groups')
				.select('enrolment_id')
				.eq('group_id', groupId)

			if (groupEnrolments && groupEnrolments.length > 0) {
				const eIds = groupEnrolments.map((g) => g.enrolment_id)
				const { data: nums } = await supabase
					.from('enrolment_group_numbers')
					.select('group_number')
					.in('enrolment_id', eIds)

				const maxNum = (nums || []).reduce((max, curr) => Math.max(max, curr.group_number || 0), 0)
				callNumber = maxNum + 1
			} else {
				callNumber = 1
			}
		}

		const inserts = [
			supabase.from('enrolment_students').insert({ enrolment_id: enrolmentId, student_id: studentId }),
			supabase.from('enrolment_groups').insert({ enrolment_id: enrolmentId, group_id: groupId }),
			supabase.from('enrolment_group_numbers').insert({ enrolment_id: enrolmentId, group_number: parseInt(callNumber, 10) })
		]

		if (academicYearId) {
			inserts.push(
				supabase.from('enrolment_academic_years').insert({ enrolment_id: enrolmentId, academic_year_id: academicYearId })
			)
		}

		const results = await Promise.all(inserts)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed setting enrolment details: ${failed.error.message}`)

		return enrolmentId
	},

	async removeEnrolment(enrolmentId) {
		const { error } = await supabase.from('student_enrolments').delete().eq('id', enrolmentId)
		if (error) throw new Error(`Failed to remove enrolment: ${error.message}`)
		return true
	}
}