module.exports = {
  extends: 'airbnb/base',
  rules: {
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [ 'error', {
      devDependencies: [ '**/*.test.js' ]
    }],
    'import/no-named-as-default': [0],
    'indent': ['error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 }],
    'max-len': 'off',
    'no-underscore-dangle': 0,
    'object-curly-newline': ['error', { 'multiline': true, 'minProperties': 10, 'consistent': true }]
  },
};
