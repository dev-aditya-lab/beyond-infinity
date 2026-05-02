/**
 * useProfile Hook
 * Wraps profile service + Redux dispatch for profile/member management
 * Usage: const { profile, members, getProfile, updateProfile, ... } = useProfile()
 */

import { useDispatch, useSelector } from 'react-redux'
import profileService from '../services/profile.service.js'
import {
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
} from '../features/profile/profile.slice.js'
import { setUser } from '../features/auth/auth.slice.js'

export const useProfile = () => {
  const dispatch = useDispatch()
  const {
    profile,
    members,
    membersCount,
    loading,
    membersLoading,
    error,
    membersError,
    updateSuccess,
  } = useSelector((state) => state.profile)

  /**
   * Fetch current user's profile
   */
  const getProfile = async () => {
    dispatch(fetchProfileStart())
    try {
      const response = await profileService.getProfile()
      dispatch(fetchProfileSuccess(response.data))
      return response.data
    } catch (err) {
      dispatch(fetchProfileFailure(err.message))
      throw err
    }
  }

  /**
   * Update profile fields
   * Also syncs auth slice user data
   */
  const updateProfile = async (data) => {
    dispatch(updateProfileStart())
    try {
      const response = await profileService.updateProfile(data)
      dispatch(updateProfileSuccess(response.data))
      // Sync auth slice
      dispatch(setUser(response.data))
      return response.data
    } catch (err) {
      dispatch(updateProfileFailure(err.message))
      throw err
    }
  }

  /**
   * Fetch all org members (admin)
   */
  const getMembers = async () => {
    dispatch(fetchMembersStart())
    try {
      const response = await profileService.getMembers()
      dispatch(fetchMembersSuccess(response.data))
      return response.data
    } catch (err) {
      dispatch(fetchMembersFailure(err.message))
      throw err
    }
  }

  /**
   * Add member to org (admin)
   */
  const addMember = async (data) => {
    try {
      const response = await profileService.addMember(data)
      dispatch(addMemberSuccess(response.data))
      return response.data
    } catch (err) {
      throw err
    }
  }

  /**
   * Remove member from org (admin)
   */
  const removeMember = async (id) => {
    try {
      await profileService.removeMember(id)
      dispatch(removeMemberSuccess(id))
    } catch (err) {
      throw err
    }
  }

  /**
   * Update member role (admin)
   */
  const changeMemberRole = async (id, role) => {
    try {
      await profileService.updateMemberRole(id, role)
      dispatch(updateMemberRoleSuccess({ id, role }))
    } catch (err) {
      throw err
    }
  }

  return {
    profile,
    members,
    membersCount,
    loading,
    membersLoading,
    error,
    membersError,
    updateSuccess,
    getProfile,
    updateProfile,
    getMembers,
    addMember,
    removeMember,
    changeMemberRole,
    clearUpdateSuccess: () => dispatch(clearUpdateSuccess()),
    clearError: () => dispatch(clearError()),
  }
}

export default useProfile
