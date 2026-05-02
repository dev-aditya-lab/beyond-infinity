/**
 * Profile Redux Slice
 * Manages profile and member state:
 * - Current user profile data
 * - Organization members list (admin view)
 * - Loading/error states
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  members: [],
  membersCount: 0,
  loading: false,
  membersLoading: false,
  error: null,
  membersError: null,
  updateSuccess: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Profile
    fetchProfileStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false
      state.profile = action.payload
      state.error = null
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    updateProfileStart: (state) => {
      state.loading = true
      state.error = null
      state.updateSuccess = false
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false
      state.profile = action.payload
      state.updateSuccess = true
      state.error = null
    },
    updateProfileFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.updateSuccess = false
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },

    // Members
    fetchMembersStart: (state) => {
      state.membersLoading = true
      state.membersError = null
    },
    fetchMembersSuccess: (state, action) => {
      state.membersLoading = false
      state.members = action.payload.members || []
      state.membersCount = action.payload.count || 0
      state.membersError = null
    },
    fetchMembersFailure: (state, action) => {
      state.membersLoading = false
      state.membersError = action.payload
    },

    addMemberSuccess: (state, action) => {
      state.members.unshift(action.payload)
      state.membersCount += 1
    },

    removeMemberSuccess: (state, action) => {
      state.members = state.members.filter(
        (m) => m._id !== action.payload
      )
      state.membersCount -= 1
    },

    updateMemberRoleSuccess: (state, action) => {
      const { id, role } = action.payload
      const member = state.members.find((m) => m._id === id)
      if (member) member.role = role
    },

    // Clear
    clearError: (state) => {
      state.error = null
      state.membersError = null
    },
  },
})

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearUpdateSuccess,
  fetchMembersStart,
  fetchMembersSuccess,
  fetchMembersFailure,
  addMemberSuccess,
  removeMemberSuccess,
  updateMemberRoleSuccess,
  clearError,
} = profileSlice.actions

export default profileSlice.reducer
