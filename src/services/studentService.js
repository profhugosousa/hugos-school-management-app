import { supabase } from '../config/supabase'

/**
 * Safely extracts a property from a PostgREST relation whether returned as an Array or a single Object.
 */
function extractRelProp(rel, prop) {
	if (!rel) return null
	if (Array.isArray(rel)) return rel[0]?.[prop] ?? null
	if (typeof rel === 'object') return rel[prop] ?? null
	return null
}

/**
 * Validates if a string is a valid UUID format.
 */
function isUUID(str) {
	return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim())
}

/**
 * Asserts that no batch operation in Promise.all returned a Supabase error response.
 */
function assertNoErrors(results, contextMsg = 'Database operation failed') {
	const failed = results.find((r) => r && r.error)
	if (failed) {
		throw new Error(`${contextMsg}: ${failed.error.message}`)
	}
}

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
		const gRel = enrolment?.enrolment_groups
		const yRel = enrolment?.enrolment_academic_years
		const numRel = enrolment?.enrolment_group_numbers

		map[row.student_id] = {
			enrolmentId: enrolment?.id,
			groupId: extractRelProp(gRel, 'group_id'),
			academicYearId: extractRelProp(yRel, 'academic_year_id'),
			groupNumber: extractRelProp(numRel, 'group_number'),
		}
	})
	return map
}

/**
 * Helper to assign or update a student's enrolment in a group for an academic year.
 */
async function setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber }) {
	if (!groupId || !academicYearId) return null

	const enrolmentsMap = await fetchEnrolmentsForStudents([studentId], academicYearId)
	const existing = enrolmentsMap[studentId]

	let enrolmentId = existing?.enrolmentId

	if (!enrolmentId) {
		const { data: root, error: rootErr } = await supabase
			.from('student_enrolments')
			.insert({})
			.select('id')
			.single()

		if (rootErr) throw new Error(`Failed creating enrolment root: ${rootErr.message}`)
		enrolmentId = root.id

		const res = await Promise.all([
			supabase.from('enrolment_students').insert({ enrolment_id: enrolmentId, student_id: studentId }),
			supabase.from('enrolment_groups').insert({ enrolment_id: enrolmentId, group_id: groupId }),
			supabase.from('enrolment_academic_years').insert({ enrolment_id: enrolmentId, academic_year_id: academicYearId }),
		])
		assertNoErrors(res, 'Failed setting student enrolment')
	} else {
		const res = await supabase
			.from('enrolment_groups')
			.upsert({ enrolment_id: enrolmentId, group_id: groupId }, { onConflict: 'enrolment_id' })
		if (res.error) throw new Error(`Failed updating enrolment group: ${res.error.message}`)
	}

	if (groupNumber !== undefined && groupNumber !== null && groupNumber !== '') {
		const res = await supabase
			.from('enrolment_group_numbers')
			.upsert({ enrolment_id: enrolmentId, group_number: parseInt(groupNumber, 10) }, { onConflict: 'enrolment_id' })
		if (res.error) throw new Error(`Failed updating group number: ${res.error.message}`)
	}

	return enrolmentId
}

export const studentService = {
	async getAll(academicYearId = null) {
		const { data: students, error } = await supabase
			.from('view_students')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(`Failed to fetch students: ${error.message}`)
		if (!students || students.length === 0) return []

		const { data: groupsData } = await supabase.from('view_groups').select('*')
		const groupMap = new Map((groupsData || []).map((g) => [g.id, g]))

		const studentIds = students.map((s) => s.id)
		const enrolments = await fetchEnrolmentsForStudents(studentIds, academicYearId)

		return students.map((s) => {
			const enrolment = enrolments[s.id] || null
			const gId = enrolment?.groupId || s.group_id || null
			const groupInfo = gId ? groupMap.get(gId) : null

			return {
				...s,
				enrolment,
				groupId: gId,
				group_id: gId,
				groupNumber: enrolment?.groupNumber ?? s.number ?? null,
				number: enrolment?.groupNumber ?? s.number ?? null,
				group_name: groupInfo?.name || groupInfo?.display_name || null,
				display_name: groupInfo?.display_name || null,
				level_id: groupInfo?.level_id || null,
				level_name: groupInfo?.level_name || null,
				academic_year_id: enrolment?.academicYearId || academicYearId || null,
			}
		})
	},

	async getById(studentId, academicYearId = null) {
		const { data, error } = await supabase
			.from('view_students')
			.select('*')
			.eq('id', studentId)
			.single()

		if (error) throw new Error(`Failed to fetch student: ${error.message}`)

		const { data: groupsData } = await supabase.from('view_groups').select('*')
		const groupMap = new Map((groupsData || []).map((g) => [g.id, g]))

		const enrolments = await fetchEnrolmentsForStudents([studentId], academicYearId)
		const enrolment = enrolments[studentId] || null
		const gId = enrolment?.groupId || data.group_id || null
		const groupInfo = gId ? groupMap.get(gId) : null

		return {
			...data,
			enrolment,
			groupId: gId,
			group_id: gId,
			groupNumber: enrolment?.groupNumber ?? data.number ?? null,
			number: enrolment?.groupNumber ?? data.number ?? null,
			group_name: groupInfo?.name || groupInfo?.display_name || null,
			display_name: groupInfo?.display_name || null,
			level_id: groupInfo?.level_id || null,
			level_name: groupInfo?.level_name || null,
			academic_year_id: enrolment?.academicYearId || academicYearId || null,
		}
	},

	async create(args = {}) {
		const processNumber = String(args.processNumber || args.process_number || args.processNo || '').trim()
		const name = String(args.name || '').trim()
		const birthdate = args.birthdate || null
		const gender = args.gender || 'undefined'
		const photoUrl = args.photoUrl || args.photo_url || null
		const extraInfo = args.extraInfo || args.extra_info || null
		const groupId = args.groupId || args.group_id || null
		const academicYearId = args.academicYearId || args.academic_year_id || null
		const groupNumber = args.groupNumber ?? args.group_number ?? args.number ?? null
		const guardianInfo = args.guardianInfo || args.guardian_info || null

		if (!processNumber) throw new Error('Process number is required to create a student.')
		if (!name) throw new Error('Student name is required.')

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
		assertNoErrors(results, 'Failed inserting attributes')

		if (guardianInfo && (guardianInfo.name || guardianInfo.phone || guardianInfo.email)) {
			const { data: gRoot, error: gErr } = await supabase
				.from('guardians')
				.insert({})
				.select('id')
				.single()

			if (!gErr && gRoot) {
				const gId = gRoot.id
				const gPayloads = []
				if (guardianInfo.name) gPayloads.push(supabase.from('guardian_names').insert({ guardian_id: gId, name: guardianInfo.name }))
				if (guardianInfo.phone) gPayloads.push(supabase.from('guardian_phones').insert({ guardian_id: gId, phone_number: guardianInfo.phone }))
				if (guardianInfo.email) gPayloads.push(supabase.from('guardian_emails').insert({ guardian_id: gId, email: guardianInfo.email }))

				const gResults = await Promise.all(gPayloads)
				assertNoErrors(gResults, 'Failed creating guardian details')

				await supabase.from('student_guardians').insert({ student_id: studentId, guardian_id: gId })

				if (guardianInfo.relationship) {
					await supabase.from('student_guardian_relationships').insert({
						student_id: studentId,
						guardian_id: gId,
						relationship: guardianInfo.relationship
					})
				}
			}
		}

		if (groupId && academicYearId) {
			await setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber })
		}

		return this.getById(studentId, academicYearId)
	},

	async update(studentId, args = {}) {
		const processNumber = args.processNumber || args.process_number
		const name = args.name
		const birthdate = args.birthdate
		const gender = args.gender
		const photoUrl = args.photoUrl || args.photo_url
		const extraInfo = args.extraInfo || args.extra_info
		const groupId = args.groupId || args.group_id
		const academicYearId = args.academicYearId || args.academic_year_id
		const groupNumber = args.groupNumber ?? args.group_number ?? args.number
		const guardianInfo = args.guardianInfo || args.guardian_info

		const updates = []

		if (processNumber !== undefined) updates.push(supabase.from('student_process_numbers').upsert({ student_id: studentId, process_number: processNumber }, { onConflict: 'student_id' }))
		if (name !== undefined) updates.push(supabase.from('student_names').upsert({ student_id: studentId, name }, { onConflict: 'student_id' }))
		if (gender !== undefined) updates.push(supabase.from('student_genders').upsert({ student_id: studentId, gender }, { onConflict: 'student_id' }))
		if (birthdate !== undefined) updates.push(supabase.from('student_birthdates').upsert({ student_id: studentId, birthdate }, { onConflict: 'student_id' }))
		if (photoUrl !== undefined) updates.push(supabase.from('student_photo_urls').upsert({ student_id: studentId, photo_url: photoUrl }, { onConflict: 'student_id' }))
		if (extraInfo !== undefined) updates.push(supabase.from('student_extra_infos').upsert({ student_id: studentId, extra_info: extraInfo }, { onConflict: 'student_id' }))

		const results = await Promise.all(updates)
		assertNoErrors(results, 'Failed updating student attributes')

		if (guardianInfo && (guardianInfo.name || guardianInfo.phone || guardianInfo.email)) {
			const { data: existingG } = await supabase
				.from('student_guardians')
				.select('guardian_id')
				.eq('student_id', studentId)
				.maybeSingle()

			let gId = existingG?.guardian_id

			if (!gId) {
				const { data: gRoot } = await supabase.from('guardians').insert({}).select('id').single()
				if (gRoot) {
					gId = gRoot.id
					await supabase.from('student_guardians').insert({ student_id: studentId, guardian_id: gId })
				}
			}

			if (gId) {
				const gUpdates = []
				if (guardianInfo.name !== undefined) gUpdates.push(supabase.from('guardian_names').upsert({ guardian_id: gId, name: guardianInfo.name }, { onConflict: 'guardian_id' }))
				if (guardianInfo.phone !== undefined) gUpdates.push(supabase.from('guardian_phones').upsert({ guardian_id: gId, phone_number: guardianInfo.phone }, { onConflict: 'guardian_id' }))
				if (guardianInfo.email !== undefined) gUpdates.push(supabase.from('guardian_emails').upsert({ guardian_id: gId, email: guardianInfo.email }, { onConflict: 'guardian_id' }))
				const gRes = await Promise.all(gUpdates)
				assertNoErrors(gRes, 'Failed updating guardian attributes')

				if (guardianInfo.relationship !== undefined) {
					await supabase.from('student_guardian_relationships').upsert({
						student_id: studentId,
						guardian_id: gId,
						relationship: guardianInfo.relationship
					}, { onConflict: 'student_id,guardian_id' })
				}
			}
		}

		if (groupId !== undefined && academicYearId) {
			await setStudentEnrolment(studentId, { groupId, academicYearId, groupNumber })
		}

		return this.getById(studentId, academicYearId)
	},

	async delete(studentId) {
		const { error } = await supabase.from('students').delete().eq('id', studentId)
		if (error) throw new Error(`Failed to delete student: ${error.message}`)
		return true
	},

	async checkDuplicates(processNumbers = []) {
		if (!processNumbers.length) return []
		const cleanNumbers = processNumbers.map((p) => String(p).trim()).filter(Boolean)
		if (!cleanNumbers.length) return []

		const { data, error } = await supabase
			.from('view_students')
			.select('id, process_number, name')
			.in('process_number', cleanNumbers)

		if (error) throw new Error(`Failed to check duplicates: ${error.message}`)
		return data || []
	},

	async bulkImport(studentsList = [], { conflictStrategy = 'skip', defaultAcademicYearId = null, defaultGroupId = null } = {}) {
		if (!studentsList.length) return { importedCount: 0, updatedCount: 0, skippedCount: 0 }

		// 1. Resolve fallback Active Academic Year if default not passed
		let fallbackYearId = defaultAcademicYearId
		if (!fallbackYearId) {
			const { data: activeYearData } = await supabase
				.from('academic_year_active_statuses')
				.select('academic_year_id')
				.eq('is_active', true)
				.maybeSingle()
			fallbackYearId = activeYearData?.academic_year_id || null
		}

		// 2. Fetch Group & Academic Year resolution maps
		const { data: dbGroups } = await supabase.from('view_groups').select('id, name, display_name')
		const groupResolver = new Map()
		dbGroups?.forEach((g) => {
			if (g.id) groupResolver.set(g.id, g.id)
			if (g.name) groupResolver.set(g.name.toLowerCase().trim(), g.id)
			if (g.display_name) groupResolver.set(g.display_name.toLowerCase().trim(), g.id)
		})

		const { data: dbYears } = await supabase.from('academic_year_labels').select('academic_year_id, label')
		const yearResolver = new Map()
		dbYears?.forEach((y) => {
			if (y.academic_year_id) yearResolver.set(y.academic_year_id, y.academic_year_id)
			if (y.label) yearResolver.set(y.label.toLowerCase().trim(), y.academic_year_id)
		})

		// 3. Duplicate Check
		const processNumbers = studentsList.map((s) => String(s.process_number || s.processNumber || '').trim()).filter(Boolean)
		const existingRecords = await this.checkDuplicates(processNumbers)
		const existingMap = new Map(existingRecords.map((r) => [r.process_number, r.id]))

		const toCreate = []
		const toUpdate = []
		let skippedCount = 0

		studentsList.forEach((item) => {
			const procNo = String(item.process_number || item.processNumber || '').trim()
			if (!procNo) return

			if (existingMap.has(procNo)) {
				if (conflictStrategy === 'update') {
					toUpdate.push({ ...item, id: existingMap.get(procNo) })
				} else {
					skippedCount++
				}
			} else {
				toCreate.push(item)
			}
		})

		// Helper to resolve Group ID (accepts UUID directly, or matches name via resolver)
		const resolveGroup = (rawGroup) => {
			const str = String(rawGroup || '').trim()
			if (!str) return defaultGroupId || null
			if (isUUID(str)) return str
			return groupResolver.get(str) || groupResolver.get(str.toLowerCase()) || defaultGroupId || null
		}

		// Helper to resolve Academic Year ID (accepts UUID directly, or matches label)
		const resolveYear = (rawYear) => {
			const str = String(rawYear || '').trim()
			if (!str) return fallbackYearId || null
			if (isUUID(str)) return str
			return yearResolver.get(str) || yearResolver.get(str.toLowerCase()) || fallbackYearId || null
		}

		// ---------------------------------------------------------------------
		// BATCH CREATE
		// ---------------------------------------------------------------------
		if (toCreate.length > 0) {
			const studentRoots = []
			const processPayloads = []
			const namePayloads = []
			const genderPayloads = []
			const birthdatePayloads = []
			const photoPayloads = []
			const extraInfoPayloads = []

			const enrolmentRoots = []
			const enrolmentStudents = []
			const enrolmentGroups = []
			const enrolmentYears = []
			const enrolmentNumbers = []

			const guardianRoots = []
			const guardianNames = []
			const guardianPhones = []
			const guardianEmails = []
			const studentGuardians = []
			const studentGuardianRels = []

			toCreate.forEach((item) => {
				const studentId = crypto.randomUUID()
				const procNo = String(item.process_number || item.processNumber || '').trim()
				const name = String(item.name || '').trim()
				const gender = item.gender || 'undefined'
				const birthdate = item.birthdate || null
				const photoUrl = item.photo_url || item.photoUrl || null
				const extraInfo = item.extra_info || item.extraInfo || null

				const resolvedGroupId = resolveGroup(item.group_id || item.groupId)
				const resolvedYearId = resolveYear(item.academic_year_id || item.academicYearId)
				const groupNumber = item.number ?? item.groupNumber ?? item.group_number ?? null
				const gInfo = item.guardian_info || item.guardianInfo || null

				studentRoots.push({ id: studentId })
				processPayloads.push({ student_id: studentId, process_number: procNo })
				namePayloads.push({ student_id: studentId, name })
				genderPayloads.push({ student_id: studentId, gender })

				if (birthdate) birthdatePayloads.push({ student_id: studentId, birthdate })
				if (photoUrl) photoPayloads.push({ student_id: studentId, photo_url: photoUrl })
				if (extraInfo) extraInfoPayloads.push({ student_id: studentId, extra_info: extraInfo })

				if (resolvedGroupId && resolvedYearId) {
					const enrolmentId = crypto.randomUUID()
					enrolmentRoots.push({ id: enrolmentId })
					enrolmentStudents.push({ enrolment_id: enrolmentId, student_id: studentId })
					enrolmentGroups.push({ enrolment_id: enrolmentId, group_id: resolvedGroupId })
					enrolmentYears.push({ enrolment_id: enrolmentId, academic_year_id: resolvedYearId })
					if (groupNumber !== null && groupNumber !== undefined && groupNumber !== '') {
						enrolmentNumbers.push({ enrolment_id: enrolmentId, group_number: parseInt(groupNumber, 10) })
					}
				}

				if (gInfo && (gInfo.name || gInfo.phone || gInfo.email)) {
					const guardianId = crypto.randomUUID()
					guardianRoots.push({ id: guardianId })
					if (gInfo.name) guardianNames.push({ guardian_id: guardianId, name: gInfo.name })
					if (gInfo.phone) guardianPhones.push({ guardian_id: guardianId, phone_number: gInfo.phone })
					if (gInfo.email) guardianEmails.push({ guardian_id: guardianId, email: gInfo.email })

					studentGuardians.push({ student_id: studentId, guardian_id: guardianId })
					if (gInfo.relationship) {
						studentGuardianRels.push({
							student_id: studentId,
							guardian_id: guardianId,
							relationship: gInfo.relationship
						})
					}
				}
			})

			const rootRes = await supabase.from('students').insert(studentRoots)
			if (rootRes.error) throw new Error(`Failed inserting student roots: ${rootRes.error.message}`)

			const batchAttrPromises = [
				supabase.from('student_process_numbers').insert(processPayloads),
				supabase.from('student_names').insert(namePayloads),
				supabase.from('student_genders').insert(genderPayloads),
			]
			if (birthdatePayloads.length) batchAttrPromises.push(supabase.from('student_birthdates').insert(birthdatePayloads))
			if (photoPayloads.length) batchAttrPromises.push(supabase.from('student_photo_urls').insert(photoPayloads))
			if (extraInfoPayloads.length) batchAttrPromises.push(supabase.from('student_extra_infos').insert(extraInfoPayloads))

			const attrRes = await Promise.all(batchAttrPromises)
			assertNoErrors(attrRes, 'Failed inserting student attributes')

			if (enrolmentRoots.length) {
				const enrRootRes = await supabase.from('student_enrolments').insert(enrolmentRoots)
				if (enrRootRes.error) throw new Error(`Failed inserting enrolment roots: ${enrRootRes.error.message}`)

				const batchEnrolPromises = [
					supabase.from('enrolment_students').insert(enrolmentStudents),
					supabase.from('enrolment_groups').insert(enrolmentGroups),
					supabase.from('enrolment_academic_years').insert(enrolmentYears),
				]
				if (enrolmentNumbers.length) batchEnrolPromises.push(supabase.from('enrolment_group_numbers').insert(enrolmentNumbers))
				const enrRes = await Promise.all(batchEnrolPromises)
				assertNoErrors(enrRes, 'Failed inserting enrolment details')
			}

			if (guardianRoots.length) {
				await supabase.from('guardians').insert(guardianRoots)
				const batchGPromises = []
				if (guardianNames.length) batchGPromises.push(supabase.from('guardian_names').insert(guardianNames))
				if (guardianPhones.length) batchGPromises.push(supabase.from('guardian_phones').insert(guardianPhones))
				if (guardianEmails.length) batchGPromises.push(supabase.from('guardian_emails').insert(guardianEmails))
				const gRes = await Promise.all(batchGPromises)
				assertNoErrors(gRes, 'Failed inserting guardian details')

				await supabase.from('student_guardians').insert(studentGuardians)
				if (studentGuardianRels.length) {
					await supabase.from('student_guardian_relationships').insert(studentGuardianRels)
				}
			}
		}

		// ---------------------------------------------------------------------
		// BATCH UPDATE
		// ---------------------------------------------------------------------
		if (toUpdate.length > 0) {
			const processPayloads = []
			const namePayloads = []
			const genderPayloads = []
			const birthdatePayloads = []
			const photoPayloads = []
			const extraInfoPayloads = []

			const updateStudentIds = toUpdate.map((s) => s.id)
			const existingEnrolments = fallbackYearId
				? await fetchEnrolmentsForStudents(updateStudentIds, fallbackYearId)
				: {}

			const enrolmentRoots = []
			const enrolmentStudents = []
			const enrolmentGroups = []
			const enrolmentYears = []
			const enrolmentNumbers = []

			toUpdate.forEach((item) => {
				const studentId = item.id
				const procNo = String(item.process_number || item.processNumber || '').trim()
				const name = String(item.name || '').trim()
				const gender = item.gender || 'undefined'
				const birthdate = item.birthdate || null
				const photoUrl = item.photo_url || item.photoUrl || null
				const extraInfo = item.extra_info || item.extraInfo || null

				const resolvedGroupId = resolveGroup(item.group_id || item.groupId)
				const resolvedYearId = resolveYear(item.academic_year_id || item.academicYearId)
				const groupNumber = item.number ?? item.groupNumber ?? item.group_number ?? null

				if (procNo) processPayloads.push({ student_id: studentId, process_number: procNo })
				if (name) namePayloads.push({ student_id: studentId, name })
				if (gender) genderPayloads.push({ student_id: studentId, gender })
				if (birthdate) birthdatePayloads.push({ student_id: studentId, birthdate })
				if (photoUrl) photoPayloads.push({ student_id: studentId, photo_url: photoUrl })
				if (extraInfo) extraInfoPayloads.push({ student_id: studentId, extra_info: extraInfo })

				if (resolvedGroupId && resolvedYearId) {
					const existingEnrolment = existingEnrolments[studentId]
					let enrolmentId = existingEnrolment?.enrolmentId

					if (!enrolmentId) {
						enrolmentId = crypto.randomUUID()
						enrolmentRoots.push({ id: enrolmentId })
						enrolmentStudents.push({ enrolment_id: enrolmentId, student_id: studentId })
						enrolmentGroups.push({ enrolment_id: enrolmentId, group_id: resolvedGroupId })
						enrolmentYears.push({ enrolment_id: enrolmentId, academic_year_id: resolvedYearId })
					} else {
						enrolmentGroups.push({ enrolment_id: enrolmentId, group_id: resolvedGroupId })
					}

					if (groupNumber !== null && groupNumber !== undefined && groupNumber !== '') {
						enrolmentNumbers.push({ enrolment_id: enrolmentId, group_number: parseInt(groupNumber, 10) })
					}
				}
			})

			const batchUpdatePromises = []
			if (processPayloads.length) batchUpdatePromises.push(supabase.from('student_process_numbers').upsert(processPayloads, { onConflict: 'student_id' }))
			if (namePayloads.length) batchUpdatePromises.push(supabase.from('student_names').upsert(namePayloads, { onConflict: 'student_id' }))
			if (genderPayloads.length) batchUpdatePromises.push(supabase.from('student_genders').upsert(genderPayloads, { onConflict: 'student_id' }))
			if (birthdatePayloads.length) batchUpdatePromises.push(supabase.from('student_birthdates').upsert(birthdatePayloads, { onConflict: 'student_id' }))
			if (photoPayloads.length) batchUpdatePromises.push(supabase.from('student_photo_urls').upsert(photoPayloads, { onConflict: 'student_id' }))
			if (extraInfoPayloads.length) batchUpdatePromises.push(supabase.from('student_extra_infos').upsert(extraInfoPayloads, { onConflict: 'student_id' }))

			const updRes = await Promise.all(batchUpdatePromises)
			assertNoErrors(updRes, 'Failed updating student attributes')

			if (enrolmentRoots.length) {
				await supabase.from('student_enrolments').insert(enrolmentRoots)
				await Promise.all([
					supabase.from('enrolment_students').insert(enrolmentStudents),
					supabase.from('enrolment_academic_years').insert(enrolmentYears)
				])
			}

			const batchEnrolmentUpdatePromises = []
			if (enrolmentGroups.length) batchEnrolmentUpdatePromises.push(supabase.from('enrolment_groups').upsert(enrolmentGroups, { onConflict: 'enrolment_id' }))
			if (enrolmentNumbers.length) batchEnrolmentUpdatePromises.push(supabase.from('enrolment_group_numbers').upsert(enrolmentNumbers, { onConflict: 'enrolment_id' }))

			if (batchEnrolmentUpdatePromises.length) {
				const enrUpdRes = await Promise.all(batchEnrolmentUpdatePromises)
				assertNoErrors(enrUpdRes, 'Failed updating enrolment groups')
			}
		}

		return {
			importedCount: toCreate.length,
			updatedCount: toUpdate.length,
			skippedCount
		}
	}
}