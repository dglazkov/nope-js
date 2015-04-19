~function() {

var WRITE_LIFECYCLE_MODE = "write";
var knownLifecycleModes = [ "read", WRITE_LIFECYCLE_MODE ];
var lifecycleMode = WRITE_LIFECYCLE_MODE;

define(HTMLDocument.prototype, 'write', nope);
define(HTMLDocument.prototype, 'writeln', nope);
define(HTMLDocument.prototype, 'open', nope);
define(HTMLDocument.prototype, 'close', nope);

function nope() {
  throw new Error('nope');
}

function synthesizeNopeWhenWriting(func) {
  return function() {
    if (lifecycleMode != WRITE_LIFECYCLE_MODE) {
      return func.apply(this, arguments);
    }
    throw new Error('nope');
  }
}

define(HTMLDocument.prototype, 'setLifecycleMode', function(mode) {
  if (knownLifecycleModes.indexOf(mode) == -1) {
    throw new Error(`Unknown lifecycle mode. The known modes are: ${knownLifecycleModes}.`);
    return;
  }
  lifecycleMode = mode;
});

function redefineGetter(prot, key, getter) {
  var descriptor = Object.getOwnPropertyDescriptor(prot, key);
  if (!descriptor || !descriptor.get)
    throw new Error(`Unable to redefine getter ${key} on prototype ${prot}.`);

  descriptor.get = synthesizeNopeWhenWriting(descriptor.get);

  Object.defineProperty(prot, key, descriptor);
}

function define(prot, key, func) {
  Object.defineProperty(prot, key, {
    value: func,
    writable: true,
    configurable: true,
    enumerable: true
  });
}

}();
