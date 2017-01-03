var test = require('tape');
var nlp = require('../lib/nlp');
var str_test = require('../lib/fns').str_test;

test('==contractions==', function(T) {

  T.test('possessives-or-contractions:', function(t) {
    [
      [`spencer's good`, `spencer is good`],
      [`spencer's house`, `spencer's house`],
      [`spencer's really good`, `spencer is really good`],
      [`he's good`, `he is good`],
      [`google's about to earn money`, `google is about to earn money`],
      [`toronto's citizens`, `toronto's citizens`],
      [`rocket's red glare`, `rocket's red glare`],
      [`somebody's walking`, `somebody is walking`],
      [`everyone's victories`, `everyone's victories`],
      [`the tornado's power`, `the tornado's power`],
    ].forEach(function(a) {
      var m = nlp(a[0]);
      m.contractions().expand();
      var str = m.normal();
      str_test(str, a[0], a[1], t);
    });
    t.end();
  });

  T.test('contraction-pos:', function(t) {
    [
      [`john's good`, `Person`],
      [`ankara's good`, `Place`],
      [`January's good`, `Date`],
      [`john's cousin`, `Person`],
      [`ankara's citizens`, `Place`],
      [`January's weather`, `Date`],
    ].forEach(function(a) {
      var term = nlp(a[0]).list[0].terms[0];
      var msg = term.text + ' has tag ' + a[1];
      t.equal(term.tag[a[1]], true, msg);
    });
    t.end();
  });

  T.test('expand:', function(t) {
    [
      [`he's a hero`, ['he', 'is']],
      [`she's here`, ['she', 'is']],
      [`it's a hero`, ['it', 'is']],
      [`he'd win`, ['he', 'would']],
      [`they'd win`, ['they', 'would']],
      [`they've begun`, ['they', 'have']],
      [`they'll begun`, ['they', 'will']],
      [`we've begun`, ['we', 'have']],
      [`don't go`, ['do', 'not']],
      // dont expand leading 'nt contraction
      [`mustn't go`, ['must', 'not']],
      [`haven't gone`, ['have', 'not']],
      [`isn't going`, ['is', 'not']],
      ['can\'t go', ['can', 'not']],
      ['ain\'t going', ['is', 'not']],
      ['won\'t go', ['will', 'not']],

      ['i\'d go', ['i', 'would']],
      ['she\'d go', ['she', 'would']],
      ['he\'d go', ['he', 'would']],
      ['they\'d go', ['they', 'would']],
      ['we\'d go', ['we', 'would']],

      ['i\'ll go', ['i', 'will']],
      ['she\'ll go', ['she', 'will']],
      ['he\'ll go', ['he', 'will']],
      ['they\'ll go', ['they', 'will']],
      ['we\'ll go', ['we', 'will']],

      ['i\'ve go', ['i', 'have']],
      ['they\'ve go', ['they', 'have']],
      ['we\'ve go', ['we', 'have']],
      ['should\'ve go', ['should', 'have']],
      ['would\'ve go', ['would', 'have']],
      ['could\'ve go', ['could', 'have']],
      ['must\'ve go', ['must', 'have']],

      ['i\'m going', ['i', 'am']],
      ['we\'re going', ['we', 'are']],
      ['they\'re going', ['they', 'are']],

      [`don't`, ['do', 'not']],
      [`do not`, ['do', 'not']],
      // [`dunno`, ['do', 'not', 'know']],

      [`spencer's going`, ['spencer', 'is']],
      [`he's going`, ['he', 'is']],

      [`how'd`, ['how', 'did']],
      // [`why'd`, ['why', 'did']],
      // [`who'd`, ['who', 'did']],
      [`when'll`, ['when', 'will']],
      [`how'll`, ['how', 'will']],
      [`who'll`, ['who', 'will']],
    // [`who's`, ['who', 'is']],
    // [`how's`, ['how', 'is']],
    ].forEach(function(a) {
      var s = nlp(a[0]).contractions().expand().list[0];
      var got = [s.terms[0].normal];
      if (a[1][1] && s.terms[1]) {
        got.push(s.terms[1].normal);
      }
      if (a[1][2] && s.terms[2]) {
        got.push(s.terms[2].normal);
      }
      var msg = '[' + got.join(', ') + '] should be [' + a[1].join(', ') + ']';
      t.deepEqual(got, a[1], msg);
    });
    t.end();
  });
  //
  T.test('contract:', function(t) {
    [
      [`he is a hero`, `he's`],
      [`she is here`, `she's`],
      [`it is a hero`, `it's`],
      [`he would win`, `he'd`],
      [`they would win`, `they'd`],
      [`they have begun`, `they've`],
      [`how will`, `how'll`],
      [`when will`, `when'll`],
      [`who did`, `who'd`],
      [`who is`, `who's`],
    ].forEach(function(a) {
      var term = nlp(a[0]).contractions().contract().list[0].terms[0];
      str_test(term.normal, a[0], a[1], t);
    });
    t.end();
  });

  T.test('preserve-contractions:', function(t) {
    [
      `he is a hero`,
      `she is here`,
      `it is a hero`,
      `he would win`,
      `they would win`,
    ].forEach(function(a) {
      var str = nlp(a[0]).normal();
      str_test(str, a[0], a[0], t);
    });
    t.end();
  });

  T.test('contraction-supports-whitespace:', function(t) {
    [
      ['We\'ve only just begun', 'We have only just begun'],
      ['We\'ve   only just begun', 'We have   only just begun']
    ].forEach(function(a) {
      var m = nlp(a[0]);
      m.contractions().expand();
      var str = m.plaintext();
      str_test(str, a[0], a[1], t);
    });
    t.end();
  });

});
