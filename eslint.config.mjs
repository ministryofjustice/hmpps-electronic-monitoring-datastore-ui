import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default hmppsConfig().map(rule => {
  if (rule.name === 'hmpps-universal') {
    rule.rules['import/no-extraneous-dependencies'][1].devDependencies.push('integration_tests_cypress/**')
  }

  return rule
})
