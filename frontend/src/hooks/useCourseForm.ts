import { useState, useEffect } from 'react'
import { Group, Day } from '../types'
import useCourseStore from '../stores/useCourseStore'

export const useCourseForm = (
  initialState = {
    name: '',
    color: 'bg-blue-500',
    groups: [] as Group[],
  }
) => {
  const [formData, setFormData] = useState(initialState)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const { addCourse, updateCourse, courseBeingEdited, isEditMode } =
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
  }

  const updateFormField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
  }

  const deleteGroup = (groupName: string) => {
    const updatedGroups = formData.groups.filter(
      (group) => group.name !== groupName
    )
    updateFormField('groups', updatedGroups)

    if (selectedGroup?.name === groupName) {
      setSelectedGroup(null)
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

  // Form validation
  const validateForm = () => {
    return formData.name.trim() !== '' && formData.groups.length > 0
  }

  return {
    formData,
    selectedGroup,
    isValid: validateForm(),
    setSelectedGroup,
    updateFormField,
    addGroup,
    deleteGroup,
    toggleGroupDay,
    updateGroupSchedule,
    handleSubmit,
    resetForm,
  }
}
