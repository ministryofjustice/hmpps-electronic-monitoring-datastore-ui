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
    CURFEW_TIMETABLE: '/integrity/:legacySubjectId/curfew-timetable',
  },

  ALCOHOL_MONITORING: {
    INDEX: '/alcohol-monitoring',
    SUMMARY: '/alcohol-monitoring/:legacySubjectId',
    DETAILS: '/alcohol-monitoring/:legacySubjectId/details',
    VISIT_DETAILS: '/alcohol-monitoring/:legacySubjectId/visit-details',
    EQUIPMENT_DETAILS: '/alcohol-monitoring/:legacySubjectId/equipment-details',
    SUSPENSION_OF_VISITS: '/alcohol-monitoring/:legacySubjectId/suspension-of-visits',
    EVENT_HISTORY: '/alcohol-monitoring/:legacySubjectId/event-history',
    CURFEW_TIMETABLE: '/alcohol-monitoring/:legacySubjectId/curfew-timetable',
  },

  CONNECTION_TEST: '/test',
}

export default paths
