'use strict';

var typeOf = require('./typeOf.js');

/**
  * @description
  * Dives into the object (first argument) using the additional arguments, up to
  * the last argument, resolving values atuomatically from the {@link Context}
  * produced by the custom AST parser.
  * @arg {Context} context - the object to dive into
  * @arg {string} ...args - the properties to dive into in the context
  * @arg {Any} fallback - the final argument will be assumed to be the fallback
  * value; the result if the properties do not resolve to anything else
  * @example
  * var data;
  *
  * data = {a: 'b'};
  *
  * valueOf(data, 'a', 'not found'); // -> 'b'
  *
  * valueOf(data, 'b', 'not found'); // -> 'not found'
  *
  * valueOf(data, 'a', 'b', 'not found'); // -> 'not found'
  */
function valueOf(context/*, ...properties, fallback*/) {
  var args = [].slice.call(arguments, 1),
      target = context[args.shift()];

  if (args.length === 1 || !target || !target.value) {

    return target && target.value || args.pop();
  } else {

    return valueOf.apply(null, [].concat(target.value, args));
  }
}

/* istanbul ignore else */
if (typeOf(exports, 'object')) {
  module.exports = valueOf;
}
