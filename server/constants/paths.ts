export const paths = {
  START: '/',
  SEARCH: '/search',

  INTEGRITY_ORDER: {
    INDEX: '/integrity',
    SUMMARY: '/integrity/:legacySubjectId',
    DETAILS: '/integrity/:legacySubjectId/details',
    EQUIPMENT_HISTORY: '/integrity/:legacySubjectId/equipment-history',
    SERVICE_HISTORY: '/integrity/:legacySubjectId/service-history',
    VISIT_HISTORY: '/integrity/:legacySubjectId/visit-history',
    SUSPENSION_OF_VISITS_HISTORY: '/integrity/:legacySubjectId/suspension-of-visits-history',
    EVENT_HISTORY: '/integrity/:legacySubjectId/event-history',
  },

  ALCOHOL_MONITORING: {
    INDEX: '/alcohol-monitoring',
    SUMMARY: '/alcohol-monitoring/:legacySubjectId',
    DETAILS: '/alcohol-monitoring/:legacySubjectId/details',
    EQUIPMENT_HISTORY: '/alcohol-monitoring/:legacySubjectId/equipment-history',
    SERVICE_HISTORY: '/alcohol-monitoring/:legacySubjectId/service-history',
    VISIT_HISTORY: '/alcohol-monitoring/:legacySubjectId/visit-history',
    EVENT_HISTORY: '/alcohol-monitoring/:legacySubjectId/event-history',
  },

  API_CONNECTION_TEST: '/test',
}

export default paths
