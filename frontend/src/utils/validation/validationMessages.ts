import i18n from '../../i18n.config'

export const validationMessages = {
  course: {
    nameRequired: i18n.t('validation.course.nameRequired'),
    nameNotUnique: i18n.t('validation.course.nameNotUnique'),
    noGroups: i18n.t('validation.course.noGroups'),
  },
  group: {
    noDaysSelected: i18n.t('validation.group.noDaysSelected'),
    invalidTimes: i18n.t('validation.group.invalidTimes'),
  },
}
