import { supabase } from '../config/supabase'

/**
 * Helper to fetch enrolment details for a set of student IDs and academic year.
 */
async function fetchEnrolmentsForStudents(studentIds, academicYearId = null) {
	if (!studentIds.length) return {}

	let query = supabase
		.from('enrolment_students')
		.select(`
            student_id,
            enrolment_id,
            student_enrolments!inner (
                id,
                enrolment_groups ( group_id ),
                enrolment_academic_years ( academic_year_id ),
                enrolment_group_numbers ( group_number )
            )
        `)
		.in('student_id', studentIds)

	if (academicYearId) {
		query = query.eq(
			'student_enrolments.enrolment_academic_years.academic_year_id',
			academicYearId
		)
	}

	const { data, error } = await query
	if (error) throw new Error(`Failed to fetch enrolments: ${error.message}`)

	const map = {}
	data?.forEach((row) => {
		const enrolment = row.student_enrolments
		map[row.student_id] = {
			enrolmentId: enrolment?.id,
			groupId: enrolment?.enrolment_groups?.[0]?.group_id || null,
			academicYearId: enrolment?.enrolment_academic_years?.[0]?.academic_year_id || null,
			groupNumber: enrolment?.enrolment_group_numbers?.[0]?.group_number || null,
		}
	})
	return map
}

/**
 * Helper to assign or update a student's enrolment in a group for an academic year.
 */
async function setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber }) {
	if (!groupId || !academicYearId) return null

	// Check if enrolment already exists for this student & academic year
	const enrolmentsMap = await fetchEnrolmentsForStudents([studentId], academicYearId)
	const existing = enrolmentsMap[studentId]

	let enrolmentId = existing?.enrolmentId

	if (!enrolmentId) {
		// Create root enrolment
		const { data: root, error: rootErr } = await supabase
			.from('student_enrolments')
			.insert({})
			.select('id')
			.single()

		if (rootErr) throw new Error(`Failed creating enrolment root: ${rootErr.message}`)
		enrolmentId = root.id

		// Link enrolment tables
		await Promise.all([
			supabase.from('enrolment_students').insert({ enrolment_id: enrolmentId, student_id: studentId }),
			supabase.from('enrolment_groups').insert({ enrolment_id: enrolmentId, group_id: groupId }),
			supabase.from('enrolment_academic_years').insert({ enrolment_id: enrolmentId, academic_year_id: academicYearId }),
		])
	} else {
		// Update group assignment
		await supabase
			.from('enrolment_groups')
			.upsert({ enrolment_id: enrolmentId, group_id: groupId })
	}

	// Set or update class number
	if (groupNumber !== undefined && groupNumber !== null) {
		await supabase
			.from('enrolment_group_numbers')
			.upsert({ enrolment_id: enrolmentId, group_number: parseInt(groupNumber, 10) })
	}

	return enrolmentId
}

export const studentService = {
	/**
	 * Fetch all students with their optional active group enrolment.
	 */
	async getAll(academicYearId = null) {
		const { data: students, error } = await supabase
			.from('view_students')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(`Failed to fetch students: ${error.message}`)
		if (!students || students.length === 0) return []

		const studentIds = students.map((s) => s.id)
		const enrolments = await fetchEnrolmentsForStudents(studentIds, academicYearId)

		return students.map((s) => ({
			...s,
			enrolment: enrolments[s.id] || null,
			groupId: enrolments[s.id]?.groupId || null,
			groupNumber: enrolments[s.id]?.groupNumber || null,
		}))
	},

	/**
	 * Fetch single student by ID with enrolment data.
	 */
	async getById(studentId, academicYearId = null) {
		const { data, error } = await supabase
			.from('view_students')
			.select('*')
			.eq('id', studentId)
			.single()

		if (error) throw new Error(`Failed to fetch student: ${error.message}`)

		const enrolments = await fetchEnrolmentsForStudents([studentId], academicYearId)
		return {
			...data,
			enrolment: enrolments[studentId] || null,
			groupId: enrolments[studentId]?.groupId || null,
			groupNumber: enrolments[studentId]?.groupNumber || null,
		}
	},

	/**
	 * Create single student with attributes & group enrolment.
	 */
	async create({
		processNumber,
		name,
		birthdate,
		gender = 'undefined',
		photoUrl = null,
		extraInfo = null,
		groupId = null,
		academicYearId = null,
		groupNumber = null,
	}) {
		const { data: root, error: rootError } = await supabase
			.from('students')
			.insert({})
			.select('id')
			.single()

		if (rootError) throw new Error(`Failed to create student: ${rootError.message}`)
		const studentId = root.id

		const payloads = [
			supabase.from('student_process_numbers').insert({ student_id: studentId, process_number: processNumber }),
			supabase.from('student_names').insert({ student_id: studentId, name }),
			supabase.from('student_genders').insert({ student_id: studentId, gender }),
		]

		if (birthdate) payloads.push(supabase.from('student_birthdates').insert({ student_id: studentId, birthdate }))
		if (photoUrl) payloads.push(supabase.from('student_photo_urls').insert({ student_id: studentId, photo_url: photoUrl }))
		if (extraInfo) payloads.push(supabase.from('student_extra_infos').insert({ student_id: studentId, extra_info: extraInfo }))

		const results = await Promise.all(payloads)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed inserting attributes: ${failed.error.message}`)

		if (groupId && academicYearId) {
			await setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber })
		}

		return this.getById(studentId, academicYearId)
	},

	/**
	 * Update student attributes and enrolment.
	 */
	async update(studentId, { processNumber, name, birthdate, gender, photoUrl, extraInfo, groupId, academicYearId, groupNumber }) {
		const updates = []

		if (processNumber !== undefined) updates.push(supabase.from('student_process_numbers').upsert({ student_id: studentId, process_number: processNumber }))
		if (name !== undefined) updates.push(supabase.from('student_names').upsert({ student_id: studentId, name }))
		if (gender !== undefined) updates.push(supabase.from('student_genders').upsert({ student_id: studentId, gender }))
		if (birthdate !== undefined) updates.push(supabase.from('student_birthdates').upsert({ student_id: studentId, birthdate }))
		if (photoUrl !== undefined) updates.push(supabase.from('student_photo_urls').upsert({ student_id: studentId, photo_url: photoUrl }))
		if (extraInfo !== undefined) updates.push(supabase.from('student_extra_infos').upsert({ student_id: studentId, extra_info: extraInfo }))

		const results = await Promise.all(updates)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed updating student attributes: ${failed.error.message}`)

		if (groupId !== undefined && academicYearId) {
			await setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber })
		}

		return this.getById(studentId, academicYearId)
	},

	/**
	 * Delete single student by ID.
	 */
	async delete(studentId) {
		const { error } = await supabase.from('students').delete().eq('id', studentId)
		if (error) throw new Error(`Failed to delete student: ${error.message}`)
		return true
	},

	/**
	 * Delete multiple selected students by array of IDs.
	 */
	async deleteMany(studentIds = []) {
		if (!studentIds.length) return true
		const { error } = await supabase.from('students').delete().in('id', studentIds)
		if (error) throw new Error(`Failed to delete selected students: ${error.message}`)
		return true
	},

	/**
	 * Batch create multiple students.
	 */
	async createMany(studentsList = [], { academicYearId = null, groupId = null } = {}) {
		const created = []
		for (const item of studentsList) {
			const res = await this.create({
				processNumber: item.processNumber || item.process_number || item.processNo,
				name: item.name,
				birthdate: item.birthdate || null,
				gender: item.gender || 'undefined',
				photoUrl: item.photoUrl || null,
				extraInfo: item.extraInfo || null,
				groupId: item.groupId || groupId,
				academicYearId: item.academicYearId || academicYearId,
				groupNumber: item.groupNumber || item.number || null,
			})
			created.push(res)
		}
		return created
	},

	/**
	 * Promote / Graduate students to a new group in a target academic year.
	 */
	async graduateStudents({ studentIds = [], targetAcademicYearId, targetGroupId }) {
		if (!studentIds.length || !targetAcademicYearId || !targetGroupId) {
			throw new Error('Missing required fields for graduation')
		}

		for (const studentId of studentIds) {
			await setStudentEnrolment(studentId, {
				groupId: targetGroupId,
				academicYearId: targetAcademicYearId,
			})
		}
		return true
	},

	/**
	 * Export student records to CSV, JSON, or TSV formatted strings.
	 */
	exportStudents(students = [], format = 'json') {
		const cleanData = students.map((s) => ({
			'Process Number': s.process_number || '',
			'Name': s.name || '',
			'Gender': s.gender || '',
			'Birthdate': s.birthdate || '',
			'Number': s.groupNumber || '',
			'Guardians': Array.isArray(s.guardians) ? s.guardians.map((g) => `${g.name || ''} (${g.phone_number || ''})`).join('; ') : '',
		}))

		if (format === 'json') {
			return JSON.stringify(cleanData, null, 2)
		}

		if (format === 'csv' || format === 'xlsx') {
			const headers = Object.keys(cleanData[0] || {}).join(',')
			const rows = cleanData.map((row) =>
				Object.values(row)
					.map((val) => `"${String(val).replace(/"/g, '""')}"`)
					.join(',')
			)
			return [headers, ...rows].join('\n')
		}

		return cleanData
	},

	/**
	 * Parse imported student rows (from CSV/JSON uploaders).
	 */
	async importStudents(parsedRows = [], { academicYearId = null, groupId = null } = {}) {
		const formatted = parsedRows.map((row) => ({
			processNumber: String(row['Process Number'] || row.process_number || row.processNumber || '').trim(),
			name: String(row['Name'] || row.name || '').trim(),
			gender: String(row['Gender'] || row.gender || 'undefined').toLowerCase().trim(),
			birthdate: row['Birthdate'] || row.birthdate || null,
			groupNumber: row['Number'] || row.number || row.groupNumber || null,
		})).filter((r) => r.processNumber && r.name)

		return this.createMany(formatted, { academicYearId, groupId })
	}
}