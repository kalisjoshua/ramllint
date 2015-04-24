(function() {
  function rule(obj){
    return (/^\/([a-z]+(_[a-z]+)*|{[a-z]+(_[a-z]+)*})$/.test(obj.relativeUri));
  }

  rule.level = 'error';

  rule.message = 'Each uri resource must be lower case.';

  rule.section = 'resource';

  if (typeof exports === 'object' && exports) {
    module.exports = rule;
  }
}());
