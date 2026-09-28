import { supabase } from '../config/supabase'

/**
 * @typedef {Object} Group
 * @property {string} id - Group UUID.
 * @property {string} name - Group/Class identifier (e.g., "Class A").
 * @property {string|null} levelId - Associated level UUID.
 */

/**
 * Service managing student group/class entities.
 */
export const groupService = {
	/**
	 * Retrieves all groups with their level assignments.
	 * @returns {Promise<Group[]>} List of groups.
	 * @throws {Error} If database fetch fails.
	 */
	async getAll() {
		const { data: groups, error } = await supabase.from('groups').select('id')
		if (error) throw new Error(`Failed to fetch groups: ${error.message}`)

		return Promise.all(groups.map((g) => this.getById(g.id)))
	},

	/**
	 * Retrieves a single group by ID.
	 * @param {string} id - Group UUID.
	 * @returns {Promise<Group>} Group object.
	 * @throws {Error} If record search fails.
	 */
	async getById(id) {
		const [nameRes, levelRes] = await Promise.all([
			supabase.from('group_names').select('name').eq('group_id', id).single(),
			supabase.from('group_level_assignments').select('level_id').eq('group_id', id).single()
		])

		return {
			id,
			name: nameRes.data?.name || '',
			levelId: levelRes.data?.level_id || null
		}
	},

	/**
	 * Creates a new group and associates it with an academic level.
	 * @param {string} name - Name of the group.
	 * @param {string} levelId - Associated level UUID.
	 * @returns {Promise<Group>} Created group object.
	 * @throws {Error} If entity insertion fails.
	 */
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

		return { id: root.id, name, levelId }
	},

	/**
	 * Updates group attributes.
	 * @param {string} id - Group UUID.
	 * @param {Object} updates - Updated properties.
	 * @param {string} [updates.name] - New group name.
	 * @param {string} [updates.levelId] - New level UUID association.
	 * @returns {Promise<Group>} Refreshed group object.
	 * @throws {Error} If update fails.
	 */
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

	/**
	 * Deletes a group by ID.
	 * @param {string} id - Group UUID.
	 * @returns {Promise<boolean>} True if successful.
	 * @throws {Error} If deletion fails.
	 */
	async delete(id) {
		const { error } = await supabase.from('groups').delete().eq('id', id)
		if (error) throw new Error(`Failed to delete group: ${error.message}`)
		return true
	},

	/**
	 * Deletes all group entries from the database.
	 * @returns {Promise<boolean>} True if successful.
	 * @throws {Error} If bulk operation fails.
	 */
	async deleteAll() {
		const { error } = await supabase
			.from('groups')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all groups: ${error.message}`)
		return true
	}
}