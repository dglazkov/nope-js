~function() {

var WRITE_LIFECYCLE_MODE = "write";
var knownLifecycleModes = [ "read", WRITE_LIFECYCLE_MODE ];
var lifecycleMode = WRITE_LIFECYCLE_MODE;

define(HTMLDocument.prototype, 'write', nope);
define(HTMLDocument.prototype, 'writeln', nope);
define(HTMLDocument.prototype, 'open', nope);
define(HTMLDocument.prototype, 'close', nope);

var layoutTriggers = {
  'HTMLDocument': {
    'getter': [
      'scrollingElement',
    ],
    'method': [
      'execCommand',
    ]
  },
  'Element': {
    'method': [
      'scrollIntoView',
      'scrollBy', // experimental
      'scrollTo', // experimental
      'getClientRect',
      'getBoundingClientRect',
      'computedRole', // experimental
      'computedName', // experimental
      'focus',
    ],
    'getter': [
      'offsetLeft',
      'offsetTop',
      'offsetWidth',
      'offsetHeight',
      'offsetParent',
      'clientLeft',
      'clientWidth',
      'clientHeight',
      'scrollLeft',
      'scrollTop',
      'scrollWidth',
      'scrollHeight',
      'innerText',
      'outerText',
    ],
    'setter': [
      'scrollLeft',
      'scrollTop',
    ],
  },
  'HTMLButtonElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLFieldSetElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLInputElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLButtonElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLKeygenElement': {
    'method': [
      'reportValidity',
    ]
  },
  'CSSStyleDeclaration': {
    'method': [
      'getPropertyValue',
    ]
  }
}

redefineGetter(HTMLElement.prototype, 'offsetLeft', synthesizeNopeWhenWriting);

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

function redefineGetter(prot, key, getterSynthesizer) {
  var descriptor = Object.getOwnPropertyDescriptor(prot, key);
  if (!descriptor || !descriptor.get)
    throw new Error(`Unable to redefine getter ${key} on prototype ${prot}.`);

  descriptor.get = getterSynthesizer(descriptor.get);

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
