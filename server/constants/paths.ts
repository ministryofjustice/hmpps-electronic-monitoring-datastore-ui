const paths = {
  START: '/',
  SEARCH: '/search',

  INTEGRITY_ORDER: {
    INDEX: '/integrity',
    SUMMARY: '/integrity/:legacySubjectId',
    DETAILS: '/integrity/:legacySubjectId/details',
    VISIT_DETAILS: '/integrity/:legacySubjectId/visit-details',
    EQUIPMENT_DETAILS: '/integrity/:legacySubjectId/equipment-details',
    SUSPENSION_OF_VISITS: '/integrity/:legacySubjectId/suspension-of-visits',
    EVENT_HISTORY: '/integrity/:legacySubjectId/event-history',
    SERVICE_DETAILS: '/integrity/:legacySubjectId/service-details',
  },

  ALCOHOL_MONITORING: {
    INDEX: '/alcohol-monitoring',
    SUMMARY: '/orders/alcohol-monitoring/:legacySubjectId',
    DETAILS: '/orders/alcohol-monitoring/:legacySubjectId/details',
    VISIT_DETAILS: '/orders/alcohol-monitoring/:legacySubjectId/visit-details',
    EQUIPMENT_DETAILS: '/orders/alcohol-monitoring/:legacySubjectId/equipment-details',
    EVENT_HISTORY: '/orders/alcohol-monitoring/:legacySubjectId/event-history',
    SERVICE_DETAILS: '/orders/alcohol-monitoring/:legacySubjectId/service-details',
  },

  CONNECTION_TEST: '/test',
}

export default paths
