const paths = {
  START: '/',
  SEARCH: '/orders',

  INTEGRITY_ORDER: {
    INDEX: '/integrity/orders',
    SUMMARY: '/integrity/orders/:legacySubjectId',
    DETAILS: '/integrity/orders/:legacySubjectId/details',
    VISIT_DETAILS: '/integrity/orders/:legacySubjectId/visit-details',
    EQUIPMENT_DETAILS: '/integrity/orders/:legacySubjectId/equipment-details',
    SUSPENSION_OF_VISITS: '/integrity/orders/:legacySubjectId/suspension-of-visits',
    EVENT_HISTORY: '/integrity/orders/:legacySubjectId/event-history',
    CURFEW_TIMETABLE: '/integrity/orders/:legacySubjectId/curfew-timetable',
  },

  ALCOHOL_MONITORING: {
    INDEX: '/alcohol-monitoring/orders',
  },

  CONNECTION_TEST: '/test',
}

export default paths
