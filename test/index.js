var ruleTester = require('stylelint-rule-tester');
var selectorBemPattern = require('..');

// Just a couple of quick tests to ensure postcss-bem-linter
// is getting the hard work done

var testRule = ruleTester(selectorBemPattern.rule, selectorBemPattern.ruleName);

testRule({ preset: 'suit' }, function(tr) {
  tr.ok('/** @define Foo */ .Foo {}');
  tr.notOk('/** @define Foo */ .false {}', {
    message: 'Invalid component selector ".false" (selector-bem-pattern)',
    line: 1,
    column: 20,
  });

  tr.ok('/** @define Foo */ .Foo-bar {}');
  tr.notOk('/** @define Foo */ .Foo_bar {}', {
    message: 'Invalid component selector ".Foo_bar" (selector-bem-pattern)',
    line: 1,
    column: 20,
  });
});

testRule({
  componentName: '^[a-zA-Z]+$',
  componentSelectors: '^\\.{componentName}---thing$',
}, function(tr) {
  tr.ok('/** @define Foo */\n  .Foo---thing {}');
  tr.notOk('/** @define Foo2 */', {
    message: 'Invalid component name in definition /*/** @define Foo2 */*/ (selector-bem-pattern)',
    line: 1,
    column: 1,
  })
  tr.notOk('/** @define Foo */\n  .Foo-thing {}', {
    message: 'Invalid component selector ".Foo-thing" (selector-bem-pattern)',
    line: 2,
    column: 3,
  });
});

testRule({
  preset: 'suit',
  presetOptions: {
    namespace: 'qz',
  },
}, function(tr) {
  tr.ok('/** @define Foo */\n  .qz-Foo--thing {}');
  tr.notOk('/** @define Foo */\n  .Foo-thing {}', {
    message: 'Invalid component selector ".Foo-thing" (selector-bem-pattern)',
    line: 2,
    column: 3,
  });
  tr.notOk('/** @define Foo */\n  .qz-Boooo-thing {}', {
    message: 'Invalid component selector ".qz-Boooo-thing" (selector-bem-pattern)',
    line: 2,
    column: 3,
  });
});
