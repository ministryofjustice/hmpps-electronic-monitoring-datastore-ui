export const paths = {
  START: '/',
  SEARCH_ORDERS: '/search',

  INTEGRITY: {
    ORDERS: '/integrity',
    SUMMARY: '/integrity/:legacySubjectId',
    DETAILS: '/integrity/:legacySubjectId/details',
    EQUIPMENT_HISTORY: '/integrity/:legacySubjectId/equipment-history',
    SERVICE_HISTORY: '/integrity/:legacySubjectId/service-history',
    VISITS_HISTORY: '/integrity/:legacySubjectId/visits-history',
    SUSPENSION_OF_VISITS_HISTORY: '/integrity/:legacySubjectId/suspension-of-visits-history',
    EVENT_HISTORY: '/integrity/:legacySubjectId/event-history',
  },

  ALCOHOL_MONITORING: {
    ORDERS: '/alcohol-monitoring',
    SUMMARY: '/alcohol-monitoring/:legacySubjectId',
    DETAILS: '/alcohol-monitoring/:legacySubjectId/details',
    EQUIPMENT_HISTORY: '/alcohol-monitoring/:legacySubjectId/equipment-history',
    SERVICE_HISTORY: '/alcohol-monitoring/:legacySubjectId/service-history',
    VISITS_HISTORY: '/alcohol-monitoring/:legacySubjectId/visits-history',
    EVENT_HISTORY: '/alcohol-monitoring/:legacySubjectId/event-history',
  },

  API_CONNECTION_TEST: '/test',
}

export default paths
