import { useState, useEffect } from 'react'
import { Group, Day, ValidationErrors } from '../types'
import useCourseStore from '../stores/useCourseStore'
import {
  validateCourseForm,
  validateGroupSchedule,
  validateGroups,
} from '../utils/validation/courseValidation'

export const useCourseForm = (
  initialState = {
    name: '',
    color: 'bg-blue-500',
    groups: [] as Group[],
  }
) => {
  const [formData, setFormData] = useState(initialState)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const { addCourse, updateCourse, courseBeingEdited, isEditMode, courses } =
    useCourseStore()

  // Reset form when edit mode changes
  useEffect(() => {
    if (isEditMode && courseBeingEdited) {
      setFormData({
        name: courseBeingEdited.name,
        color: courseBeingEdited.color,
        groups: [...courseBeingEdited.groups],
      })
      setSelectedGroup(null)
      setErrors({})
    } else if (!isEditMode) {
      resetForm()
    }
  }, [isEditMode, courseBeingEdited])

  const resetForm = () => {
    setFormData({
      name: '',
      color: 'bg-blue-500',
      groups: [],
    })
    setSelectedGroup(null)
    setErrors({})
  }

  const updateFormField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear specific error when field is updated
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Group management
  const addGroup = () => {
    const newGroup = {
      name: `${String(formData.groups.length + 1).padStart(2, '0')}`,
      schedule: {},
    }

    const updatedGroups = [...formData.groups, newGroup]
    updateFormField('groups', updatedGroups)
    setSelectedGroup(newGroup)

    // Clear groups error if it exists
    if (errors.groups) {
      setErrors((prev) => ({ ...prev, groups: undefined }))
    }
  }

  const deleteGroup = (groupName: string) => {
    const updatedGroups = formData.groups.filter(
      (group) => group.name !== groupName
    )
    updateFormField('groups', updatedGroups)

    if (selectedGroup?.name === groupName) {
      setSelectedGroup(null)
    }

    // Clear specific group schedule errors
    if (errors.groupSchedules && errors.groupSchedules[groupName]) {
      const updatedGroupSchedules = { ...errors.groupSchedules }
      delete updatedGroupSchedules[groupName]
      setErrors((prev) => ({ ...prev, groupSchedules: updatedGroupSchedules }))
    }
  }

  const updateGroup = (updatedGroup: Group) => {
    const updatedGroups = formData.groups.map((group) =>
      group.name === updatedGroup.name ? updatedGroup : group
    )

    updateFormField('groups', updatedGroups)

    if (selectedGroup?.name === updatedGroup.name) {
      setSelectedGroup(updatedGroup)
    }

    // Clear specific group schedule error if schedule was updated
    if (
      errors.groupSchedules &&
      errors.groupSchedules[updatedGroup.name] &&
      Object.keys(updatedGroup.schedule).length > 0
    ) {
      // Validate if the schedule is now valid
      const isValid = validateGroupSchedule(updatedGroup)

      if (isValid) {
        const updatedGroupSchedules = { ...errors.groupSchedules }
        delete updatedGroupSchedules[updatedGroup.name]
        setErrors((prev) => ({
          ...prev,
          groupSchedules: Object.keys(updatedGroupSchedules).length
            ? updatedGroupSchedules
            : undefined,
        }))
      }
    }
  }

  // Schedule management
  const toggleGroupDay = (day: Day) => {
    if (!selectedGroup) return

    const groupToUpdate = { ...selectedGroup }

    if (groupToUpdate.schedule[day]) {
      const updatedSchedule = { ...groupToUpdate.schedule }
      delete updatedSchedule[day]
      groupToUpdate.schedule = updatedSchedule
    } else {
      groupToUpdate.schedule = {
        ...groupToUpdate.schedule,
        [day]: { start: '----', end: '----' },
      }
    }

    updateGroup(groupToUpdate)
  }

  const updateGroupSchedule = (
    groupName: string,
    day: string,
    start: string,
    end: string
  ) => {
    const groupToUpdate = formData.groups.find(
      (group) => group.name === groupName
    )
    if (!groupToUpdate) return

    const updatedGroup = {
      ...groupToUpdate,
      schedule: {
        ...groupToUpdate.schedule,
        [day]: { start, end },
      },
    }

    updateGroup(updatedGroup)
  }

  // Form validation
  const validateForm = (): boolean => {
    const newErrors = validateCourseForm(
      formData,
      courses,
      courseBeingEdited?.name
    )

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const handleSubmit = () => {
    if (!validateForm()) return

    const courseData = {
      name: formData.name,
      color: formData.color,
      groups: formData.groups,
    }

    if (isEditMode && courseBeingEdited) {
      updateCourse(courseBeingEdited.name, courseData)
    } else {
      addCourse(courseData)
      resetForm()
    }
  }

  return {
    formData,
    selectedGroup,
    errors,
    isValid: formData.name.trim() !== '' && formData.groups.length > 0,
    setSelectedGroup,
    updateFormField,
    addGroup,
    deleteGroup,
    toggleGroupDay,
    updateGroupSchedule,
    handleSubmit,
    resetForm,
    validateForm,
    validateGroups: () => validateGroups(formData.groups),
  }
}
