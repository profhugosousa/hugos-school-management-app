import { supabase } from '../config/supabase'

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
	 * @throws {Error} If database fetch fails.
	 */
	async getByLesson(lessonId) {
		const { data: lessonEvals, error } = await supabase
			.from('evaluation_lessons')
			.select('evaluation_id')
			.eq('lesson_id', lessonId)

		if (error) throw new Error(`Failed to fetch evaluations for lesson: ${error.message}`)
		if (!lessonEvals) return []

		return Promise.all(lessonEvals.map((e) => this.getById(e.evaluation_id)))
	},

	/**
	 * Retrieves an evaluation record by ID.
	 * @param {string} id - Evaluation UUID.
	 * @returns {Promise<Evaluation>} Evaluation object.
	 * @throws {Error} If fetch fails.
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
	 * Creates a new evaluation record for a student in a lesson.
	 * @param {Omit<Evaluation, 'id'>} data - Evaluation details.
	 * @returns {Promise<Evaluation>} Created evaluation object.
	 * @throws {Error} If insert operation fails.
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
	 * @param {string} id - Evaluation UUID.
	 * @param {Partial<Omit<Evaluation, 'id'|'lessonId'|'studentId'>>} updates - Attributes to update.
	 * @returns {Promise<Evaluation>} Updated evaluation record.
	 * @throws {Error} If update fails.
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
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed updating evaluation: ${failed.error.message}`)

		return this.getById(id)
	},

	/**
	 * Deletes an evaluation entry by ID.
	 * @param {string} id - Evaluation UUID.
	 * @returns {Promise<boolean>} True if successfully deleted.
	 * @throws {Error} If deletion fails.
	 */
	async delete(id) {
		const { error } = await supabase.from('evaluations').delete().eq('id', id)
		if (error) throw new Error(`Failed deleting evaluation: ${error.message}`)
		return true
	},

	/**
	 * Wipes all evaluation entries from the database.
	 * @returns {Promise<boolean>} True if operation succeeded.
	 * @throws {Error} If operation fails.
	 */
	async deleteAll() {
		const { error } = await supabase
			.from('evaluations')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all evaluations: ${error.message}`)
		return true
	}
}