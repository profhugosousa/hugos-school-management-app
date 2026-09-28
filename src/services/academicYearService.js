import { supabase } from '../config/supabase'

/**
 * @typedef {Object} AcademicYear
 * @property {string} id - Academic Year UUID.
 * @property {string} label - Year title (e.g. "2025/2026").
 * @property {string|null} startDate - ISO date string.
 * @property {string|null} endDate - ISO date string.
 * @property {boolean} isActive - Active flag.
 */

/**
 * Service managing academic year definitions and statuses.
 */
export const academicYearService = {
	/**
	 * Fetches all registered academic years.
	 * @returns {Promise<AcademicYear[]>} List of academic year entities.
	 * @throws {Error} If query execution fails.
	 */
	async getAll() {
		const { data: roots, error } = await supabase.from('academic_years').select('id')
		if (error) throw new Error(`Failed to fetch academic years: ${error.message}`)

		return Promise.all(roots.map((r) => this.getById(r.id)))
	},

	/**
	 * Fetches an academic year by ID.
	 * @param {string} id - Academic Year UUID.
	 * @returns {Promise<AcademicYear>} Academic Year record.
	 * @throws {Error} If read operation fails.
	 */
	async getById(id) {
		const [labelRes, startRes, endRes, activeRes] = await Promise.all([
			supabase.from('academic_year_labels').select('label').eq('academic_year_id', id).single(),
			supabase.from('academic_year_start_dates').select('start_date').eq('academic_year_id', id).single(),
			supabase.from('academic_year_end_dates').select('end_date').eq('academic_year_id', id).single(),
			supabase.from('academic_year_active_statuses').select('is_active').eq('academic_year_id', id).single()
		])

		return {
			id,
			label: labelRes.data?.label || '',
			startDate: startRes.data?.start_date || null,
			endDate: endRes.data?.end_date || null,
			isActive: activeRes.data?.is_active || false
		}
	},

	/**
	 * Creates a new academic year entry.
	 * @param {Object} params - Creation parameters.
	 * @param {string} params.label - Name/label of academic year.
	 * @param {string} params.startDate - Start date string (YYYY-MM-DD).
	 * @param {string} params.endDate - End date string (YYYY-MM-DD).
	 * @param {boolean} [params.isActive=false] - Active flag status.
	 * @returns {Promise<AcademicYear>} Created object.
	 * @throws {Error} If record insert fails.
	 */
	async create({ label, startDate, endDate, isActive = false }) {
		const { data: root, error } = await supabase
			.from('academic_years')
			.insert({})
			.select('id')
			.single()

		if (error) throw new Error(`Failed to create academic year: ${error.message}`)

		const id = root.id
		await Promise.all([
			supabase.from('academic_year_labels').insert({ academic_year_id: id, label }),
			supabase.from('academic_year_start_dates').insert({ academic_year_id: id, start_date: startDate }),
			supabase.from('academic_year_end_dates').insert({ academic_year_id: id, end_date: endDate }),
			supabase.from('academic_year_active_statuses').insert({ academic_year_id: id, is_active: isActive })
		])

		return this.getById(id)
	},

	/**
	 * Updates an academic year.
	 * @param {string} id - Academic year UUID.
	 * @param {Partial<Omit<AcademicYear, 'id'>>} updates - Updated properties.
	 * @returns {Promise<AcademicYear>} Refreshed object.
	 * @throws {Error} If database updates fail.
	 */
	async update(id, { label, startDate, endDate, isActive }) {
		const updates = []

		if (label !== undefined) {
			updates.push(supabase.from('academic_year_labels').upsert({ academic_year_id: id, label }))
		}
		if (startDate !== undefined) {
			updates.push(supabase.from('academic_year_start_dates').upsert({ academic_year_id: id, start_date: startDate }))
		}
		if (endDate !== undefined) {
			updates.push(supabase.from('academic_year_end_dates').upsert({ academic_year_id: id, end_date: endDate }))
		}
		if (isActive !== undefined) {
			updates.push(supabase.from('academic_year_active_statuses').upsert({ academic_year_id: id, is_active: isActive }))
		}

		const results = await Promise.all(updates)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed to update academic year: ${failed.error.message}`)

		return this.getById(id)
	},

	/**
	 * Deletes an academic year entity by ID.
	 * @param {string} id - Academic Year UUID.
	 * @returns {Promise<boolean>} True if deleted successfully.
	 * @throws {Error} If delete query fails.
	 */
	async delete(id) {
		const { error } = await supabase.from('academic_years').delete().eq('id', id)
		if (error) throw new Error(`Failed to delete academic year: ${error.message}`)
		return true
	},

	/**
	 * Deletes all academic year records.
	 * @returns {Promise<boolean>} True if successful.
	 * @throws {Error} If wipe operation fails.
	 */
	async deleteAll() {
		const { error } = await supabase
			.from('academic_years')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all academic years: ${error.message}`)
		return true
	}
}