var nope = function() {

var WRITE_LIFECYCLE_MODE = "write";
var knownLifecycleModes = [ "read", WRITE_LIFECYCLE_MODE ];
var lifecycleMode = WRITE_LIFECYCLE_MODE;

var terribleIdeas = {
  'HTMLDocument': {
    'method': [
      'write',
      'writeln',
      'open',
      'close'
    ]
  }
}

var layoutTriggers = {
  'Document': {
    'getter': [
      'scrollingElement',
    ],
    'method': [
      'execCommand',
    ]
  },
  'HTMLElement': {
    'getter': [
      'offsetLeft',
      'offsetTop',
      'offsetWidth',
      'offsetHeight',
      'offsetParent',
      'innerText',
      'outerText',
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
      'clientLeft',
      'clientWidth',
      'clientHeight',
      'scrollLeft',
      'scrollTop',
      'scrollWidth',
      'scrollHeight',
    ],
    'setter': [
      'scrollLeft',
      'scrollTop',
    ],
  },
  'Range': {
    'method': [
      'getClientRects',
      'getBoundingClientRect',
    ],
  },
  'UIEvent': {
    'getter': [
      'layerX',
      'layerY',
    ],
  },
  'MouseEvent': {
    'getter': [
      'offsetX',
      'offsetY',
    ],
  },
  'HTMLButtonElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLDialogElement': {
    'method': [
      'showModal',
    ]
  },
  'HTMLFieldSetElement': {
    'method': [
      'reportValidity',
    ]
  },
  'HTMLImageElement': {
    'getter': [
      'width',
      'height',
      'x',
      'y',
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
  },
  'Window': {
    'method': [
      'scrollBy',
      'scrollTo',
    ]
  },
  'SVGSVGElement': {
    'setter': [
      'currentScale',
    ]
  },
};

processSpec(layoutTriggers);
processSpec(terribleIdeas);

var buggyWindowAccessors = [
  'innerHeight',
  'innerWidth',
  'scrollX',
  'scrollY',
];

buggyWindowAccessors.forEach(function(accessor) {
  overrideGetterSetter(window, accessor, nope, nope);
});

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

function processSpec(spec) {
  Object.keys(spec).forEach(function(objectName) {
    var objectSpecs = spec[objectName];
    objectSpecs.getter && objectSpecs.getter.forEach(function(getterName) {
      redefineGetter(window[objectName].prototype, getterName, synthesizeNopeWhenWriting);
    });
    objectSpecs.setter && objectSpecs.setter.forEach(function(setterName) {
      redefineSetter(window[objectName].prototype, setterName, synthesizeNopeWhenWriting);
    });
    objectSpecs.method && objectSpecs.method.forEach(function(methodName) {
      define(window[objectName].prototype, methodName, nope);
    });
  });
}

function redefineGetter(obj, key, getterSynthesizer) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptor || !descriptor.get)
    throw new Error(`Unable to redefine getter ${key} on ${obj.constructor}.`);

  descriptor.get = getterSynthesizer(descriptor.get);

  Object.defineProperty(obj, key, descriptor);
}

function redefineSetter(obj, key, setterSynthesizer) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptor || !descriptor.set)
    throw new Error(`Unable to redefine setter ${key} on ${obj.constructor}.`);

  descriptor.set = setterSynthesizer(descriptor.set);

  Object.defineProperty(obj, key, descriptor);

}

function overrideGetterSetter(obj, key, getter, setter) {
  Object.defineProperty(obj, key, {
    get: getter,
    set: setter,
    configurable: true,
    enumerable: true
  });
}

function define(obj, key, func) {
  Object.defineProperty(obj, key, {
    value: func,
    writable: true,
    configurable: true,
    enumerable: true
  });
}

}

var script = document.createElement('script');
script.textContent = `~${nope}(); document.currentScript.remove();`;
document.documentElement.appendChild(script);


