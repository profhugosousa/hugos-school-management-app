import { supabase } from "../config/supabase";

/**
 * Normalizes input objects so both snake_case and camelCase payloads work transparently.
 */
const normalizePayload = (payload = {}) => ({
	academicYearId: payload.academicYearId || payload.academic_year_id,
	groupId: payload.groupId || payload.group_id,
	subject: payload.subject,
	duration: payload.duration ? String(payload.duration) : '50',
	lessonDate: payload.lessonDate || payload.lesson_date,
	lessonTime: payload.lessonTime || payload.lesson_time,
	summary: payload.summary || "",
	attentionBox: payload.attentionBox || payload.attention_box || "",
	teacherNotes: payload.teacherNotes || payload.teacher_notes || "",
	stepByStep: payload.stepByStep || payload.step_by_step || [],
	materials: payload.materials || [],
});

export const lessonService = {
	async getAll() {
		const { data, error } = await supabase
			.from("view_lessons")
			.select("*")
			.order("lesson_date", { ascending: true })
			.order("lesson_time", { ascending: true });

		if (error) throw new Error(`Failed to fetch lessons: ${error.message}`);
		return data;
	},

	async getById(lessonId) {
		const { data, error } = await supabase
			.from("view_lessons")
			.select("*")
			.eq("id", lessonId)
			.single();

		if (error) throw new Error(`Failed to fetch lesson: ${error.message}`);
		return data;
	},

	async getByAcademicYear(academicYearId) {
		const { data, error } = await supabase
			.from("view_lessons")
			.select("*")
			.eq("academic_year_id", academicYearId)
			.order("lesson_date", { ascending: true })
			.order("lesson_time", { ascending: true });

		if (error) throw new Error(`Failed to fetch lessons for academic year: ${error.message}`);
		return data;
	},

	/**
	 * Calls PostgreSQL RPC function to recalculate lesson numbers for a group.
	 */
	async recalculateGroupLessonNumbers(groupId) {
		if (!groupId) return;
		const { error } = await supabase.rpc("recalculate_group_lesson_numbers", {
			p_group_id: groupId,
		});

		if (error) {
			throw new Error(`Failed to recalculate lesson numbers: ${error.message}`);
		}
	},

	async create(rawPayload) {
		const payload = normalizePayload(rawPayload);

		if (!payload.groupId) {
			throw new Error("Failed creating lesson: Group ID is required.");
		}

		// Insert root entity
		const { data: root, error: rootError } = await supabase
			.from("lessons")
			.insert({})
			.select("id")
			.single();

		if (rootError) throw new Error(`Failed to create lesson root: ${rootError.message}`);
		const lessonId = root.id;

		// Write into attribute tables
		const payloads = [
			supabase.from("lesson_academic_years").insert({ lesson_id: lessonId, academic_year_id: payload.academicYearId }),
			supabase.from("lesson_groups").insert({ lesson_id: lessonId, group_id: payload.groupId }),
			supabase.from("lesson_subjects").insert({ lesson_id: lessonId, subject: payload.subject }),
			supabase.from("lesson_durations").insert({ lesson_id: lessonId, duration: payload.duration }),
			supabase.from("lesson_dates").insert({ lesson_id: lessonId, lesson_date: payload.lessonDate }),
			supabase.from("lesson_times").insert({ lesson_id: lessonId, lesson_time: payload.lessonTime }),
			supabase.from("lesson_summaries").insert({ lesson_id: lessonId, summary: payload.summary }),
			supabase.from("lesson_attention_boxes").insert({ lesson_id: lessonId, attention_box: payload.attentionBox }),
			supabase.from("lesson_teacher_notes").insert({ lesson_id: lessonId, teacher_notes: payload.teacherNotes }),
			supabase.from("lesson_step_by_steps").insert({ lesson_id: lessonId, step_by_step: payload.stepByStep }),
			supabase.from("lesson_materials").insert({ lesson_id: lessonId, materials: payload.materials }),
		];

		const results = await Promise.all(payloads);
		const failed = results.find((r) => r.error);
		if (failed) throw new Error(`Failed inserting lesson attributes: ${failed.error.message}`);

		// Automatically recalculate and sync sequential numbers for this group
		await this.recalculateGroupLessonNumbers(payload.groupId);

		return this.getById(lessonId);
	},

	async update(id, rawPayload) {
		const payload = normalizePayload(rawPayload);

		if (!payload.groupId) {
			throw new Error("Failed updating lesson: Group ID is required.");
		}

		// Fetch existing group to handle potential group changes
		const { data: oldGroupRel } = await supabase
			.from("lesson_groups")
			.select("group_id")
			.eq("lesson_id", id)
			.maybeSingle();

		const oldGroupId = oldGroupRel?.group_id;

		const payloads = [
			supabase.from("lesson_groups").upsert({ lesson_id: id, group_id: payload.groupId }, { onConflict: "lesson_id" }),
			supabase.from("lesson_subjects").upsert({ lesson_id: id, subject: payload.subject }, { onConflict: "lesson_id" }),
			supabase.from("lesson_durations").upsert({ lesson_id: id, duration: payload.duration }, { onConflict: "lesson_id" }),
			supabase.from("lesson_dates").upsert({ lesson_id: id, lesson_date: payload.lessonDate }, { onConflict: "lesson_id" }),
			supabase.from("lesson_times").upsert({ lesson_id: id, lesson_time: payload.lessonTime }, { onConflict: "lesson_id" }),
			supabase.from("lesson_summaries").upsert({ lesson_id: id, summary: payload.summary }, { onConflict: "lesson_id" }),
			supabase.from("lesson_attention_boxes").upsert({ lesson_id: id, attention_box: payload.attentionBox }, { onConflict: "lesson_id" }),
			supabase.from("lesson_teacher_notes").upsert({ lesson_id: id, teacher_notes: payload.teacherNotes }, { onConflict: "lesson_id" }),
			supabase.from("lesson_step_by_steps").upsert({ lesson_id: id, step_by_step: payload.stepByStep }, { onConflict: "lesson_id" }),
			supabase.from("lesson_materials").upsert({ lesson_id: id, materials: payload.materials }, { onConflict: "lesson_id" }),
		];

		const results = await Promise.all(payloads);
		const failed = results.find((r) => r.error);
		if (failed) throw new Error(`Failed updating lesson attributes: ${failed.error.message}`);

		// Recalculate current group
		await this.recalculateGroupLessonNumbers(payload.groupId);

		// Recalculate previous group if lesson was reassigned
		if (oldGroupId && oldGroupId !== payload.groupId) {
			await this.recalculateGroupLessonNumbers(oldGroupId);
		}

		return this.getById(id);
	},

	async delete(lessonId) {
		// Fetch group_id before deletion
		const { data: lessonGroup } = await supabase
			.from("lesson_groups")
			.select("group_id")
			.eq("lesson_id", lessonId)
			.maybeSingle();

		const groupId = lessonGroup?.group_id;

		const { error } = await supabase
			.from("lessons")
			.delete()
			.eq("id", lessonId);

		if (error) throw new Error(`Failed to delete lesson: ${error.message}`);

		// Automatically recalculate remaining lessons for the group
		if (groupId) {
			await this.recalculateGroupLessonNumbers(groupId);
		}

		return true;
	},
};