var nope = function() {

var WRITE_LIFECYCLE_MODE = "write";
var knownLifecycleModes = [ "read", WRITE_LIFECYCLE_MODE ];
var lifecycleMode = WRITE_LIFECYCLE_MODE;

define(HTMLDocument.prototype, 'write', nope);
define(HTMLDocument.prototype, 'writeln', nope);
define(HTMLDocument.prototype, 'open', nope);
define(HTMLDocument.prototype, 'close', nope);

var layoutTriggers = {
  'Document': {
    'proto': {
      'getter': [
        'scrollingElement',
      ],
      'method': [
        'execCommand',
      ]
    }
  },
  'HTMLElement': {
    'proto': {
      'getter': [
        'offsetLeft',
        'offsetTop',
        'offsetWidth',
        'offsetHeight',
        'offsetParent',
        'innerText',
        'outerText',
      ]
    }
  },
  'Element': {
    'proto': {
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
    }
  },
  'Range': {
    'proto': {
      'method': [
        'getClientRects',
        'getBoundingClientRect',
      ],
    }
  },
  'UIEvent': {
    'proto': {
      'getter': [
        'layerX',
        'layerY',
      ],
    }
  },
  'MouseEvent': {
    'proto': {
      'getter': [
        'offsetX',
        'offsetY',
      ],
    }
  },
  'HTMLButtonElement': {
    'proto': {
      'method': [
        'reportValidity',
      ]
    }
  },
  'HTMLDialogElement': {
    'proto': {
      'method': [
        'showModal',
      ]
    }
  },
  'HTMLFieldSetElement': {
    'proto': {
      'method': [
        'reportValidity',
      ]
    }
  },
  'HTMLImageElement': {
    'proto': {
      'getter': [
        'width',
        'height',
        'x',
        'y',
      ]
    }
  },
  'HTMLInputElement': {
    'proto': {
      'method': [
        'reportValidity',
      ]
    }
  },
  'HTMLButtonElement': {
    'proto': {
      'method': [
        'reportValidity',
      ]
    }
  },
  'HTMLKeygenElement': {
    'proto': {
      'method': [
        'reportValidity',
      ]
    }
  },
  'CSSStyleDeclaration': {
    'proto': {
      'method': [
        'getPropertyValue',
      ]
    }
  },
  'Window': {
    // 'instance': { // should these stay on instance?
    //   'getter': [
    //     'innerHeight',
    //     'innerWidth',
    //     'scrollX',
    //     'scrollY',
    //   ]
    // },
    'proto': {
      'method': [
        'scrollBy',
        'scrollTo',
      ]
    }
  },
  'SVGSVGElement': {
    'proto': {
      'setter': [
        'currentScale',
      ]
    }
  },
};

processSpec(layoutTriggers);

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
    var protoMemberSpecs = spec[objectName].proto;
    if (protoMemberSpecs) {
      protoMemberSpecs.getter && protoMemberSpecs.getter.forEach(function(getterName) {
        redefineGetter(window[objectName].prototype, getterName, synthesizeNopeWhenWriting);
      });
      protoMemberSpecs.setter && protoMemberSpecs.setter.forEach(function(setterName) {
        redefineSetter(window[objectName].prototype, setterName, synthesizeNopeWhenWriting);
      });
      protoMemberSpecs.method && protoMemberSpecs.method.forEach(function(methodName) {
        define(window[objectName].prototype, methodName, nope);
      });
    }
    var instanceMemberSpecs = spec[objectName].instance;
    if (instanceMemberSpecs) {
      // TODO(dglazkov): This will blow up for instances other than window.
      instanceMemberSpecs.getter && instanceMemberSpecs.getter.forEach(function(getterName) {
        redefineGetter(window, getterName, synthesizeNopeWhenWriting);
      });
    }
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
script.textContent = `~${nope}();`;
document.documentElement.appendChild(script);


