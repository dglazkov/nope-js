var nope = function() {

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


function returnZero() {
  return 0;
}

function nil() {

}

function processSpec(spec) {
  Object.keys(spec).forEach(function(objectName) {
    var objectSpecs = spec[objectName];
    objectSpecs.getter && objectSpecs.getter.forEach(function(getterName) {
      redefineGetter(window[objectName].prototype, getterName, returnZero);
    });
    objectSpecs.method && objectSpecs.method.forEach(function(methodName) {
      define(window[objectName].prototype, methodName, nil);
    });
  });
}

function redefineGetter(obj, key, getter) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptor || !descriptor.get)
    throw new Error(`Unable to redefine getter ${key} on ${obj.constructor}.`);

  descriptor.get = getter;

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


