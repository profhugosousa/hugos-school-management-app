import { academicYearService } from './academicYearService'
import { evaluationService } from './evaluationService'
import { groupService } from './groupService'
import { lessonService } from './lessonService'
import { levelService } from './levelService'
import { planningService } from './planningService'
import { studentService } from './studentService'

/**
 * Service for administrative and development database reset operations.
 */
export const dbResetService = {
    /**
     * Clears all tables in safe reverse-dependency order to prevent Foreign Key constraint violations.
     * Order: Evaluations -> Lessons -> Planning -> Students -> Groups -> Levels -> Academic Years.
     * @returns {Promise<boolean>} True if all records were cleared.
     * @throws {Error} If any deletion task fails.
     */
    async clearAllData() {
        await evaluationService.deleteAll()
        await lessonService.deleteAll()
        await planningService.deleteAll()
        await studentService.deleteAll()
        await groupService.deleteAll()
        await levelService.deleteAll()
        await academicYearService.deleteAll()
        return true
    }
}