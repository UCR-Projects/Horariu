import i18n from '@/i18n.config'

export const validMsgs = {
  course: {
    name: {
      min: i18n.t('validation.course.name.min'),
      max: i18n.t('validation.course.name.max'),
      required: i18n.t('validation.course.name.required'),
      unique: i18n.t('validation.course.name.unique'),
    },
  },
  group: {
    name: {
      min: i18n.t('validation.group.name.min'),
      max: i18n.t('validation.group.name.max'),
      required: i18n.t('validation.group.name.required'),
      unique: i18n.t('validation.group.name.unique'),
    },
  },
}
