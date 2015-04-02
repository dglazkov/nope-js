~function() {

define(HTMLDocument.prototype, "write", nope);
define(HTMLDocument.prototype, "writeln", nope);
define(HTMLDocument.prototype, "open", nope);
define(HTMLDocument.prototype, "close", nope);

function nope() {
  throw new Error("nope");
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
