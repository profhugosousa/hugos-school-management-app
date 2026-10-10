import { supabase } from '../config/supabase'

function assertNoErrors(results, contextMsg = 'Database operation failed') {
	const failed = results.find((r) => r && r.error)
	if (failed) {
		throw new Error(`${contextMsg}: ${failed.error.message}`)
	}
}

/**
 * @typedef {Object} Evaluation
 * @property {string} id - Evaluation UUID.
 * @property {string|null} lessonId - Associated lesson UUID.
 * @property {string|null} studentId - Associated student UUID.
 * @property {boolean} isAttending - Attendance status.
 * @property {number|null} studentRating - Student self-evaluation score/rating.
 * @property {number|null} teacherRating - Teacher evaluation score/rating.
 * @property {string} notes - Qualitative feedback or observation comments.
 */

/**
 * Service managing student evaluation and attendance records.
 */
export const evaluationService = {
	/**
	 * Retrieves all student evaluation records associated with a specific lesson.
	 * @param {string} lessonId - Target lesson UUID.
	 * @returns {Promise<Evaluation[]>} List of evaluations for the given lesson.
	 */
	async getByLesson(lessonId) {
		const { data: lessonEvals, error } = await supabase
			.from('evaluation_lessons')
			.select('evaluation_id')
			.eq('lesson_id', lessonId)

		if (error) throw new Error(`Failed to fetch evaluations for lesson: ${error.message}`)
		if (!lessonEvals || !lessonEvals.length) return []

		return Promise.all(lessonEvals.map((e) => this.getById(e.evaluation_id)))
	},

	/**
	 * Retrieves an evaluation record by ID.
	 * @param {string} id - Evaluation UUID.
	 * @returns {Promise<Evaluation>} Evaluation object.
	 */
	async getById(id) {
		const [lesson, student, attending, sRating, tRating, notes] = await Promise.all([
			supabase.from('evaluation_lessons').select('lesson_id').eq('evaluation_id', id).single(),
			supabase.from('evaluation_students').select('student_id').eq('evaluation_id', id).single(),
			supabase.from('evaluation_attending_statuses').select('is_attending').eq('evaluation_id', id).single(),
			supabase.from('evaluation_student_ratings').select('student_rating').eq('evaluation_id', id).single(),
			supabase.from('evaluation_teacher_ratings').select('teacher_rating').eq('evaluation_id', id).single(),
			supabase.from('evaluation_notes').select('notes').eq('evaluation_id', id).single()
		])

		return {
			id,
			lessonId: lesson.data?.lesson_id || null,
			studentId: student.data?.student_id || null,
			isAttending: attending.data?.is_attending ?? true,
			studentRating: sRating.data?.student_rating || null,
			teacherRating: tRating.data?.teacher_rating || null,
			notes: notes.data?.notes || ''
		}
	},

	/**
	 * Fetches all evaluations joined with lessons, groups, and levels for reporting.
	 */
	async getAnalyticsData() {
		const [evalsRes, lessonsRes, groupsRes, studentsRes] = await Promise.all([
			supabase.from('view_evaluations').select('*'),
			supabase.from('view_lessons').select('*'),
			supabase.from('view_groups').select('*'),
			supabase.from('view_students').select('*')
		])

		if (evalsRes.error) throw new Error(`Failed fetching evaluations: ${evalsRes.error.message}`)
		if (lessonsRes.error) throw new Error(`Failed fetching lessons: ${lessonsRes.error.message}`)
		if (groupsRes.error) throw new Error(`Failed fetching groups: ${groupsRes.error.message}`)

		return {
			evaluations: evalsRes.data || [],
			lessons: lessonsRes.data || [],
			groups: groupsRes.data || [],
			students: studentsRes.data || []
		}
	},

	/**
	 * Fetches students enrolled in a group for evaluation mapping.
	 */
	async getEnrolledStudents(groupId, academicYearId = null) {
		const { data: students, error } = await supabase
			.from('view_students')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(`Failed to fetch students: ${error.message}`)
		if (!students || !students.length) return []

		let query = supabase
			.from('enrolment_students')
			.select(`
				student_id,
				student_enrolments!inner (
					id,
					enrolment_groups!inner ( group_id ),
					enrolment_academic_years ( academic_year_id ),
					enrolment_group_numbers ( group_number )
				)
			`)
			.eq('student_enrolments.enrolment_groups.group_id', groupId)

		if (academicYearId) {
			query = query.eq('student_enrolments.enrolment_academic_years.academic_year_id', academicYearId)
		}

		const { data: enrolments } = await query
		const enrolMap = new Map()
		enrolments?.forEach((e) => {
			const enr = e.student_enrolments
			const numRel = enr?.enrolment_group_numbers
			const groupNum = Array.isArray(numRel) ? numRel[0]?.group_number : numRel?.group_number
			enrolMap.set(e.student_id, groupNum ?? null)
		})

		return students
			.filter((s) => enrolMap.has(s.id))
			.map((s) => ({ ...s, groupNumber: enrolMap.get(s.id) }))
			.sort((a, b) => (a.groupNumber ?? Infinity) - (b.groupNumber ?? Infinity))
	},

	/**
	 * Creates a new evaluation record for a student in a lesson.
	 */
	async create({ lessonId, studentId, isAttending = true, studentRating = null, teacherRating = null, notes = '' }) {
		const { data: root, error } = await supabase
			.from('evaluations')
			.insert({})
			.select('id')
			.single()

		if (error) throw new Error(`Failed evaluation creation: ${error.message}`)
		const evalId = root.id

		await Promise.all([
			supabase.from('evaluation_lessons').insert({ evaluation_id: evalId, lesson_id: lessonId }),
			supabase.from('evaluation_students').insert({ evaluation_id: evalId, student_id: studentId }),
			supabase.from('evaluation_attending_statuses').insert({ evaluation_id: evalId, is_attending: isAttending }),
			supabase.from('evaluation_student_ratings').insert({ evaluation_id: evalId, student_rating: studentRating }),
			supabase.from('evaluation_teacher_ratings').insert({ evaluation_id: evalId, teacher_rating: teacherRating }),
			supabase.from('evaluation_notes').insert({ evaluation_id: evalId, notes })
		])

		return this.getById(evalId)
	},

	/**
	 * Updates an existing evaluation entry.
	 */
	async update(id, { isAttending, studentRating, teacherRating, notes }) {
		const updates = []

		if (isAttending !== undefined) {
			updates.push(supabase.from('evaluation_attending_statuses').upsert({ evaluation_id: id, is_attending: isAttending }))
		}
		if (studentRating !== undefined) {
			updates.push(supabase.from('evaluation_student_ratings').upsert({ evaluation_id: id, student_rating: studentRating }))
		}
		if (teacherRating !== undefined) {
			updates.push(supabase.from('evaluation_teacher_ratings').upsert({ evaluation_id: id, teacher_rating: teacherRating }))
		}
		if (notes !== undefined) {
			updates.push(supabase.from('evaluation_notes').upsert({ evaluation_id: id, notes }))
		}

		const results = await Promise.all(updates)
		assertNoErrors(results, 'Failed updating evaluation')

		return this.getById(id)
	},

	/**
	 * Batch saves evaluations using existing create/update methods.
	 */
	async saveBatch(lessonId, items = []) {
		const existing = await this.getByLesson(lessonId)
		const existingMap = new Map(existing.map((e) => [e.studentId, e]))

		await Promise.all(
			items.map((item) => {
				const current = existingMap.get(item.studentId)
				if (current) {
					return this.update(current.id, {
						isAttending: item.isAttending,
						studentRating: item.studentRating,
						teacherRating: item.teacherRating,
						notes: item.notes
					})
				} else {
					return this.create({
						lessonId,
						studentId: item.studentId,
						isAttending: item.isAttending,
						studentRating: item.studentRating,
						teacherRating: item.teacherRating,
						notes: item.notes
					})
				}
			})
		)
		return true
	},

	async delete(id) {
		const { error } = await supabase.from('evaluations').delete().eq('id', id)
		if (error) throw new Error(`Failed deleting evaluation: ${error.message}`)
		return true
	},

	async deleteAll() {
		const { error } = await supabase
			.from('evaluations')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all evaluations: ${error.message}`)
		return true
	}
}