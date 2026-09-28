import { supabase } from '../config/supabase'

/**
 * @typedef {Object} AuthUser
 * @property {string} id - User UUID.
 * @property {string} email - User email address.
 * @property {Object} user_metadata - Metadata containing custom attributes like role.
 */

/**
 * Service managing user authentication and sessions.
 */
export const authService = {
    /**
     * Authenticates a user using email and password.
     * @param {string} email - User email address.
     * @param {string} password - User password.
     * @returns {Promise<{ user: AuthUser, session: Object }>} User and session data.
     * @throws {Error} If authentication fails.
     */
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw new Error(error.message)
        return data
    },

    /**
     * Signs out the current authenticated user.
     * @returns {Promise<boolean>} True if sign-out was successful.
     * @throws {Error} If sign-out fails.
     */
    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw new Error(`Sign-out failed: ${error.message}`)
        return true
    },

    /**
     * Retrieves the currently active user session.
     * @returns {Promise<Object|null>} Active session or null.
     */
    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw new Error(`Failed to get session: ${error.message}`)
        return data.session
    },

    /**
     * Retrieves the current authenticated user.
     * @returns {Promise<AuthUser|null>} Current user entity or null.
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw new Error(`Failed to fetch user: ${error.message}`)
        return user
    },

    /**
     * Listens for changes in authentication state (e.g., SIGNED_IN, SIGNED_OUT).
     * @param {Function} callback - Function triggered on auth state change.
     * @returns {Object} Subscription listener object with an unsubscribe handle.
     */
    onAuthStateChange(callback) {
        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session)
        })
        return subscription
    }
}