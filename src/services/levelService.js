import { supabase } from '../config/supabase'

/**
 * @typedef {Object} Level
 * @property {string} id - Level UUID.
 * @property {string} name - Academic level designation (e.g., "1st Grade", "B1").
 */

/**
 * Service managing academic level entities.
 */
export const levelService = {
	/**
	 * Retrieves all academic levels.
	 * @throws {Error} If database fetch fails.
	 */
	async getAll() {
		const { data, error } = await supabase
			.from('level_names')
			.select('level_id, name')
			.order('name', { ascending: true })
		if (error) throw new Error(`Failed to fetch levels: ${error.message}`)

		return (data || []).map((l) => ({
			id: l.level_id,
			name: l.name || ''
		})
		)
	},

	/**
	 * Retrieves a single level by ID.
	 * @param {string} id - Level UUID.
	 * @returns {Promise<Level>} The level entity.
	 * @throws {Error} If level is not found or database query fails.
	 */
	async getById(id) {
		const { data, error } = await supabase
			.from('level_names')
			.select('name')
			.eq('level_id', id)
			.single()

		if (error) throw new Error(`Failed to fetch level: ${error.message}`)
		return { id, name: data?.name || '' }
	},

	/**
	 * Creates a new academic level.
	 * @param {string} name - Name of the level.
	 * @returns {Promise<Level>} Newly created level entity.
	 * @throws {Error} If insert operation fails.
	 */
	async create(name) {
		const { data: root, error } = await supabase
			.from('levels')
			.insert({})
			.select('id')
			.single()

		if (error) throw new Error(`Failed level creation: ${error.message}`)

		await supabase.from('level_names').insert({ level_id: root.id, name })
		return { id: root.id, name }
	},

	/**
	 * Updates an existing level name.
	 * @param {string} id - Level UUID.
	 * @param {string} name - New level name.
	 * @returns {Promise<Level>} Updated level object.
	 * @throws {Error} If update operation fails.
	 */
	async update(id, name) {
		const { error } = await supabase
			.from('level_names')
			.upsert({ level_id: id, name })

		if (error) throw new Error(`Failed to update level: ${error.message}`)
		return { id, name }
	},

	/**
	 * Deletes a single level and its cascading records.
	 * @param {string} id - Level UUID.
	 * @returns {Promise<boolean>} True if deletion succeeded.
	 * @throws {Error} If delete query fails.
	 */
	async delete(id) {
		const { error } = await supabase.from('levels').delete().eq('id', id)
		if (error) throw new Error(`Failed to delete level: ${error.message}`)
		return true
	},

	/**
	 * Deletes all level entities and cascading attribute records.
	 * @returns {Promise<boolean>} True if operation succeeded.
	 * @throws {Error} If bulk delete fails.
	 */
	async deleteAll() {
		const { error } = await supabase
			.from('levels')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all levels: ${error.message}`)
		return true
	}
}