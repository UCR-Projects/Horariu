# i18n Migration Guide

This guide helps you migrate from the old single-file translation structure to the new namespaced structure.

## Quick Reference: Old → New Keys

### Common Actions
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `save` | `actions.save` | `common` |
| `cancel` | `actions.cancel` | `common` |
| `close` | `actions.close` | `common` |
| `delete` | `actions.delete` | `common` |
| `clearAll` | `actions.clearAll` | `common` |
| `generating` | `actions.generating` | `common` |

### Time & Theme
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `from` | `time.from` | `common` |
| `to` | `time.to` | `common` |
| `hours` | `time.hours` | `common` |
| `dark` | `theme.dark` | `common` |
| `light` | `theme.light` | `common` |
| `system` | `theme.system` | `common` |

### Days & Colors
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `days.L.name` | `days.L.name` | `common` |
| `colors.Blue` | `colors.Blue` | `common` |

### Courses
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `course` | `course` | `courses` |
| `coursesList` | `coursesList` | `courses` |
| `courseName` | `courseName` | `courses` |
| `addCourse` | `addCourse` | `courses` |
| `newCourse` | `newCourse` | `courses` |
| `editCourse` | `editCourse` | `courses` |
| `noCoursesYet` | `noCoursesYet` | `courses` |
| `clearAllCourses` | `clearAllCourses` | `courses` |
| `seeCourses` | `seeCourses` | `courses` |
| `deleteCourses` | `deleteCourses` | `courses` |
| `courseFormDes` | `form.description` | `courses` |
| `editCourseDes` | `form.editDescription` | `courses` |
| `mustAddACourse` | `validation.mustAddACourse` | `courses` |
| `mustHaveActiveCourses` | `validation.mustHaveActiveCourses` | `courses` |
| `mustHaveActiveGroups` | `validation.mustHaveActiveGroups` | `courses` |

### Groups
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `group` | `group.title` | `courses` |
| `groupName` | `group.groupName` | `courses` |
| `addGroup` | `group.addGroup` | `courses` |
| `newGroup` | `group.newGroup` | `courses` |
| `editGroup` | `group.editGroup` | `courses` |
| `noGroupsYet` | `group.noGroupsYet` | `courses` |
| `groupFormDes` | `group.form.description` | `courses` |
| `editGroupFormDes` | `group.form.editDescription` | `courses` |

### Schedules
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `schedule` | `schedule` | `schedules` |
| `generateSchedules` | `generateSchedules` | `schedules` |
| `downloadSchedule` | `downloadSchedule` | `schedules` |
| `noSchedulesGenerated` | `noSchedulesGenerated` | `schedules` |
| `option` | `option` | `schedules` |
| `options` | `options` | `schedules` |
| `image` | `image` | `schedules` |
| `possibleSchedule` | `possibleSchedule` | `schedules` |
| `possibleSchedules` | `possibleSchedules` | `schedules` |
| `scheduleSuccess` | `messages.success` | `schedules` |
| `scheduleError` | `messages.error` | `schedules` |
| `scheduleNotPossible` | `messages.notPossible` | `schedules` |
| `noActiveDays` | `schedule.noActiveDays` | `courses` |
| `addTimeBlock` | `schedule.addTimeBlock` | `courses` |

### Validation
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `validation.course.name.required` | `course.name.required` | `validation` |
| `validation.course.name.min` | `course.name.min` | `validation` |
| `validation.course.name.max` | `course.name.max` | `validation` |
| `validation.course.name.unique` | `course.name.unique` | `validation` |
| `validation.course.groupRequired` | `course.groupRequired` | `validation` |
| `validation.group.name.required` | `group.name.required` | `validation` |
| `validation.group.name.min` | `group.name.min` | `validation` |
| `validation.group.name.max` | `group.name.max` | `validation` |
| `validation.group.name.unique` | `group.name.unique` | `validation` |
| `validation.group.schedule.required` | `group.schedule.required` | `validation` |
| `validation.group.schedule.timeRange` | `group.schedule.timeRange` | `validation` |
| `validation.group.schedule.overlap` | `group.schedule.overlap` | `validation` |

### Confirmations
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `confirmClearAllCourses` | `confirmations.clearAll.title` | `courses` |
| `confirmClearAllCoursesDescription` | `confirmations.clearAll.description` | `courses` |
| `confirmDeleteCourse` | `confirmations.deleteCourse.title` | `courses` |
| `confirmDeleteCourseDescription` | `confirmations.deleteCourse.description` | `courses` |
| `confirmDeleteGroup` | `confirmations.deleteGroup.title` | `courses` |
| `confirmDeleteGroupDescription` | `confirmations.deleteGroup.description` | `courses` |

### Error Boundary
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `errorBoundary.title` | `errorBoundary.title` | `errors` |
| `errorBoundary.description` | `errorBoundary.description` | `errors` |
| `errorBoundary.detailsTitle` | `errorBoundary.detailsTitle` | `errors` |
| `errorBoundary.tryAgain` | `errorBoundary.tryAgain` | `errors` |
| `errorBoundary.goHome` | `errorBoundary.goHome` | `errors` |
| `errorBoundary.testButton` | `errorBoundary.testButton` | `errors` |

### Info
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `info.tooltip` | `tooltip` | `info` |
| `info.title` | `title` | `info` |
| `info.developedBy` | `developedBy` | `info` |
| `info.university` | `university` | `info` |
| `info.issue` | `issue` | `info` |
| `info.feedback` | `feedback` | `info` |

### Pagination
| Old Key | New Key | Namespace |
|---------|---------|-----------|
| `showingResults` | `pagination.showingResults` | `common` |
| `pageInfo` | `pagination.pageInfo` | `common` |

## Migration Steps

### Step 1: Update imports

**Old:**
```typescript
import { useTranslation } from 'react-i18next'
```

**New:**
```typescript
import { useI18n } from '@/hooks/useI18n'
```

### Step 2: Update hook usage

**Old:**
```typescript
const { t } = useTranslation()
```

**New (default namespace):**
```typescript
const { t } = useI18n()
```

**New (specific namespace):**
```typescript
const { t } = useI18n('courses')
```

**New (multiple namespaces):**
```typescript
const { t } = useI18n(['common', 'courses'])
```

### Step 3: Update translation keys

**Old:**
```typescript
t('save')
t('cancel')
t('addCourse')
```

**New:**
```typescript
t('actions.save')           // common namespace (default)
t('actions.cancel')         // common namespace (default)
t('courses:addCourse')      // courses namespace (explicit)
```

Or with specific namespace:
```typescript
const { t } = useI18n('courses')
t('addCourse')              // No prefix needed
```

## Examples

### Example 1: Simple component

**Before:**
```typescript
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <button>{t('save')}</button>
  )
}
```

**After:**
```typescript
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { t } = useI18n()
  
  return (
    <button>{t('actions.save')}</button>
  )
}
```

### Example 2: Component with multiple namespaces

**Before:**
```typescript
import { useTranslation } from 'react-i18next'

const CourseForm = () => {
  const { t } = useTranslation()
  
  return (
    <>
      <h1>{t('newCourse')}</h1>
      <button>{t('save')}</button>
      <button>{t('cancel')}</button>
    </>
  )
}
```

**After (Option 1 - Multiple namespaces):**
```typescript
import { useI18n } from '@/hooks/useI18n'

const CourseForm = () => {
  const { t } = useI18n(['common', 'courses'])
  
  return (
    <>
      <h1>{t('courses:newCourse')}</h1>
      <button>{t('common:actions.save')}</button>
      <button>{t('common:actions.cancel')}</button>
    </>
  )
}
```

**After (Option 2 - Specific namespace + explicit common):**
```typescript
import { useI18n } from '@/hooks/useI18n'

const CourseForm = () => {
  const { t } = useI18n('courses')
  
  return (
    <>
      <h1>{t('newCourse')}</h1>
      <button>{t('common:actions.save')}</button>
      <button>{t('common:actions.cancel')}</button>
    </>
  )
}
```

## Tips

1. **Use the default namespace (`common`) for shared translations** like actions, time, theme
2. **Use specific namespaces** for domain-specific translations
3. **TypeScript will help you** with autocomplete for the new keys
4. **Test both languages** after migration
5. **Update one component at a time** to avoid breaking the app

