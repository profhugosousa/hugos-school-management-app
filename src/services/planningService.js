import { supabase } from '../config/supabase'

/**
 * @typedef {Object} PlanningUnit
 * @property {string} id - Planning Unit UUID.
 * @property {string} theme - Main topic/theme.
 * @property {string} activities - Activity details.
 * @property {string} manualPages - Textbook or manual page numbers.
 * @property {string} resourcesPhysical - Physical resources needed.
 * @property {string} resourcesDigital - Digital resources or URLs.
 * @property {string} exercisesPhysical - Printed exercise details.
 * @property {string} exercisesDigital - Online exercise links or IDs.
 * @property {string} registers - Attendance or evaluation records.
 * @property {string|null} academicYearId - Associated academic year UUID.
 * @property {string|null} levelId - Associated level UUID.
 * @property {string|null} groupId - Associated group UUID.
 */

/**
 * Service managing curriculum planning units.
 */
export const planningService = {
	/**
	 * Retrieves all planning units.
	 * @returns {Promise<PlanningUnit[]>} List of planning units.
	 * @throws {Error} If database request fails.
	 */
	async getAll() {
		const { data: units, error } = await supabase.from('planning_units').select('id')
		if (error) throw new Error(`Failed to fetch planning units: ${error.message}`)

		return Promise.all(units.map((u) => this.getById(u.id)))
	},

	/**
	 * Retrieves a specific planning unit by ID.
	 * @param {string} id - Planning Unit UUID.
	 * @returns {Promise<PlanningUnit>} Planning unit entity.
	 * @throws {Error} If record fetch fails.
	 */
	async getById(id) {
		const [theme, activities, manual, resPhys, resDig, exPhys, exDig, reg, ay, level, group] =
			await Promise.all([
				supabase.from('planning_unit_themes').select('theme').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_activities').select('activities').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_manual_pages').select('manual_pages').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_resources_physical').select('resources_physical').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_resources_digital').select('resources_digital').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_exercises_physical').select('exercises_physical').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_exercises_digital').select('exercises_digital').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_registers').select('registers').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_academic_years').select('academic_year_id').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_levels').select('level_id').eq('planning_unit_id', id).single(),
				supabase.from('planning_unit_groups').select('group_id').eq('planning_unit_id', id).single()
			])

		return {
			id,
			theme: theme.data?.theme || '',
			activities: activities.data?.activities || '',
			manualPages: manual.data?.manual_pages || '',
			resourcesPhysical: resPhys.data?.resources_physical || '',
			resourcesDigital: resDig.data?.resources_digital || '',
			exercisesPhysical: exPhys.data?.exercises_physical || '',
			exercisesDigital: exDig.data?.exercises_digital || '',
			registers: reg.data?.registers || '',
			academicYearId: ay.data?.academic_year_id || null,
			levelId: level.data?.level_id || null,
			groupId: group.data?.group_id || null
		}
	},

	/**
	 * Creates a new planning unit record across decomposed tables.
	 * @param {Omit<PlanningUnit, 'id'>} data - Initial planning unit fields.
	 * @returns {Promise<PlanningUnit>} Created planning unit object.
	 * @throws {Error} If creation fails.
	 */
	async create({
		theme,
		activities = '',
		manualPages = '',
		resourcesPhysical = '',
		resourcesDigital = '',
		exercisesPhysical = '',
		exercisesDigital = '',
		registers = '',
		academicYearId = null,
		levelId = null,
		groupId = null
	}) {
		const { data: root, error } = await supabase.from('planning_units').insert({}).select('id').single()
		if (error) throw new Error(`Failed creating planning unit: ${error.message}`)

		const id = root.id
		const payloads = [
			supabase.from('planning_unit_themes').insert({ planning_unit_id: id, theme }),
			supabase.from('planning_unit_activities').insert({ planning_unit_id: id, activities }),
			supabase.from('planning_unit_manual_pages').insert({ planning_unit_id: id, manual_pages: manualPages }),
			supabase.from('planning_unit_resources_physical').insert({ planning_unit_id: id, resources_physical: resourcesPhysical }),
			supabase.from('planning_unit_resources_digital').insert({ planning_unit_id: id, resources_digital: resourcesDigital }),
			supabase.from('planning_unit_exercises_physical').insert({ planning_unit_id: id, exercises_physical: exercisesPhysical }),
			supabase.from('planning_unit_exercises_digital').insert({ planning_unit_id: id, exercises_digital: exercisesDigital }),
			supabase.from('planning_unit_registers').insert({ planning_unit_id: id, registers })
		]

		if (academicYearId) payloads.push(supabase.from('planning_unit_academic_years').insert({ planning_unit_id: id, academic_year_id: academicYearId }))
		if (levelId) payloads.push(supabase.from('planning_unit_levels').insert({ planning_unit_id: id, level_id: levelId }))
		if (groupId) payloads.push(supabase.from('planning_unit_groups').insert({ planning_unit_id: id, group_id: groupId }))

		await Promise.all(payloads)
		return this.getById(id)
	},

	/**
	 * Updates attributes of an existing planning unit.
	 * @param {string} id - Planning Unit UUID.
	 * @param {Partial<Omit<PlanningUnit, 'id'>>} updates - Attribute values to update.
	 * @returns {Promise<PlanningUnit>} Updated planning unit object.
	 * @throws {Error} If update fails.
	 */
	async update(id, updates) {
		const tasks = []

		if (updates.theme !== undefined) tasks.push(supabase.from('planning_unit_themes').upsert({ planning_unit_id: id, theme: updates.theme }))
		if (updates.activities !== undefined) tasks.push(supabase.from('planning_unit_activities').upsert({ planning_unit_id: id, activities: updates.activities }))
		if (updates.manualPages !== undefined) tasks.push(supabase.from('planning_unit_manual_pages').upsert({ planning_unit_id: id, manual_pages: updates.manualPages }))
		if (updates.resourcesPhysical !== undefined) tasks.push(supabase.from('planning_unit_resources_physical').upsert({ planning_unit_id: id, resources_physical: updates.resourcesPhysical }))
		if (updates.resourcesDigital !== undefined) tasks.push(supabase.from('planning_unit_resources_digital').upsert({ planning_unit_id: id, resources_digital: updates.resourcesDigital }))
		if (updates.exercisesPhysical !== undefined) tasks.push(supabase.from('planning_unit_exercises_physical').upsert({ planning_unit_id: id, exercises_physical: updates.exercisesPhysical }))
		if (updates.exercisesDigital !== undefined) tasks.push(supabase.from('planning_unit_exercises_digital').upsert({ planning_unit_id: id, exercises_digital: updates.exercisesDigital }))
		if (updates.registers !== undefined) tasks.push(supabase.from('planning_unit_registers').upsert({ planning_unit_id: id, registers: updates.registers }))
		if (updates.academicYearId !== undefined) tasks.push(supabase.from('planning_unit_academic_years').upsert({ planning_unit_id: id, academic_year_id: updates.academicYearId }))
		if (updates.levelId !== undefined) tasks.push(supabase.from('planning_unit_levels').upsert({ planning_unit_id: id, level_id: updates.levelId }))
		if (updates.groupId !== undefined) tasks.push(supabase.from('planning_unit_groups').upsert({ planning_unit_id: id, group_id: updates.groupId }))

		const results = await Promise.all(tasks)
		const failed = results.find((r) => r.error)
		if (failed) throw new Error(`Failed updating planning unit: ${failed.error.message}`)

		return this.getById(id)
	},

	/**
	 * Deletes a planning unit entity by ID.
	 * @param {string} id - Planning Unit UUID.
	 * @returns {Promise<boolean>} True if deletion was successful.
	 * @throws {Error} If delete operation fails.
	 */
	async delete(id) {
		const { error } = await supabase.from('planning_units').delete().eq('id', id)
		if (error) throw new Error(`Failed deleting planning unit: ${error.message}`)
		return true
	},

	/**
	 * Deletes all planning units.
	 * @returns {Promise<boolean>} True if successful.
	 * @throws {Error} If bulk delete fails.
	 */
	async deleteAll() {
		const { error } = await supabase
			.from('planning_units')
			.delete()
			.neq('id', '00000000-0000-0000-0000-000000000000')

		if (error) throw new Error(`Failed to delete all planning units: ${error.message}`)
		return true
	}
}