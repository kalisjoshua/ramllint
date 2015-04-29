'use strict';

var typeOf = (function typeOfClosure(global){
  var regex = /\s([a-z]+)/i,
      type = Function.prototype.call.bind(Object.prototype.toString);

  function typeOf(obj, test) {
    var result = (obj === global) ? 'global' : strip(type(obj));

    return arguments.length === 1 ? result : result === test;
  }

  function strip(str) {

    return str.match(regex)[1].toLowerCase();
  }

  return typeOf;
}(this));

/* istanbul ignore else */
if (typeOf(exports, 'global')) {
  module.exports = typeOf;
}
