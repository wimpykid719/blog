// eslint-disable-next-line no-undef
module.exports = {
  extends: ['stylelint-config-recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extends', 'tailwind', 'layer'],
      },
    ],
    'block-no-empty': null,
    'unit-whitelist': ['deg', '%', 'px', 'em', 'rem', 's'],
  },
}