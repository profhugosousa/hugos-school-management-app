import { supabase } from "../config/supabase";

/**
 * Service handling Lesson domain operations and auto-numbering.
 */
export const lessonService = {
	/**
	 * Fetch all lessons via flattened view.
	 */
	async getAll() {
		const { data, error } = await supabase
			.from("view_lessons")
			.select("*")
			.order("lesson_date", { ascending: false });

		if (error) throw new Error(`Failed to fetch lessons: ${error.message}`);
		return data;
	},

	/**
	 * Automatically calculate next lesson number for a group and duration.
	 * @param {string} groupId - Group UUID.
	 * @param {('45'|'50'|'90'|'100')} duration - Lesson duration enum.
	 * @returns {Promise<string>} Next lesson string (e.g. "13" or "13 e 14").
	 */
	async getNextLessonNumber(groupId, duration) {
		const { data, error } = await supabase.rpc("get_next_lesson_number", {
			p_group_id: groupId,
			p_duration: duration,
		});

		if (error)
			throw new Error(`Failed to compute next lesson number: ${error.message}`);
		return data;
	},

	/**
	 * Create new lesson in architecture.
	 */
	async create({
		academicYearId,
		groupId,
		subject,
		duration,
		lessonDate,
		lessonTime,
		summary = "",
		attentionBox = "",
		teacherNotes = "",
		stepByStep = [],
		materials = [],
	}) {
		// 1. Calculate sequential lesson number automatically
		const lessonNumber = await this.getNextLessonNumber(groupId, duration);

		// 2. Insert root entity
		const { data: root, error: rootError } = await supabase
			.from("lessons")
			.insert({})
			.select("id")
			.single();

		if (rootError)
			throw new Error(`Failed to create lesson root: ${rootError.message}`);
		const lessonId = root.id;

		// 3. Write into attribute tables
		const payloads = [
			supabase
				.from("lesson_academic_years")
				.insert({ lesson_id: lessonId, academic_year_id: academicYearId }),
			supabase
				.from("lesson_groups")
				.insert({ lesson_id: lessonId, group_id: groupId }),
			supabase.from("lesson_subjects").insert({ lesson_id: lessonId, subject }),
			supabase
				.from("lesson_durations")
				.insert({ lesson_id: lessonId, duration }),
			supabase
				.from("lesson_numbers")
				.insert({ lesson_id: lessonId, lesson_number: lessonNumber }),
			supabase
				.from("lesson_dates")
				.insert({ lesson_id: lessonId, lesson_date: lessonDate }),
			supabase
				.from("lesson_times")
				.insert({ lesson_id: lessonId, lesson_time: lessonTime }),
			supabase
				.from("lesson_summaries")
				.insert({ lesson_id: lessonId, summary }),
			supabase
				.from("lesson_attention_boxes")
				.insert({ lesson_id: lessonId, attention_box: attentionBox }),
			supabase
				.from("lesson_teacher_notes")
				.insert({ lesson_id: lessonId, teacher_notes: teacherNotes }),
			supabase
				.from("lesson_step_by_steps")
				.insert({ lesson_id: lessonId, step_by_step: stepByStep }),
			supabase
				.from("lesson_materials")
				.insert({ lesson_id: lessonId, materials }),
		];

		const results = await Promise.all(payloads);
		const failed = results.find((r) => r.error);
		if (failed)
			throw new Error(
				`Failed inserting lesson attributes: ${failed.error.message}`,
			);

		return this.getById(lessonId);
	},

	/**
	 * Fetch single lesson by ID.
	 */
	async getById(lessonId) {
		const { data, error } = await supabase
			.from("view_lessons")
			.select("*")
			.eq("id", lessonId)
			.single();

		if (error) throw new Error(`Failed to fetch lesson: ${error.message}`);
		return data;
	},

	/**
	 * Delete lesson entity (Cascades attribute tables).
	 */
	async delete(lessonId) {
		const { error } = await supabase
			.from("lessons")
			.delete()
			.eq("id", lessonId);
		if (error) throw new Error(`Failed to delete lesson: ${error.message}`);
		return true;
	},
};
