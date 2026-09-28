import { supabase } from "../config/supabase";

/**
 * Service handling CRUD operations for Student domain models in schema.
 */
export const studentService = {
	/**
	 * Fetch all students via flattened view.
	 * @returns {Promise<Array<Object>>} List of student objects.
	 */
	async getAll() {
		const { data, error } = await supabase
			.from("view_students")
			.select("*")
			.order("name", { ascending: true });

		if (error) throw new Error(`Failed to fetch students: ${error.message}`);
		return data;
	},

	/**
	 * Fetch single student by ID.
	 * @param {string} studentId - UUID of the student.
	 * @returns {Promise<Object>} Student record.
	 */
	async getById(studentId) {
		const { data, error } = await supabase
			.from("view_students")
			.select("*")
			.eq("id", studentId)
			.single();

		if (error) throw new Error(`Failed to fetch student: ${error.message}`);
		return data;
	},

	/**
	 * Create a new student across decomposed tables.
	 * @param {Object} studentData - Student attributes.
	 * @returns {Promise<Object>} Created student entity.
	 */
	async create({
		processNumber,
		name,
		birthdate,
		gender = "undefined",
		photoUrl = null,
		extraInfo = null,
	}) {
		// 1. Create root entity
		const { data: root, error: rootError } = await supabase
			.from("students")
			.insert({})
			.select("id")
			.single();

		if (rootError)
			throw new Error(`Failed to create student root: ${rootError.message}`);

		const studentId = root.id;

		// 2. Insert mandatory and optional attribute records
		const payloads = [
			supabase
				.from("student_process_numbers")
				.insert({ student_id: studentId, process_number: processNumber }),
			supabase.from("student_names").insert({ student_id: studentId, name }),
			supabase
				.from("student_genders")
				.insert({ student_id: studentId, gender }),
		];

		if (birthdate)
			payloads.push(
				supabase
					.from("student_birthdates")
					.insert({ student_id: studentId, birthdate }),
			);
		if (photoUrl)
			payloads.push(
				supabase
					.from("student_photo_urls")
					.insert({ student_id: studentId, photo_url: photoUrl }),
			);
		if (extraInfo)
			payloads.push(
				supabase
					.from("student_extra_infos")
					.insert({ student_id: studentId, extra_info: extraInfo }),
			);

		const results = await Promise.all(payloads);
		const failed = results.find((r) => r.error);
		if (failed)
			throw new Error(
				`Failed inserting student attributes: ${failed.error.message}`,
			);

		return this.getById(studentId);
	},

	/**
	 * Update student attributes across decomposed tables.
	 * @param {string} studentId - Student UUID.
	 * @param {Object} updates - Updated values.
	 */
	async update(
		studentId,
		{ processNumber, name, birthdate, gender, photoUrl, extraInfo },
	) {
		const updates = [];

		if (processNumber !== undefined) {
			updates.push(
				supabase
					.from("student_process_numbers")
					.upsert({ student_id: studentId, process_number: processNumber }),
			);
		}
		if (name !== undefined) {
			updates.push(
				supabase.from("student_names").upsert({ student_id: studentId, name }),
			);
		}
		if (gender !== undefined) {
			updates.push(
				supabase
					.from("student_genders")
					.upsert({ student_id: studentId, gender }),
			);
		}
		if (birthdate !== undefined) {
			updates.push(
				supabase
					.from("student_birthdates")
					.upsert({ student_id: studentId, birthdate }),
			);
		}
		if (photoUrl !== undefined) {
			updates.push(
				supabase
					.from("student_photo_urls")
					.upsert({ student_id: studentId, photo_url: photoUrl }),
			);
		}
		if (extraInfo !== undefined) {
			updates.push(
				supabase
					.from("student_extra_infos")
					.upsert({ student_id: studentId, extra_info: extraInfo }),
			);
		}

		const results = await Promise.all(updates);
		const failed = results.find((r) => r.error);
		if (failed)
			throw new Error(
				`Failed updating student attributes: ${failed.error.message}`,
			);

		return this.getById(studentId);
	},

	/**
	 * Delete student root entity (Cascades through foreign key constraints).
	 * @param {string} studentId - Student UUID.
	 */
	async delete(studentId) {
		const { error } = await supabase
			.from("students")
			.delete()
			.eq("id", studentId);
		if (error) throw new Error(`Failed to delete student: ${error.message}`);
		return true;
	},

	/**
   * Deletes all student entities and cascading attribute records.
   * @returns {Promise<boolean>} True if operation succeeded.
   * @throws {Error} If bulk delete fails.
   */
	async deleteAll() {
		const { error } = await supabase
			.from('students')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all students: ${error.message}`)
		return true
	}
};
