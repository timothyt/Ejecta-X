var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
  goog.exportPath_(a, c)
};
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a))
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(goog.DEPENDENCIES_ENABLED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
  return!!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    var g = Array.prototype.slice.call(arguments, 2);
    return b.prototype[c].apply(a, g)
  }
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
COMPILED || (goog.global.COMPILED = COMPILED);
var lime = {DirtyObject:function() {
}};
lime.DirtyObject.prototype.update = function() {
};
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.debug = {};
goog.debug.Error = function(a) {
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error)
  }else {
    var b = Error().stack;
    b && (this.stack = b)
  }
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
  for(var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift()
  }
  return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"))
  }else {
    if(!goog.string.ALL_RE_.test(a)) {
      return a
    }
    -1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"))
  }
  return a
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
  return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, d;
  d = b ? b.createElement("div") : goog.global.document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var g = c[a];
    if(g) {
      return g
    }
    if("#" == b.charAt(0)) {
      var h = Number("0" + b.substr(1));
      isNaN(h) || (g = String.fromCharCode(h))
    }
    g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = g
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.caseInsensitiveContains = function(a, b) {
  return goog.string.contains(a.toLowerCase(), b.toLowerCase())
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), p = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = l.exec(h) || ["", "", ""], n = p.exec(k) || ["", "", ""];
      if(0 == m[0].length && 0 == n[0].length) {
        break
      }
      var c = 0 == m[1].length ? 0 : parseInt(m[1], 10), q = 0 == n[1].length ? 0 : parseInt(n[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == m[2].length, 0 == n[2].length) || goog.string.compareElements_(m[2], n[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for(var d = [];0 < c && a.length;) {
    d.push(a.shift()), c--
  }
  a.length && d.push(a.join(b));
  return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertElement = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && (!goog.isObject(a) || a.nodeType != goog.dom.NodeType.ELEMENT) && goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for(var a in Object.prototype) {
    goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
  }
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d
  }, c);
  return d
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.join = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b, c) {
  b = b || a;
  var d = function(a) {
    return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g
  };
  c = c || d;
  for(var d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = c(g);
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
  }
  b.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  a.sort(b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
  for(var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
  }
  return d
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e
  });
  return d
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if(0 > c * (f - e)) {
    return[]
  }
  if(0 < c) {
    for(a = e;a < f;a += c) {
      d.push(a)
    }
  }else {
    for(a = e;a > f;a += c) {
      d.push(a)
    }
  }
  return d
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.moveItem = function(a, b, c) {
  goog.asserts.assert(0 <= b && b < a.length);
  goog.asserts.assert(0 <= c && c < a.length);
  b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.standardAngleInRadians = function(a) {
  return goog.math.modulo(a, 2 * Math.PI)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b
  };
  d = d || function(b, c) {
    return a[b]
  };
  for(var e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var k = 0;k < f + 1;k++) {
    g[0][k] = 0
  }
  for(h = 1;h <= e;h++) {
    for(k = 1;k <= f;k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1])
    }
  }
  for(var l = [], h = e, k = f;0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--
  }
  return l
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.sampleVariance = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments);
  return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1)
};
goog.math.standardDeviation = function(a) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments))
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.log10Floor = function(a) {
  if(0 < a) {
    var b = Math.round(Math.log(a) * Math.LOG10E);
    return b - (parseFloat("1e" + b) > a)
  }
  return 0 == a ? -Infinity : NaN
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2E-15))
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
  return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= c;
  return this
};
goog.math.Coordinate.prototype.rotateRadians = function(a, b) {
  var c = b || new goog.math.Coordinate(0, 0), d = this.x, e = this.y, f = Math.cos(a), g = Math.sin(a);
  this.x = (d - c.x) * f - (e - c.y) * g + c.x;
  this.y = (d - c.x) * g + (e - c.y) * f + c.y
};
goog.math.Coordinate.prototype.rotateDegrees = function(a, b) {
  this.rotateRadians(goog.math.toRadians(a), b)
};
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function(a) {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }
  return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(a, b) {
  return!a || !b ? !1 : b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b), d = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this
};
goog.math.Box.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
  return this
};
goog.math.Box.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.right *= a;
  this.top *= c;
  this.bottom *= c;
  return this
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= c;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.math.Box.size = {};
goog.math.Size.scaleVec2 = {};
goog.math.Box.prototype.size = function() {
  return new goog.math.Size(this.right - this.left, this.bottom - this.top)
};
goog.math.Size.prototype.scaleVec2 = function(a) {
  this.width *= a.x;
  this.height *= a.y;
  return this
};
lime.Renderer = function() {
};
lime.Renderer.prototype.draw = goog.nullFunction;
lime.Renderer.prototype.getType = function() {
  return this.base ? this.base : this
};
lime.Renderer.prototype.makeSubRenderer = function(a) {
  goog.object.extend(a, this);
  a.base = this.getType();
  return a
};
lime.Renderer.CANVAS = new lime.Renderer;
lime.Renderer.CANVAS.updateLayout = function() {
};
lime.Renderer.CANVAS.CLEAR_COLOR = null;
lime.Renderer.CANVAS.drawCanvas = function() {
  var a = this.measureContents(), b;
  if(this.domElement) {
    this.boundsCache && this.boundsCache.contains(a) && (b = this.boundsCache.size().area() / a.size().area()) && 1.6 > b && 0.5 < b ? a = this.boundsCache : 1 != this.staticCanvas && 0 != this.children_.length && !(this instanceof lime.Scene) && !(this instanceof lime.Director) && a.expand(12, 12, 12, 12);
    this.boundsCache = a;
    var c = a.size();
    b = c.clone().ceil();
    if(this.domElement.width != b.width || this.domElement.height != b.height) {
      this.domElement !== this.container && (this.domElement.width = b.width, this.domElement.height = b.height), this.redraw_ = 1
    }
    var d = this.getScale().clone();
    this.transitionsActive_[lime.Transition.SCALE] && (d = this.transitionsActive_[lime.Transition.SCALE]);
    0 != b.width && d.scale(c.width / b.width);
    c = this.getFrame();
    this.ax = c.left - a.left;
    this.ay = c.top - a.top;
    c = this.getSize().clone().scaleVec2(this.getAnchorPoint());
    a = this.getPosition().clone();
    this.transitionsActive_[lime.Transition.POSITION] && (a = this.transitionsActive_[lime.Transition.POSITION]);
    a.x -= c.width + this.ax;
    a.y -= c.height + this.ay;
    lime.style.setTransformOrigin(this.domElement, 100 * ((this.ax + c.width) / b.width), 100 * ((this.ay + c.height) / b.height), !0);
    !this.transitionsActiveSet_[lime.Transition.POSITION] && (!this.transitionsActiveSet_[lime.Transition.SCALE] && !this.transitionsActiveSet_[lime.Transition.ROTATION]) && (c = -this.getRotation(), goog.isDef(this.transitionsActive_[lime.Transition.ROTATION]) && (c = -this.transitionsActive_[lime.Transition.ROTATION]), this.domElement !== this.container && lime.style.setTransform(this.domElement, (new lime.style.Transform).setPrecision(0.1).translate(a.x, a.y).scale(d.x, d.y).rotate(c)));
    this.redraw_ && (c = this.domElement.getContext("2d"), lime.Renderer.CANVAS.CLEAR_COLOR ? (c.fillStyle = lime.Renderer.CANVAS.CLEAR_COLOR, c.fillRect(0, 0, this.domElement.width, this.domElement.height)) : c.clearRect(0, 0, this.domElement.width, this.domElement.height), c.save(), this.domElement === this.container && (c.translate(a.x, a.y), c.scale(d.x, d.y), c.save(), c.beginPath(), c.moveTo(0, 0), c.lineTo(b.width, 0), c.lineTo(b.width, b.height), c.lineTo(0, b.height), c.closePath(), c.restore(), 
    c.clip()), c.translate(this.ax, this.ay), b = this.getSize(), d = this.getAnchorPoint(), c.translate(b.width * d.x, b.height * d.y), this.renderer.drawCanvasObject.call(this, c), c.restore(), this.redraw_ = 0)
  }
};
lime.Renderer.CANVAS.update = function() {
};
lime.Renderer.CANVAS.drawCanvasObject = function(a) {
  if(this.inTree_ && (this.mask_ != this.activeMask_ && (this.activeMask_ && lime.Renderer.DOM.removeMask.call(this), this.mask_ && lime.Renderer.DOM.addMask.call(this)), !this.maskTarget_ && !this.hidden_ && !(0 == this.opacity_ || 1 == this.isMask))) {
    1 != this.opacity_ && (a.globalAlpha *= this.opacity_);
    if(this.mask_) {
      lime.Renderer.DOM.calculateMaskPosition.call(this.mask_);
      var b = this.activeMask_, c = this.scale_;
      a.save();
      a.save();
      a.translate(b.mPos.x, b.mPos.y);
      a.rotate(-b.mRot);
      this.needsDomElement && a.rotate(this.getRotation() * Math.PI / 180);
      a.beginPath();
      a.moveTo(0, 0);
      a.lineTo(b.mWidth / c.x, 0);
      a.lineTo(b.mWidth / c.x, b.mHeight / c.y);
      a.lineTo(0, b.mHeight / c.y);
      a.closePath();
      a.restore();
      a.clip()
    }
    this.renderer.draw.call(this, a);
    for(var b = new goog.math.Coordinate(0, 0), d = 0, e;e = this.children_[d];d++) {
      var f = e.localToParent(b), g = e.getRotation(), c = e.getScale();
      a.save();
      a.translate(f.x, f.y);
      a.scale(c.x, c.y);
      0 != g && a.rotate(-g * Math.PI / 180);
      this.renderer.drawCanvasObject.call(e, a);
      a.restore()
    }
    1 != this.opacity_ && (a.globalAlpha /= this.opacity_);
    this.activeMask_ && a.restore()
  }
};
goog.math.Vec2 = function(a, b) {
  this.x = a;
  this.y = b
};
goog.inherits(goog.math.Vec2, goog.math.Coordinate);
goog.math.Vec2.randomUnit = function() {
  var a = 2 * Math.random() * Math.PI;
  return new goog.math.Vec2(Math.cos(a), Math.sin(a))
};
goog.math.Vec2.random = function() {
  var a = Math.sqrt(Math.random()), b = 2 * Math.random() * Math.PI;
  return new goog.math.Vec2(Math.cos(b) * a, Math.sin(b) * a)
};
goog.math.Vec2.fromCoordinate = function(a) {
  return new goog.math.Vec2(a.x, a.y)
};
goog.math.Vec2.prototype.clone = function() {
  return new goog.math.Vec2(this.x, this.y)
};
goog.math.Vec2.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y)
};
goog.math.Vec2.prototype.squaredMagnitude = function() {
  return this.x * this.x + this.y * this.y
};
goog.math.Vec2.prototype.scale = goog.math.Coordinate.prototype.scale;
goog.math.Vec2.prototype.invert = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this
};
goog.math.Vec2.prototype.normalize = function() {
  return this.scale(1 / this.magnitude())
};
goog.math.Vec2.prototype.add = function(a) {
  this.x += a.x;
  this.y += a.y;
  return this
};
goog.math.Vec2.prototype.subtract = function(a) {
  this.x -= a.x;
  this.y -= a.y;
  return this
};
goog.math.Vec2.prototype.rotate = function(a) {
  var b = Math.cos(a);
  a = Math.sin(a);
  var c = this.y * b + this.x * a;
  this.x = this.x * b - this.y * a;
  this.y = c;
  return this
};
goog.math.Vec2.rotateAroundPoint = function(a, b, c) {
  return a.clone().subtract(b).rotate(c).add(b)
};
goog.math.Vec2.prototype.equals = function(a) {
  return this == a || !!a && this.x == a.x && this.y == a.y
};
goog.math.Vec2.distance = goog.math.Coordinate.distance;
goog.math.Vec2.squaredDistance = goog.math.Coordinate.squaredDistance;
goog.math.Vec2.equals = goog.math.Coordinate.equals;
goog.math.Vec2.sum = function(a, b) {
  return new goog.math.Vec2(a.x + b.x, a.y + b.y)
};
goog.math.Vec2.difference = function(a, b) {
  return new goog.math.Vec2(a.x - b.x, a.y - b.y)
};
goog.math.Vec2.dot = function(a, b) {
  return a.x * b.x + a.y * b.y
};
goog.math.Vec2.lerp = function(a, b, c) {
  return new goog.math.Vec2(goog.math.lerp(a.x, b.x, c), goog.math.lerp(a.y, b.y, c))
};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for(b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a]
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, a))
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a)
};
goog.Disposable.prototype.disposeInternal = function() {
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
  }
};
goog.events = {};
goog.events.EventId = function(a) {
  this.id = a
};
goog.events.EventId.prototype.toString = function() {
  return this.id
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
  a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0
};
goog.events.Listenable.isImplementedBy = function(a) {
  return!(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP])
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_
};
goog.events.Listener = function(a, b, c, d, e, f) {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.events.ListenerMap = function(a) {
  this.src = a;
  this.listeners = {};
  this.typeCount_ = 0
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var a = 0, b;
  for(b in this.listeners) {
    a += this.listeners[b].length
  }
  return a
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.listeners[f];
  a || (a = this.listeners[f] = [], this.typeCount_++);
  var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e);
  -1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));
  return b
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if(!(a in this.listeners)) {
    return!1
  }
  var e = this.listeners[a];
  b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
  return-1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
  var b = a.type;
  if(!(b in this.listeners)) {
    return!1
  }
  var c = goog.array.remove(this.listeners[b], a);
  c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
  return c
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
  a = a && a.toString();
  var b = 0, c;
  for(c in this.listeners) {
    if(!a || c == a) {
      for(var d = this.listeners[c], e = 0;e < d.length;e++) {
        ++b, d[e].markAsRemoved()
      }
      delete this.listeners[c];
      this.typeCount_--
    }
  }
  return b
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
  var c = this.listeners[a.toString()], d = [];
  if(c) {
    for(var e = 0;e < c.length;++e) {
      var f = c[e];
      f.capture == b && d.push(f)
    }
  }
  return d
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
  a = this.listeners[a.toString()];
  var e = -1;
  a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
  return-1 < e ? a[e] : null
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a), d = c ? a.toString() : "", e = goog.isDef(b);
  return goog.object.some(this.listeners, function(a, g) {
    for(var h = 0;h < a.length;++h) {
      if((!c || a[h].type == d) && (!e || a[h].capture == b)) {
        return!0
      }
    }
    return!1
  })
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
  for(var e = 0;e < a.length;++e) {
    var f = a[e];
    if(!f.removed && f.listener == b && f.capture == !!c && f.handler == d) {
      return e
    }
  }
  return-1
};
goog.events.Event = function(a, b) {
  this.type = a instanceof goog.events.EventId ? String(a) : a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault()
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var a = goog.labs.userAgent.util.getNavigator_();
  return a && (a = a.userAgent) ? a : ""
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
  goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_()
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(b, a)
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(b, a)
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
  for(var b = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), c = [], d;d = b.exec(a);) {
    c.push([d[1], d[2], d[3] || void 0])
  }
  return c
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox")
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android")
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk")
};
goog.labs.userAgent.browser.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if(goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(a)
  }
  if(goog.labs.userAgent.browser.isOpera()) {
    return goog.labs.userAgent.browser.getOperaVersion_(a)
  }
  a = goog.labs.userAgent.util.extractVersionTuples(a);
  return goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a)
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
  var b = /rv: *([\d\.]*)/.exec(a);
  if(b && b[1]) {
    return b[1]
  }
  var b = "", c = /MSIE +([\d\.]+)/.exec(a);
  if(c && c[1]) {
    if(a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) {
      if(a && a[1]) {
        switch(a[1]) {
          case "4.0":
            b = "8.0";
            break;
          case "5.0":
            b = "9.0";
            break;
          case "6.0":
            b = "10.0";
            break;
          case "7.0":
            b = "11.0"
        }
      }else {
        b = "7.0"
      }
    }else {
      b = c[1]
    }
  }
  return b
};
goog.labs.userAgent.browser.getOperaVersion_ = function(a) {
  a = goog.labs.userAgent.util.extractVersionTuples(a);
  var b = goog.array.peek(a);
  return"OPR" == b[0] && b[1] ? b[1] : goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(a) {
  goog.asserts.assert(2 < a.length, "Couldn't extract version tuple from user agent string");
  return a[2] && a[2][1] ? a[2][1] : ""
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto")
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident()
};
goog.labs.userAgent.engine.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if(a) {
    var a = goog.labs.userAgent.util.extractVersionTuples(a), b = a[1];
    if(b) {
      return"Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1]
    }
    var a = a[0], c;
    if(a && (c = a[2])) {
      if(c = /Trident\/([^\s;]+)/.exec(c)) {
        return c[1]
      }
    }
  }
  return""
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a)
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
  var c = goog.array.find(a, function(a) {
    return b == a[0]
  });
  return c && c[1] || ""
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent()
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var a = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!a && goog.string.contains(a, "Android");
  goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
  goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  if(goog.userAgent.OPERA && goog.global.opera) {
    return a = goog.global.opera.version, goog.isFunction(a) ? a() : a
  }
  goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/);
  b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : "");
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document;
  return!a || !goog.userAgent.IE ? void 0 : goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5)
}();
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !(!goog.global.document || !(document.documentElement && "ontouchstart" in document.documentElement)) || !(!goog.global.navigator || 
!goog.global.navigator.msMaxTouchPoints)};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    for(var b = goog.debug.entryPointRegistry.monitors_, c = 0;c < b.length;c++) {
      a(goog.bind(b[c].wrap, b[c]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for(var b = goog.bind(a.wrap, a), c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](b)
  }
  goog.debug.entryPointRegistry.monitors_.push(a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  var b = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
  a = goog.bind(a.unwrap, a);
  for(var c = 0;c < goog.debug.entryPointRegistry.refList_.length;c++) {
    goog.debug.entryPointRegistry.refList_[c](a)
  }
  b.length--
};
goog.events.getVendorPrefixedName_ = function(a) {
  return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase()
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", 
INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", 
READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), 
TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", 
MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXTINPUT:"textinput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", 
COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", 
DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified"};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0
  }catch(c) {
  }
  return!1
};
goog.events.BrowserEvent = function(a, b) {
  goog.events.BrowserEvent.base(this, "constructor", a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.platformModifierKey = !1;
  this.event_ = null;
  a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
  this.relatedTarget = d;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault()
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.events.listeners_ = {};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listen(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e)
};
goog.events.listen_ = function(a, b, c, d, e, f) {
  if(!b) {
    throw Error("Invalid event type");
  }
  var g = !!e;
  if(g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if(goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      return goog.asserts.fail("Can not register capture listener in IE8-."), null
    }
    if(goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null
    }
  }
  var h = goog.events.getListenerMap_(a);
  h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
  c = h.add(b, c, d, e, f);
  if(c.proxy) {
    return c
  }
  d = goog.events.getProxy();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  a.addEventListener ? a.addEventListener(b.toString(), d, g) : a.attachEvent(goog.events.getOnString_(b.toString()), d);
  goog.events.listenerCountEstimate_++;
  return c
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
    return a.call(b.src, b.listener, c)
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if(!c) {
      return c
    }
  };
  return b
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e)
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener(c);
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.unlisten(b, c, d, e)
  }
  if(!a) {
    return!1
  }
  d = !!d;
  if(a = goog.events.getListenerMap_(a)) {
    if(b = a.getListener(b, c, d, e)) {
      return goog.events.unlistenByKey(b)
    }
  }
  return!1
};
goog.events.unlistenByKey = function(a) {
  if(goog.isNumber(a) || !a || a.removed) {
    return!1
  }
  var b = a.src;
  if(goog.events.Listenable.isImplementedBy(b)) {
    return b.unlistenByKey(a)
  }
  var c = a.type, d = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);
  goog.events.listenerCountEstimate_--;
  (c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();
  return!0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e)
};
goog.events.removeAll = function(a, b) {
  if(!a) {
    return 0
  }
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.removeAllListeners(b)
  }
  var c = goog.events.getListenerMap_(a);
  if(!c) {
    return 0
  }
  var d = 0, e = b && b.toString(), f;
  for(f in c.listeners) {
    if(!e || f == e) {
      for(var g = c.listeners[f].concat(), h = 0;h < g.length;++h) {
        goog.events.unlistenByKey(g[h]) && ++d
      }
    }
  }
  return d
};
goog.events.removeAllNativeListeners = function() {
  return goog.events.listenerCountEstimate_ = 0
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : !a ? [] : (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : []
};
goog.events.getListener = function(a, b, c, d, e) {
  c = goog.events.wrapListener(c);
  d = !!d;
  return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : !a ? null : (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null
};
goog.events.hasListener = function(a, b, c) {
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.hasListener(b, c)
  }
  a = goog.events.getListenerMap_(a);
  return!!a && a.hasListener(b, c)
};
goog.events.expose = function(a) {
  var b = [], c;
  for(c in a) {
    a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c])
  }
  return b.join("\n")
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
  return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d)
};
goog.events.fireListeners_ = function(a, b, c, d) {
  var e = 1;
  if(a = goog.events.getListenerMap_(a)) {
    if(b = a.listeners[b.toString()]) {
      b = b.concat();
      for(a = 0;a < b.length;a++) {
        var f = b[a];
        f && (f.capture == c && !f.removed) && (e &= !1 !== goog.events.fireListener(f, d))
      }
    }
  }
  return Boolean(e)
};
goog.events.fireListener = function(a, b) {
  var c = a.listener, d = a.handler || a.src;
  a.callOnce && goog.events.unlistenByKey(a);
  return c.call(d, b)
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_
};
goog.events.dispatchEvent = function(a, b) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return a.dispatchEvent(b)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if(a.removed) {
    return!0
  }
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var c = b || goog.getObjectByName("window.event"), d = new goog.events.BrowserEvent(c, this), e = !0;
    if(goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if(!goog.events.isMarkedIeEvent_(c)) {
        goog.events.markIeEvent_(c);
        for(var c = [], f = d.currentTarget;f;f = f.parentNode) {
          c.push(f)
        }
        for(var f = a.type, g = c.length - 1;!d.propagationStopped_ && 0 <= g;g--) {
          d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !0, d)
        }
        for(g = 0;!d.propagationStopped_ && g < c.length;g++) {
          d.currentTarget = c[g], e &= goog.events.fireListeners_(c[g], f, !1, d)
        }
      }
    }else {
      e = goog.events.fireListener(a, d)
    }
    return e
  }
  return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this))
};
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if(0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return
    }catch(c) {
      b = !0
    }
  }
  if(b || void 0 == a.returnValue) {
    a.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.getListenerMap_ = function(a) {
  a = a[goog.events.LISTENER_MAP_PROP_];
  return a instanceof goog.events.ListenerMap ? a : null
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(a) {
  goog.asserts.assert(a, "Listener can not be null.");
  if(goog.isFunction(a)) {
    return a
  }
  goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
  return a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
    return a.handleEvent(b)
  })
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_)
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  this.assertInitialized_();
  var b, c = this.getParentEventTarget();
  if(c) {
    b = [];
    for(var d = 1;c;c = c.getParentEventTarget()) {
      b.push(c), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop")
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(a), b, !1, c, d)
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
  return this.eventTargetListeners_.add(String(a), b, !0, c, d)
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
  return this.eventTargetListeners_.remove(String(a), b, c, d)
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
  return this.eventTargetListeners_.removeByKey(a)
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
  return!this.eventTargetListeners_ ? 0 : this.eventTargetListeners_.removeAll(a)
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
  a = this.eventTargetListeners_.listeners[String(a)];
  if(!a) {
    return!0
  }
  a = a.concat();
  for(var d = !0, e = 0;e < a.length;++e) {
    var f = a[e];
    if(f && !f.removed && f.capture == b) {
      var g = f.listener, h = f.handler || f.src;
      f.callOnce && this.unlistenByKey(f);
      d = !1 !== g.call(h, c) && d
    }
  }
  return d && !1 != c.returnValue_
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
  return this.eventTargetListeners_.getListeners(String(a), b)
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
  return this.eventTargetListeners_.getListener(String(a), b, c, d)
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a) ? String(a) : void 0;
  return this.eventTargetListeners_.hasListener(c, b)
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
  this.actualEventTarget_ = a
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
  var d = b.type || b;
  if(goog.isString(b)) {
    b = new goog.events.Event(b, a)
  }else {
    if(b instanceof goog.events.Event) {
      b.target = b.target || a
    }else {
      var e = b;
      b = new goog.events.Event(d, a);
      goog.object.extend(b, e)
    }
  }
  var e = !0, f;
  if(c) {
    for(var g = c.length - 1;!b.propagationStopped_ && 0 <= g;g--) {
      f = b.currentTarget = c[g], e = f.fireListeners(d, !0, b) && e
    }
  }
  b.propagationStopped_ || (f = b.currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
  if(c) {
    for(g = 0;!b.propagationStopped_ && g < c.length;g++) {
      f = b.currentTarget = c[g], e = f.fireListeners(d, !1, b) && e
    }
  }
  return e
};
lime.userAgent = {};
(function() {
  var a = goog.userAgent.getUserAgentString();
  lime.userAgent.IOS = goog.userAgent.WEBKIT && goog.userAgent.MOBILE && /(ipod|iphone|ipad)/i.test(a);
  lime.userAgent.IOS5 = lime.userAgent.IOS && goog.isFunction(Object.freeze);
  lime.userAgent.ANDROID = goog.userAgent.WEBKIT && goog.userAgent.MOBILE && /(android)/i.test(a);
  lime.userAgent.WINPHONE = goog.userAgent.MOBILE && /(iemobile)/i.test(a);
  lime.userAgent.IPAD = lime.userAgent.IOS && /(ipad)/i.test(a);
  lime.userAgent.IPHONE4 = lime.userAgent.IOS && 2 <= goog.global.devicePixelRatio;
  lime.userAgent.PLAYBOOK = goog.userAgent.WEBKIT && /playbook/i.test(a);
  lime.userAgent.CHROME = goog.userAgent.WEBKIT && /Chrome\//i.test(a);
  lime.userAgent.SUPPORTS_TOUCH = goog.isDef(document.ontouchmove)
})();
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : !a || !b ? !1 : a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
  }
  return!1
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, k = b.top + b.height;
  b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
  k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
  var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
  a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
  return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
  return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Rect.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
  return this
};
goog.math.Rect.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.width *= a;
  this.top *= c;
  this.height *= c;
  return this
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
  if(b && a in b) {
    return a
  }
  var c = goog.dom.vendor.getVendorJsPrefix();
  return c ? (c = c.toLowerCase(), c += goog.string.toTitleCase(a), !goog.isDef(b) || c in b ? c : null) : null
};
goog.dom.vendor.getPrefixedEventType = function(a) {
  return((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase()
};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  goog.dom.classes.set(a, c.join(" "));
  return c.length == e
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  goog.dom.classes.set(a, e.join(" "));
  return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0;c < b.length;c++) {
    goog.array.contains(a, b[c]) || a.push(b[c])
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(b, a)
  })
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a
  }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
  return a
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  }
};
goog.functions.fail = function(a) {
  return function() {
    throw a;
  }
};
goog.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
  }
};
goog.functions.nth = function(a) {
  return function() {
    return arguments[a]
  }
};
goog.functions.withReturnValue = function(a, b) {
  return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for(var b = d - 2;0 <= b;b--) {
      a = c[b].call(this, a)
    }
    return a
  }
};
goog.functions.sequence = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a, e = 0;e < c;e++) {
      a = b[e].apply(this, arguments)
    }
    return a
  }
};
goog.functions.and = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(!b[a].apply(this, arguments)) {
        return!1
      }
    }
    return!0
  }
};
goog.functions.or = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(b[a].apply(this, arguments)) {
        return!0
      }
    }
    return!1
  }
};
goog.functions.not = function(a) {
  return function() {
    return!a.apply(this, arguments)
  }
};
goog.functions.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
  var b = !1, c;
  return function() {
    if(!goog.functions.CACHE_RETURN_VALUE) {
      return a()
    }
    b || (c = a(), b = !0);
    return c
  }
};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.dom.getElementHelper_(document, a)
};
goog.dom.getElementHelper_ = function(a, b) {
  return goog.isString(b) ? a.getElementById(b) : b
};
goog.dom.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(document, a)
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
  goog.asserts.assertString(b);
  var c = goog.dom.getElementHelper_(a, b);
  return c = goog.asserts.assertElement(c, "No element found with id: " + b)
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)[0]) || null
};
goog.dom.getRequiredElementByClass = function(a, b) {
  var c = goog.dom.getElementByClass(a, b);
  return goog.asserts.assert(c, "No element found with className: " + a)
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      d = {};
      for(var e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    var c = b.body, d = b.documentElement;
    if(!c && !d) {
      return 0
    }
    a = goog.dom.getViewportSize_(a).height;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e
    }
    c.push(">");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["<tr>"], f = 0;f < c;f++) {
    e.push(d ? "<td>&nbsp;</td>" : "<td></td>")
  }
  e.push("</tr>");
  e = e.join("");
  c = ["<table>"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  var b;
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && (!goog.userAgent.IE || (!goog.userAgent.isVersionOrHigher("9") || goog.userAgent.isVersionOrHigher("10")) || !(goog.global.SVGElement && a instanceof goog.global.SVGElement))) {
    if(b = a.parentElement) {
      return b
    }
  }
  b = a.parentNode;
  return goog.dom.isElement(b) ? b : null
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if(a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(c) {
    if(1 == c) {
      return arguments[0]
    }
  }else {
    return null
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  goog.asserts.assert(a, "Node cannot be null or undefined.");
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  goog.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      a.data = b
    }else {
      if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for(;a.lastChild != a.firstChild;) {
          a.removeChild(a.lastChild)
        }
        a.firstChild.data = b
      }else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)))
      }
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a)
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.isFocusable = function(a) {
  var b;
  return(b = goog.dom.nativelySupportsFocus_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
  a = a.getAttributeNode("tabindex");
  return goog.isDefAndNotNull(a) && a.specified
};
goog.dom.isTabIndexFocusable_ = function(a) {
  a = a.tabIndex;
  return goog.isNumber(a) && 0 <= a && 32768 > a
};
goog.dom.nativelySupportsFocus_ = function(a) {
  return a.tagName == goog.dom.TagName.A || a.tagName == goog.dom.TagName.INPUT || a.tagName == goog.dom.TagName.TEXTAREA || a.tagName == goog.dom.TagName.SELECT || a.tagName == goog.dom.TagName.BUTTON
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
  a = goog.isFunction(a.getBoundingClientRect) ? a.getBoundingClientRect() : {height:a.offsetHeight, width:a.offsetWidth};
  return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for(var d = 0, e = null;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  if(!b && !c) {
    return null
  }
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  c = null == d;
  for(var e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.getPixelRatio = goog.functions.cacheReturnValue(function() {
  var a = goog.dom.getWindow(), b = goog.userAgent.GECKO && goog.userAgent.MOBILE;
  return goog.isDef(a.devicePixelRatio) && !b ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(0.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1 : 1
});
goog.dom.matchesPixelRatio_ = function(a) {
  return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: " + a + "),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + a + "dppx)").matches ? a : 0
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.dom.getElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(a, b) {
  return goog.dom.getRequiredElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  if(void 0 === a.style[c]) {
    var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c);
    if(void 0 !== a.style[d]) {
      return d
    }
  }
  return c
};
goog.style.getVendorStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
  var c = a.style[goog.string.toCamelCase(b)];
  return"undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedBoxSizing = function(a) {
  return goog.style.getStyle_(a, "boxSizing") || goog.style.getStyle_(a, "MozBoxSizing") || goog.style.getStyle_(a, "WebkitBoxSizing") || null
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.getComputedTransform = function(a) {
  var b = goog.style.getVendorStyleName_(a, "transform");
  return goog.style.getStyle_(a, b) || goog.style.getStyle_(a, "transform")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
  b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9) && !goog.dom.getDomHelper(a).isCss1CompatMode() ? a.body : a.documentElement
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body;
  a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
  var b;
  try {
    b = a.getBoundingClientRect()
  }catch(c) {
    return{left:0, top:0, right:0, bottom:0}
  }
  goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return a.offsetParent
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c;
  for(a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if((!goog.userAgent.IE || 0 != a.clientWidth) && (!goog.userAgent.WEBKIT || 0 != a.clientHeight || a != d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x)
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left, d = d.y - e.y - f.top, e = b.clientWidth - a.offsetWidth;
  a = b.clientHeight - a.offsetHeight;
  f = b.scrollLeft;
  b = b.scrollTop;
  c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
  return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), b = b + c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position");
  goog.asserts.assertObject(a, "Parameter is required");
  var e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        if(f.x -= b.scrollLeft, !goog.userAgent.OPERA || "TR" != b.tagName) {
          f.y -= b.scrollTop
        }
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(goog.asserts.assert(e));
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
  var b;
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top)
  }else {
    b = goog.dom.getDomHelper(a).getDocumentScroll();
    var c = goog.style.getPageOffset(a);
    b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
  }
  return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
  goog.asserts.assert(a);
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(a)
  }
  var b = goog.isFunction(a.getBrowserEvent), c = a;
  a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
  return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a)
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
  if("none" != goog.style.getStyle_(b, "display")) {
    return a(b)
  }
  var c = b.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  var g = a(b);
  c.display = d;
  c.position = f;
  c.visibility = e;
  return g
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return(!goog.isDef(b) || d) && a.getBoundingClientRect ? (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top)) : new goog.math.Size(b, c)
};
goog.style.getTransformedSize = function(a) {
  if(!a.getBoundingClientRect) {
    return null
  }
  a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
  return new goog.math.Size(a.right - a.left, a.bottom - a.top)
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style;
  a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
  goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null, e = c.getDocument();
  goog.userAgent.IE && e.createStyleSheet ? (d = e.createStyleSheet(), goog.style.setStyles(d, a)) : (e = c.getElementsByTagNameAndClass("head")[0], e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d)), d = c.createDom("style"), goog.style.setStyles(d, a), c.appendChild(e, d));
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  goog.userAgent.IE && goog.isDef(a.cssText) ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
  c = !c ? a.getElementsByTagName("*") : null;
  var d = goog.style.unselectableStyle_;
  if(d) {
    if(b = b ? "none" : "", a.style[d] = b, c) {
      a = 0;
      for(var e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersionOrHigher("8"))) {
    if(c = a.style, d) {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(goog.userAgent.IE && (!d || !goog.userAgent.isVersionOrHigher("8"))) {
    if(c = a.style, d) {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }else {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return b
};
goog.style.getIePixelDistance_ = function(a, b) {
  var c = goog.style.getCascadedStyle(a, b);
  return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  f = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange && goog.dom.contains(b, a)) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("div");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  a = goog.style.getComputedTransform(a);
  if(!a) {
    return new goog.math.Coordinate(0, 0)
  }
  a = a.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  return!a ? new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2]))
};
lime.style = {};
(function() {
  var a = goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.OPERA ? "O" : goog.userAgent.IE ? "ms" : "", b = goog.dom.createDom("div").style;
  lime.style.transformProperty = "-" + a.toLowerCase() + "-transform";
  lime.style.tryProperty = function(a) {
    return void 0 !== b[a] ? a : !1
  };
  lime.style.getCSSproperty = function(b) {
    var d = b.charAt(0).toLowerCase() + b.substr(1), e = a + b;
    return lime.style.tryProperty(b) ? b : lime.style.tryProperty(d) ? d : lime.style.tryProperty(e) ? e : void 0
  }
})();
lime.style.setBorderRadius = function() {
  var a = lime.style.getCSSproperty("BorderRadius");
  return function(b, c, d, e) {
    e = e ? "%" : "px";
    d = goog.isDef(d) ? d : c;
    c = (goog.isArray(c) ? c.join(e + " ") : c) + e + "/" + ((goog.isArray(d) ? d.join(e + " ") : d) + e);
    c != b.border_radius_cache_ && (b.style[a] = b.border_radius_cache_ = c)
  }
}();
lime.style.Transform = function(a) {
  this.values = [];
  this.precision = 1;
  this.enable3D_ = !0;
  this.opt_precision && this.setPrecision(a)
};
lime.style.Transform.prototype.set3DAllowed = function(a) {
  this.enable3D_ = a;
  return this
};
lime.style.Transform.prototype.scale = function(a, b) {
  this.values.push("scale(" + a + "," + b + ")");
  return this
};
lime.style.Transform.prototype.rotate = function(a, b) {
  var c;
  c = this.enable3D_ && (lime.userAgent.IOS || lime.userAgent.PLAYBOOK) ? "rotate3d(0, 0, 1, " + a + (b ? b : "deg") + ")" : "rotate(" + a + (b ? b : "deg") + ")";
  0 != a && this.values.push(c);
  return this
};
lime.style.Transform.prototype.translate = function(a, b, c) {
  var d = 1 / this.precision, e = "translate";
  if(this.enable3D_ && (lime.userAgent.CHROME || lime.userAgent.IOS || lime.userAgent.PLAYBOOK)) {
    e += "3d"
  }
  e += "(" + a * d + "px," + b * d + "px";
  if(this.enable3D_ && (lime.userAgent.CHROME || lime.userAgent.IOS || lime.userAgent.PLAYBOOK)) {
    e += "," + (c ? c : 0) * d + "px"
  }
  this.values.push(e + ")");
  return this
};
lime.style.Transform.prototype.setPrecision = function(a) {
  if(1 != this.precision) {
    var b = 1 / this.precision;
    this.scale(b, b);
    this.precision = 1
  }
  1 != a && (this.scale(a, a), this.precision = a);
  return this
};
lime.style.Transform.prototype.toString = function() {
  1 != this.precision && this.setPrecision(1);
  return this.values.join(" ")
};
lime.style.setTransform = function() {
  var a = lime.style.getCSSproperty("Transform");
  return function(b, c) {
    var d = c.toString();
    d != b.transform_cache_ && (b.style[a] = b.transform_cache_ = d);
    lime.transformSet_ = 1
  }
}();
lime.style.setTransformOrigin = function() {
  var a = lime.style.getCSSproperty("TransformOrigin");
  return function(b, c, d, e) {
    e = e ? "%" : "px";
    c = c + e + " " + d + e;
    c != b.transform_origin_cache_ && (b.style[a] = b.transform_origin_cache_ = c)
  }
}();
(function() {
  var a = lime.style.getCSSproperty("Transition");
  lime.style.isTransitionsSupported = !!a && !goog.userAgent.OPERA;
  var b = function(a, b) {
    if(!a.length) {
      return a
    }
    for(var e = a.split("),"), f = 0;f < e.length - 1;f++) {
      e[f] += ")"
    }
    e = goog.array.filter(e, function(a) {
      return-1 == a.indexOf(b)
    });
    return e.join(",")
  };
  lime.style.setTransition = function(c, d, e, f) {
    if(a) {
      var g = b(c.style[a], d);
      g.length && (g += ", ");
      g += d + " " + e + "s cubic-bezier(" + f[1] + "," + f[2] + "," + f[3] + "," + f[4] + ")";
      c.style[a] = g
    }
  };
  lime.style.clearTransition = function(c, d) {
    a && c && (c.style[a] = b(c.style[a], d))
  };
  lime.style.setSize = function(a, b, e) {
    if(a.width_cache_ != b || a.height_cache_ != e) {
      return a.width_cache_ = b, a.height_cache_ = e, goog.style.setSize(a, b, e)
    }
  }
})();
lime.Renderer.DOM = new lime.Renderer;
lime.Renderer.DOM.updateLayout = function() {
  for(var a = 0, b, c = 0;b = this.children_[c];c++) {
    b = b instanceof lime.Node ? b.rootElement : b, b == this.domElement.childNodes[a] ? a++ : (goog.dom.contains(this.containerElement, b) && goog.dom.removeNode(b), lime.Renderer.DOM.appendAt_(this.containerElement, b, a++))
  }
};
lime.Renderer.DOM.drawSizePosition = function() {
  var a = this.getSize(), b = this.getPosition(), c = this.getScale(), d = this.getCSS3DTransformsAllowed();
  this.transitionsActive_[lime.Transition.POSITION] && (b = this.transitionsActive_[lime.Transition.POSITION]);
  var e = a.width, a = a.height, c = c.clone();
  this.transitionsActive_[lime.Transition.SCALE] && (c = this.transitionsActive_[lime.Transition.SCALE].clone());
  lime.style.setSize(this.domElement, e, a);
  lime.style.setTransformOrigin(this.domElement, 100 * this.anchorPoint_.x, 100 * this.anchorPoint_.y, !0);
  var e = this.anchorPoint_.x * e, f = this.anchorPoint_.y * a, a = b.x - e, b = b.y - f, g = this.stroke_ ? this.stroke_.width_ : 0;
  (0 != e - g || 0 != f - g) && (this.domElement == this.containerElement && this.children_.length) && lime.Renderer.DOM.makeContainer.call(this);
  this.domElement != this.containerElement && !this.transitionsActiveSet_[lime.Transition.POSITION] && (!this.transitionsActiveSet_[lime.Transition.SCALE] && !this.transitionsActiveSet_[lime.Transition.ROTATION]) && lime.style.setTransform(this.containerElement, (new lime.style.Transform).set3DAllowed(d).translate(e - g, f - g));
  this.mask_ != this.activeMask_ && (this.activeMask_ && lime.Renderer.DOM.removeMask.call(this), this.mask_ && lime.Renderer.DOM.addMask.call(this));
  d = (new lime.style.Transform).setPrecision(0.1).set3DAllowed(d);
  this.mask_ && (lime.Renderer.DOM.calculateMaskPosition.call(this.mask_), d.setPrecision(0.1).translate(-this.mask_.mX - e, -this.mask_.mY - f).rotate(this.mask_.mRot, "rad").translate(e, f).setPrecision(1));
  e = -this.getRotation();
  goog.isDef(this.transitionsActive_[lime.Transition.ROTATION]) && (e = -this.transitionsActive_[lime.Transition.ROTATION]);
  d.translate(a, b).scale(c.x, c.y).rotate(e);
  !this.transitionsActiveSet_[lime.Transition.POSITION] && (!this.transitionsActiveSet_[lime.Transition.SCALE] && !this.transitionsActiveSet_[lime.Transition.ROTATION]) && lime.style.setTransform(this.domElement, d)
};
lime.Renderer.DOM.update = function() {
  if(this.domElement) {
    lime.Renderer.DOM.drawSizePosition.call(this);
    if(!this.transitionsActiveSet_[lime.Transition.OPACITY]) {
      var a = this.opacity_;
      goog.isDef(this.transitionsActive_[lime.Transition.OPACITY]) && (a = this.transitionsActive_[lime.Transition.OPACITY]);
      this.getDirty() & lime.Dirty.ALPHA && goog.style.setOpacity(this.domElement, a)
    }
    this.getDirty() & lime.Dirty.VISIBILITY && (this.domElement.style.display = this.hidden_ ? "none" : "block");
    this.maskTarget_ || this.renderer.draw.call(this, this.domElement)
  }
};
lime.Renderer.DOM.calculateMaskPosition = function() {
  if(goog.isDef(this.targetNode) && this.targetNode.inTree_) {
    var a = this.targetNode, b = this.getFrame(), c = new goog.math.Coordinate(b.left, b.top), d = new goog.math.Coordinate(b.right, b.top), e = new goog.math.Coordinate(b.right, b.bottom), b = a.getParent(), c = this.localToNode(c, b), d = this.localToNode(d, b), e = this.localToNode(e, b), b = Math.atan2(c.y - d.y, d.x - c.x), f = d.x - c.x, g = c.y - d.y, h = e.x - d.x, k = e.y - d.y, d = Math.cos(b), e = Math.sin(b);
    this.mWidth = Math.round(Math.sqrt(f * f + g * g));
    this.mHeight = Math.round(Math.sqrt(h * h + k * k));
    a.renderer.getType() == lime.Renderer.DOM && (f = a.rootElement, goog.style.setSize(f, this.mWidth, this.mHeight), lime.style.setTransform(f, (new lime.style.Transform).setPrecision(0.1).set3DAllowed(this.getCSS3DTransformsAllowed()).translate(c.x, c.y).rotate(-b, "rad")));
    this.renderer.getType() == lime.Renderer.DOM && (this.domElement.style.display = "none");
    this.mPos = a.parentToLocal(c.clone());
    this.mSet = !0;
    this.mX = d * c.x - e * c.y;
    this.mY = d * c.y + e * c.x;
    this.mRot = b
  }
};
lime.Renderer.DOM.appendAt_ = function(a, b, c) {
  void 0 == c || a.childNodes.length <= c ? a.appendChild(b) : a.insertBefore(b, a.childNodes[c])
};
lime.Renderer.DOM.makeContainer = function() {
  this.containerElement = goog.dom.createDom("div");
  for(var a = document.createDocumentFragment(), b;b = this.domElement.firstChild;) {
    this.domElement.removeChild(b), a.appendChild(b)
  }
  this.containerElement.appendChild(a);
  this.domElement.appendChild(this.containerElement)
};
lime.Renderer.DOM.removeMask = function() {
  this.domElement != this.rootElement && (this.renderer.getType() == lime.Renderer.DOM && (goog.dom.removeNode(this.domElement), goog.dom.replaceNode(this.domElement, this.rootElement), this.rootElement = this.domElement), this.activeMask_.isMask = 0, this.activeMask_ = null)
};
lime.Renderer.DOM.addMask = function() {
  this.renderer.getType() == lime.Renderer.DOM && (this.rootElement = goog.dom.createDom("div"), this.rootElement.style.cssText = "position:absolute;overflow:hidden;", lime.style.setTransformOrigin(this.rootElement, 0, 0), goog.dom.replaceNode(this.rootElement, this.domElement), this.rootElement.appendChild(this.domElement));
  this.mask_.isMask = 1;
  this.mask_.targetNode = this;
  this.activeMask_ = this.mask_;
  this.mask_.setDirty(lime.Dirty.POSITION)
};
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
goog.string.TypedString = function() {
};
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_
};
goog.string.Const.prototype.implementsGoogStringTypedString = !0;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
};
goog.string.Const.prototype.toString = function() {
  return"Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
};
goog.string.Const.unwrap = function(a) {
  if(a instanceof goog.string.Const && a.constructor === goog.string.Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_
  }
  goog.asserts.fail("expected object of type Const, got '" + a + "'");
  return"type_error:Const"
};
goog.string.Const.from = function(a) {
  return goog.string.Const.create__googStringSecurityPrivate_(a)
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(a) {
  var b = new goog.string.Const;
  b.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a;
  return b
};
goog.i18n = {};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 
2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0, UNKNOWN:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a, b) {
  return"number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : b ? null : goog.i18n.bidi.Dir.NEUTRAL : null == a ? null : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, b) {
  return b ? a.replace(goog.i18n.bidi.htmlSkipReg_, "") : a
};
goog.i18n.bidi.rtlCharReg_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, b) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, b) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.ltrRe_ = RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
  return goog.i18n.bidi.rtlRe_.test(a)
};
goog.i18n.bidi.isLtrChar = function(a) {
  return goog.i18n.bidi.ltrRe_.test(a)
};
goog.i18n.bidi.isNeutralChar = function(a) {
  return!goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a)
};
goog.i18n.bidi.ltrDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, b) {
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b);
  return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a)
};
goog.i18n.bidi.ltrExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b))
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = RegExp("^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(a) {
  return goog.i18n.bidi.rtlLocalesRe_.test(a)
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(a, b) {
  return(void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>") : a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
};
goog.i18n.bidi.guardBracketInText = function(a, b) {
  var c = (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return a.replace(goog.i18n.bidi.bracketGuardTextRe_, c + "$&" + c)
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>"
};
goog.i18n.bidi.enforceRtlInText = function(a) {
  return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>"
};
goog.i18n.bidi.enforceLtrInText = function(a) {
  return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
  return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
  return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.4;
goog.i18n.bidi.estimateDirection = function(a, b) {
  for(var c = 0, d = 0, e = !1, f = goog.i18n.bidi.stripHtmlIfNeeded_(a, b).split(goog.i18n.bidi.wordSeparatorRe_), g = 0;g < f.length;g++) {
    var h = f[g];
    goog.i18n.bidi.startsWithRtl(h) ? (c++, d++) : goog.i18n.bidi.isRequiredLtrRe_.test(h) ? e = !0 : goog.i18n.bidi.hasAnyLtr(h) ? d++ : goog.i18n.bidi.hasNumeralsRe_.test(h) && (e = !0)
  }
  return 0 == d ? e ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : c / d > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.detectRtlDirectionality = function(a, b) {
  return goog.i18n.bidi.estimateDirection(a, b) == goog.i18n.bidi.Dir.RTL
};
goog.i18n.bidi.setElementDirAndAlign = function(a, b) {
  if(a && (b = goog.i18n.bidi.toDir(b))) {
    a.style.textAlign = b == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT, a.dir = b == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.html = {};
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR
};
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
  return"SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
});
goog.html.SafeUrl.unwrap = function(a) {
  if(a instanceof goog.html.SafeUrl && a.constructor === goog.html.SafeUrl && a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_
  }
  goog.asserts.fail("expected object of type SafeUrl, got '" + a + "'");
  return"type_error:SafeUrl"
};
goog.html.SafeUrl.fromConstant = function(a) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(goog.string.Const.unwrap(a))
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto):|[^&:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(a) {
  if(a instanceof goog.html.SafeUrl) {
    return a
  }
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  a = goog.html.SAFE_URL_PATTERN_.test(a) ? goog.html.SafeUrl.normalize_(a) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.SafeUrl.normalize_ = function(a) {
  try {
    var b = encodeURI(a)
  }catch(c) {
    return goog.html.SafeUrl.INNOCUOUS_STRING
  }
  return b.replace(goog.html.SafeUrl.NORMALIZE_MATCHER_, function(a) {
    return goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_[a]
  })
};
goog.html.SafeUrl.NORMALIZE_MATCHER_ = /[()']|%5B|%5D|%25/g;
goog.html.SafeUrl.NORMALIZE_REPLACER_MAP_ = {"'":"%27", "(":"%28", ")":"%29", "%5B":"[", "%5D":"]", "%25":"%"};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
  var b = new goog.html.SafeUrl;
  b.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  return b
};
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  if(0 === a.length) {
    return goog.html.SafeStyle.EMPTY
  }
  goog.html.SafeStyle.checkStyle_(a);
  goog.asserts.assert(goog.string.endsWith(a, ";"), "Last character of style string is not ';': " + a);
  goog.asserts.assert(goog.string.contains(a, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + a);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(a)
};
goog.html.SafeStyle.checkStyle_ = function(a) {
  goog.asserts.assert(!/[<>]/.test(a), "Forbidden characters in style string: " + a)
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
};
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
  return"SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
});
goog.html.SafeStyle.unwrap = function(a) {
  if(a instanceof goog.html.SafeStyle && a.constructor === goog.html.SafeStyle && a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeStyleWrappedValue_
  }
  goog.asserts.fail("expected object of type SafeStyle, got '" + a + "'");
  return"type_error:SafeStyle"
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_ = function(a) {
  var b = new goog.html.SafeStyle;
  b.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
  return b
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.create = function(a) {
  var b = "", c;
  for(c in a) {
    if(!/^[-_a-zA-Z0-9]+$/.test(c)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + c);
    }
    var d = a[c];
    null != d && (d instanceof goog.string.Const ? (d = goog.string.Const.unwrap(d), goog.asserts.assert(!/[{;}]/.test(d), "Value does not allow [{;}].")) : goog.html.SafeStyle.VALUE_RE_.test(d) || (goog.asserts.fail("String value allows only [-.%_!# a-zA-Z0-9], got: " + d), d = goog.html.SafeStyle.INNOCUOUS_STRING), b += c + ":" + d + ";")
  }
  if(!b) {
    return goog.html.SafeStyle.EMPTY
  }
  goog.html.SafeStyle.checkStyle_(b);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(b)
};
goog.html.SafeStyle.VALUE_RE_ = /^[-.%_!# a-zA-Z0-9]+$/;
goog.html.SafeStyle.concat = function(a) {
  var b = "", c = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyle.unwrap(a)
  };
  goog.array.forEach(arguments, c);
  return!b ? goog.html.SafeStyle.EMPTY : goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(b)
};
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR
};
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
  return"TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}"
});
goog.html.TrustedResourceUrl.unwrap = function(a) {
  if(a instanceof goog.html.TrustedResourceUrl && a.constructor === goog.html.TrustedResourceUrl && a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
  }
  goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + a + "'");
  return"type_error:TrustedResourceUrl"
};
goog.html.TrustedResourceUrl.fromConstant = function(a) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(goog.string.Const.unwrap(a))
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_ = function(a) {
  var b = new goog.html.TrustedResourceUrl;
  b.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = a;
  return b
};
goog.dom.tags = {};
goog.dom.tags.VOID_TAGS_ = goog.object.createSet("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));
goog.dom.tags.isVoidTag = function(a) {
  return!0 === goog.dom.tags.VOID_TAGS_[a]
};
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_
};
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
  return"SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
});
goog.html.SafeHtml.unwrap = function(a) {
  if(a instanceof goog.html.SafeHtml && a.constructor === goog.html.SafeHtml && a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_
  }
  goog.asserts.fail("expected object of type SafeHtml, got '" + a + "'");
  return"type_error:SafeHtml"
};
goog.html.SafeHtml.htmlEscape = function(a) {
  if(a instanceof goog.html.SafeHtml) {
    return a
  }
  var b = null;
  a.implementsGoogI18nBidiDirectionalString && (b = a.getDirection());
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(goog.string.htmlEscape(a), b)
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(a) {
  if(a instanceof goog.html.SafeHtml) {
    return a
  }
  a = goog.html.SafeHtml.htmlEscape(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(a)), a.getDirection())
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = goog.object.createSet("action", "cite", "data", "formaction", "href", "manifest", "poster", "src");
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog.object.createSet("link", "script", "style");
goog.html.SafeHtml.create = function(a, b, c) {
  if(!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) {
    throw Error("Invalid tag name <" + a + ">.");
  }
  if(a.toLowerCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + a + "> is not allowed for SafeHtml.");
  }
  var d = null, e = "<" + a;
  if(b) {
    for(var f in b) {
      if(!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(f)) {
        throw Error('Invalid attribute name "' + f + '".');
      }
      var g = b[f];
      if(null != g) {
        if(g instanceof goog.string.Const) {
          g = goog.string.Const.unwrap(g)
        }else {
          if("style" == f.toLowerCase()) {
            g = goog.html.SafeHtml.getStyleValue_(g)
          }else {
            if(/^on/i.test(f)) {
              throw Error('Attribute "' + f + '" requires goog.string.Const value, "' + g + '" given.');
            }
            if(g instanceof goog.html.SafeUrl) {
              g = goog.html.SafeUrl.unwrap(g)
            }else {
              if(f.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
                throw Error('Attribute "' + f + '" requires goog.string.Const or goog.html.SafeUrl value, "' + g + '" given.');
              }
            }
          }
        }
        goog.asserts.assert(goog.isString(g) || goog.isNumber(g), "String or number value expected, got " + typeof g + " with value: " + g);
        e += " " + f + '="' + goog.string.htmlEscape(String(g)) + '"'
      }
    }
  }
  goog.isDef(c) ? goog.isArray(c) || (c = [c]) : c = [];
  goog.dom.tags.isVoidTag(a.toLowerCase()) ? (goog.asserts.assert(!c.length, "Void tag <" + a + "> does not allow content."), e += ">") : (d = goog.html.SafeHtml.concat(c), e += ">" + goog.html.SafeHtml.unwrap(d) + "</" + a + ">", d = d.getDirection());
  (a = b && b.dir) && (d = /^(ltr|rtl|auto)$/i.test(a) ? goog.i18n.bidi.Dir.NEUTRAL : null);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(e, d)
};
goog.html.SafeHtml.getStyleValue_ = function(a) {
  if(!goog.isObject(a)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a);
  }
  a instanceof goog.html.SafeStyle || (a = goog.html.SafeStyle.create(a));
  return goog.html.SafeStyle.unwrap(a)
};
goog.html.SafeHtml.createWithDir = function(a, b, c, d) {
  b = goog.html.SafeHtml.create(b, c, d);
  b.dir_ = a;
  return b
};
goog.html.SafeHtml.concat = function(a) {
  var b = goog.i18n.bidi.Dir.NEUTRAL, c = "", d = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, d) : (a = goog.html.SafeHtml.htmlEscape(a), c += goog.html.SafeHtml.unwrap(a), a = a.getDirection(), b == goog.i18n.bidi.Dir.NEUTRAL ? b = a : a != goog.i18n.bidi.Dir.NEUTRAL && b != a && (b = null))
  };
  goog.array.forEach(arguments, d);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(c, b)
};
goog.html.SafeHtml.concatWithDir = function(a, b) {
  var c = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  c.dir_ = a;
  return c
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_ = function(a, b) {
  var c = new goog.html.SafeHtml;
  c.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  c.dir_ = b;
  return c
};
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.htmlEscape("");
goog.html.uncheckedconversions = {};
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(a, b, c) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(0 < goog.string.trim(goog.string.Const.unwrap(a)).length, "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse_(b, c || null)
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(0 < goog.string.trim(goog.string.Const.unwrap(a)).length, "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse_(b)
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(0 < goog.string.trim(goog.string.Const.unwrap(a)).length, "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse_(b)
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(0 < goog.string.trim(goog.string.Const.unwrap(a)).length, "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse_(b)
};
goog.soy = {};
goog.soy.data = {};
goog.soy.data.SanitizedContentKind = {HTML:goog.DEBUG ? {sanitizedContentKindHtml:!0} : {}, JS:goog.DEBUG ? {sanitizedContentJsChars:!0} : {}, JS_STR_CHARS:goog.DEBUG ? {sanitizedContentJsStrChars:!0} : {}, URI:goog.DEBUG ? {sanitizedContentUri:!0} : {}, ATTRIBUTES:goog.DEBUG ? {sanitizedContentHtmlAttribute:!0} : {}, CSS:goog.DEBUG ? {sanitizedContentCss:!0} : {}, TEXT:goog.DEBUG ? {sanitizedContentKindText:!0} : {}};
goog.soy.data.SanitizedContent = function() {
  throw Error("Do not instantiate directly");
};
goog.soy.data.SanitizedContent.prototype.contentDir = null;
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content
};
goog.soy.data.SanitizedContent.prototype.toSafeHtml = function() {
  if(this.contentKind === goog.soy.data.SanitizedContentKind.TEXT) {
    return goog.html.SafeHtml.htmlEscape(this.toString())
  }
  if(this.contentKind !== goog.soy.data.SanitizedContentKind.HTML) {
    throw Error("Sanitized content was not of kind TEXT or HTML.");
  }
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind HTML produces SafeHtml-contract-compliant value."), this.toString(), this.contentDir)
};
goog.soy.REQUIRE_STRICT_AUTOESCAPE = !1;
goog.soy.renderElement = function(a, b, c, d) {
  goog.asserts.assert(b, "Soy template may not be null.");
  a.innerHTML = goog.soy.ensureTemplateOutputHtml_(b(c || goog.soy.defaultTemplateData_, void 0, d))
};
goog.soy.renderAsFragment = function(a, b, c, d) {
  goog.asserts.assert(a, "Soy template may not be null.");
  d = d || goog.dom.getDomHelper();
  a = goog.soy.ensureTemplateOutputHtml_(a(b || goog.soy.defaultTemplateData_, void 0, c));
  goog.soy.assertFirstTagValid_(a);
  return d.htmlToDocumentFragment(a)
};
goog.soy.renderAsElement = function(a, b, c, d) {
  goog.asserts.assert(a, "Soy template may not be null.");
  d = (d || goog.dom.getDomHelper()).createElement(goog.dom.TagName.DIV);
  a = goog.soy.ensureTemplateOutputHtml_(a(b || goog.soy.defaultTemplateData_, void 0, c));
  goog.soy.assertFirstTagValid_(a);
  d.innerHTML = a;
  return 1 == d.childNodes.length && (a = d.firstChild, a.nodeType == goog.dom.NodeType.ELEMENT) ? a : d
};
goog.soy.ensureTemplateOutputHtml_ = function(a) {
  if(!goog.soy.REQUIRE_STRICT_AUTOESCAPE && !goog.isObject(a)) {
    return String(a)
  }
  if(a instanceof goog.soy.data.SanitizedContent) {
    var b = goog.soy.data.SanitizedContentKind;
    if(a.contentKind === b.HTML) {
      return goog.asserts.assertString(a.content)
    }
    if(a.contentKind === b.TEXT) {
      return goog.string.htmlEscape(a.content)
    }
  }
  goog.asserts.fail("Soy template output is unsafe for use as HTML: " + a);
  return"zSoyz"
};
goog.soy.assertFirstTagValid_ = function(a) {
  if(goog.asserts.ENABLE_ASSERTS) {
    var b = a.match(goog.soy.INVALID_TAG_TO_RENDER_);
    goog.asserts.assert(!b, "This template starts with a %s, which cannot be a child of a <div>, as required by soy internals. Consider using goog.soy.renderElement instead.\nTemplate output: %s", b && b[0], a)
  }
};
goog.soy.INVALID_TAG_TO_RENDER_ = /^<(body|caption|col|colgroup|head|html|tr|td|tbody|thead|tfoot)>/i;
goog.soy.defaultTemplateData_ = {};
goog.structs = {};
goog.structs.InversionMap = function(a, b, c) {
  this.rangeArray = null;
  if(a.length != b.length) {
    return null
  }
  this.storeInversion_(a, c);
  this.values = b
};
goog.structs.InversionMap.prototype.storeInversion_ = function(a, b) {
  this.rangeArray = a;
  for(var c = 1;c < a.length;c++) {
    null == a[c] ? a[c] = a[c - 1] + 1 : b && (a[c] += a[c - 1])
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(a, b, c) {
  a = new goog.structs.InversionMap(a, b, c);
  c = a.rangeArray[0];
  var d = goog.array.peek(a.rangeArray);
  b = this.getLeast(c);
  d = this.getLeast(d);
  c != this.rangeArray[b] && b++;
  c = d - b + 1;
  goog.partial(goog.array.splice, this.rangeArray, b, c).apply(null, a.rangeArray);
  goog.partial(goog.array.splice, this.values, b, c).apply(null, a.values)
};
goog.structs.InversionMap.prototype.at = function(a) {
  a = this.getLeast(a);
  return 0 > a ? null : this.values[a]
};
goog.structs.InversionMap.prototype.getLeast = function(a) {
  for(var b = this.rangeArray, c = 0, d = b.length;8 < d - c;) {
    var e = d + c >> 1;
    b[e] <= a ? c = e : d = e
  }
  for(;c < d && !(a < b[c]);++c) {
  }
  return c - 1
};
goog.i18n.GraphemeBreak = {};
goog.i18n.GraphemeBreak.property = {ANY:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, INDIC_CONSONANT:5, VIRAMA:6, L:7, V:8, T:9, LV:10, LVT:11, CR:12, LF:13, REGIONAL_INDICATOR:14};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(a, b) {
  var c = goog.i18n.GraphemeBreak.property;
  return a == c.CR && b == c.LF ? !1 : a == c.CONTROL || a == c.CR || a == c.LF || b == c.CONTROL || b == c.CR || b == c.LF ? !0 : a == c.L && (b == c.L || b == c.V || b == c.LV || b == c.LVT) || (a == c.LV || a == c.V) && (b == c.V || b == c.T) || (a == c.LVT || a == c.T) && b == c.T || (b == c.EXTEND || b == c.VIRAMA) || a == c.VIRAMA && b == c.INDIC_CONSONANT ? !1 : !0
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(a) {
  if(44032 <= a && 55203 >= a) {
    var b = goog.i18n.GraphemeBreak.property;
    return 16 == a % 28 ? b.LV : b.LVT
  }
  goog.i18n.GraphemeBreak.inversions_ || (goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 5, 11, 11, 48, 21, 16, 1, 101, 7, 1, 1, 6, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 34, 4, 1, 9, 1, 3, 1, 5, 43, 3, 136, 31, 1, 17, 37, 1, 1, 1, 1, 3, 8, 4, 1, 2, 1, 7, 8, 2, 2, 21, 8, 1, 2, 17, 39, 1, 1, 1, 2, 6, 6, 1, 9, 5, 4, 2, 2, 12, 2, 15, 2, 1, 17, 39, 2, 3, 12, 4, 8, 6, 17, 2, 3, 14, 
  1, 17, 39, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 17, 39, 1, 1, 2, 1, 6, 6, 9, 6, 4, 2, 2, 13, 1, 16, 1, 18, 41, 1, 1, 1, 12, 1, 9, 1, 41, 3, 17, 37, 4, 3, 5, 7, 8, 3, 2, 8, 2, 30, 2, 17, 39, 1, 1, 1, 1, 2, 1, 3, 1, 5, 1, 8, 9, 1, 3, 2, 30, 2, 17, 38, 3, 1, 2, 5, 7, 1, 9, 1, 10, 2, 30, 2, 22, 48, 5, 1, 2, 6, 7, 19, 2, 13, 46, 2, 1, 1, 1, 6, 1, 12, 8, 50, 46, 2, 1, 1, 1, 9, 11, 6, 14, 2, 58, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 4, 1, 1, 2, 5, 48, 9, 1, 57, 33, 12, 4, 1, 6, 1, 2, 2, 2, 1, 16, 2, 4, 
  2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 1, 1, 2, 6, 1, 1, 14, 1, 98, 96, 72, 88, 349, 3, 931, 15, 2, 1, 14, 15, 2, 1, 14, 15, 2, 15, 15, 14, 35, 17, 2, 1, 7, 8, 1, 2, 9, 1, 1, 9, 1, 45, 3, 155, 1, 87, 31, 3, 4, 2, 9, 1, 6, 3, 20, 19, 29, 44, 9, 3, 2, 1, 69, 23, 2, 3, 4, 45, 6, 2, 1, 1, 1, 8, 1, 1, 1, 2, 8, 6, 13, 128, 4, 1, 14, 33, 1, 1, 5, 1, 1, 5, 1, 1, 1, 7, 31, 9, 12, 2, 1, 7, 23, 1, 4, 2, 2, 2, 2, 2, 11, 3, 2, 36, 2, 1, 1, 2, 3, 1, 1, 3, 2, 12, 36, 8, 8, 2, 2, 21, 3, 128, 3, 1, 13, 1, 7, 4, 1, 
  4, 2, 1, 203, 64, 523, 1, 2, 2, 24, 7, 49, 16, 96, 33, 3070, 3, 141, 1, 96, 32, 554, 6, 105, 2, 30164, 4, 1, 10, 33, 1, 80, 2, 272, 1, 3, 1, 4, 1, 23, 2, 2, 1, 24, 30, 4, 4, 3, 8, 1, 1, 13, 2, 16, 34, 16, 1, 27, 18, 24, 24, 4, 8, 2, 23, 11, 1, 1, 12, 32, 3, 1, 5, 3, 3, 36, 1, 2, 4, 2, 1, 3, 1, 69, 35, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 18, 16, 1, 3, 6, 1, 5, 48, 1, 1, 3, 2, 2, 5, 2, 1, 1, 32, 9, 1, 2, 2, 5, 1, 1, 201, 14, 2, 1, 1, 9, 8, 2, 1, 2, 1, 2, 1, 1, 1, 18, 11184, 27, 49, 1028, 1024, 6942, 1, 
  737, 16, 16, 7, 216, 1, 158, 2, 89, 3, 513, 1, 2051, 15, 40, 7, 1, 1472, 1, 1, 1, 53, 14, 1, 57, 2, 1, 45, 3, 4, 2, 1, 1, 2, 1, 66, 3, 36, 5, 1, 6, 2, 75, 2, 1, 48, 3, 9, 1, 1, 1258, 1, 1, 1, 2, 6, 1, 1, 22681, 62, 4, 25042, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 8097, 26, 790017, 255], [1, 13, 1, 12, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 5, 2, 4, 2, 
  0, 4, 2, 4, 6, 4, 0, 2, 5, 0, 2, 0, 5, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 0, 2, 5, 0, 2, 0, 5, 0, 2, 4, 0, 5, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 0, 5, 2, 0, 4, 2, 4, 6, 0, 2, 0, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 2, 5, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 2, 4, 6, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 6, 2, 5, 0, 2, 0, 4, 0, 5, 0, 2, 4, 2, 4, 6, 0, 2, 0, 2, 0, 4, 0, 5, 6, 2, 4, 2, 4, 2, 4, 0, 5, 0, 2, 0, 4, 2, 6, 0, 2, 0, 5, 0, 2, 0, 4, 2, 0, 2, 0, 5, 0, 2, 0, 
  2, 0, 2, 0, 2, 0, 4, 5, 2, 4, 2, 6, 0, 2, 0, 2, 0, 2, 0, 5, 0, 2, 4, 2, 0, 6, 4, 2, 5, 0, 5, 0, 4, 2, 5, 2, 5, 0, 5, 0, 5, 2, 5, 2, 0, 4, 2, 0, 2, 5, 0, 2, 0, 7, 8, 9, 0, 2, 0, 5, 2, 6, 0, 5, 2, 6, 0, 5, 2, 0, 5, 2, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 2, 0, 2, 0, 2, 0, 2, 0, 5, 2, 4, 2, 4, 2, 4, 2, 0, 5, 0, 5, 0, 4, 0, 4, 0, 5, 2, 4, 0, 5, 0, 5, 4, 2, 4, 2, 6, 0, 2, 0, 2, 4, 2, 0, 2, 4, 0, 5, 2, 4, 2, 4, 2, 4, 2, 4, 6, 5, 0, 2, 0, 2, 4, 0, 5, 4, 2, 4, 2, 6, 4, 5, 0, 5, 0, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 
  0, 5, 4, 2, 4, 2, 0, 5, 0, 2, 0, 2, 4, 2, 0, 2, 0, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 6, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 6, 5, 2, 5, 4, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 0, 4, 0, 5, 4, 6, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 6, 0, 7, 2, 4, 0, 5, 0, 5, 2, 4, 2, 4, 2, 4, 6, 0, 5, 2, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 5, 4, 2, 4, 0, 4, 6, 0, 5, 0, 5, 0, 5, 0, 4, 2, 4, 2, 4, 0, 4, 6, 0, 11, 8, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 
  2, 0, 1, 0, 2, 0, 2, 0, 2, 6, 0, 4, 2, 4, 0, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 2, 0, 1, 0, 2, 0, 2, 4, 2, 6, 0, 2, 4, 0, 4, 2, 4, 6, 0, 2, 4, 2, 4, 2, 6, 2, 0, 4, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 14, 0, 1, 2], !0));
  return goog.i18n.GraphemeBreak.inversions_.at(a)
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, b, c) {
  a = goog.i18n.GraphemeBreak.getBreakProp_(a);
  b = goog.i18n.GraphemeBreak.getBreakProp_(b);
  var d = goog.i18n.GraphemeBreak.property;
  return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(a, b) && !(c && (a == d.PREPEND || b == d.SPACING_MARK))
};
goog.format = {};
goog.format.fileSize = function(a, b) {
  return goog.format.numBytesToString(a, b, !1)
};
goog.format.isConvertableScaledNumber = function(a) {
  return goog.format.SCALED_NUMERIC_RE_.test(a)
};
goog.format.stringToNumericValue = function(a) {
  return goog.string.endsWith(a, "B") ? goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_) : goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_SI_)
};
goog.format.stringToNumBytes = function(a) {
  return goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_)
};
goog.format.numericValueToString = function(a, b) {
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_SI_, b)
};
goog.format.numBytesToString = function(a, b, c, d) {
  var e = "";
  if(!goog.isDef(c) || c) {
    e = "B"
  }
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_BINARY_, b, e, d)
};
goog.format.stringToNumericValue_ = function(a, b) {
  var c = a.match(goog.format.SCALED_NUMERIC_RE_);
  return!c ? NaN : c[1] * b[c[2]]
};
goog.format.numericValueToString_ = function(a, b, c, d, e) {
  var f = goog.format.NUMERIC_SCALE_PREFIXES_, g = a, h = "", k = "", l = 1;
  0 > a && (a = -a);
  for(var p = 0;p < f.length;p++) {
    var m = f[p], l = b[m];
    if(a >= l || 1 >= l && a > 0.1 * l) {
      h = m;
      break
    }
  }
  h ? (d && (h += d), e && (k = " ")) : l = 1;
  a = Math.pow(10, goog.isDef(c) ? c : 2);
  return Math.round(g / l * a) / a + k + h
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = "P T G M K  m u n".split(" ");
goog.format.NUMERIC_SCALES_SI_ = {"":1, n:1E-9, u:1E-6, m:0.001, k:1E3, K:1E3, M:1E6, G:1E9, T:1E12, P:1E15};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, n:Math.pow(1024, -3), u:Math.pow(1024, -2), m:1 / 1024, k:1024, K:1024, M:Math.pow(1024, 2), G:Math.pow(1024, 3), T:Math.pow(1024, 4), P:Math.pow(1024, 5)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(a) {
  return a <= goog.format.WbrToken_.SPACE || 4096 <= a && (8192 <= a && 8198 >= a || 8200 <= a && 8203 >= a || 5760 == a || 6158 == a || 8232 == a || 8233 == a || 8287 == a || 12288 == a)
};
goog.format.isInvisibleFormattingCharacter_ = function(a) {
  return 8204 <= a && 8207 >= a || 8234 <= a && 8238 >= a
};
goog.format.insertWordBreaksGeneric_ = function(a, b, c) {
  c = c || 10;
  if(c > a.length) {
    return a
  }
  for(var d = [], e = 0, f = 0, g = 0, h = 0, k = 0;k < a.length;k++) {
    var l = h, h = a.charCodeAt(k), l = h >= goog.format.FIRST_GRAPHEME_EXTEND_ && !b(l, h, !0);
    e >= c && (!goog.format.isTreatedAsBreakingSpace_(h) && !l) && (d.push(a.substring(g, k), goog.format.WORD_BREAK_HTML), g = k, e = 0);
    f ? h == goog.format.WbrToken_.GT && f == goog.format.WbrToken_.LT ? f = 0 : h == goog.format.WbrToken_.SEMI_COLON && f == goog.format.WbrToken_.AMP && (f = 0, e++) : h == goog.format.WbrToken_.LT || h == goog.format.WbrToken_.AMP ? f = h : goog.format.isTreatedAsBreakingSpace_(h) ? e = 0 : goog.format.isInvisibleFormattingCharacter_(h) || e++
  }
  d.push(a.substr(g));
  return d.join("")
};
goog.format.insertWordBreaks = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.i18n.GraphemeBreak.hasGraphemeBreak, b)
};
goog.format.conservativelyHasGraphemeBreak_ = function(a, b, c) {
  return 1024 <= b && 1315 > b
};
goog.format.insertWordBreaksBasic = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.format.conservativelyHasGraphemeBreak_, b)
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersionOrHigher(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.i18n.BidiFormatter = function(a, b) {
  this.contextDir_ = goog.i18n.bidi.toDir(a, !0);
  this.alwaysSpan_ = !!b
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(a) {
  this.contextDir_ = goog.i18n.bidi.toDir(a, !0)
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(a) {
  this.alwaysSpan_ = a
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(a, b) {
  return 0 > a * b
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(a, b, c, d) {
  return d && (this.areDirectionalitiesOpposite_(b, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(a, c) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(a, c)) ? this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM : ""
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(a, b) {
  return this.knownDirAttrValue(this.estimateDirection(a, b))
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(a) {
  return(a == goog.i18n.bidi.Dir.NEUTRAL ? this.contextDir_ : a) == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(a, b) {
  return this.knownDirAttr(this.estimateDirection(a, b))
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(a) {
  return a != this.contextDir_ ? a == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : a == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : "" : ""
};
goog.i18n.BidiFormatter.prototype.spanWrap = function(a, b, c) {
  return this.spanWrapWithKnownDir(null, a, b, c)
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(a, b, c, d) {
  null == a && (a = this.estimateDirection(b, c));
  return this.spanWrapWithKnownDir_(a, b, c, d)
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir_ = function(a, b, c, d) {
  d = d || void 0 == d;
  c || (b = goog.string.htmlEscape(b));
  c = [];
  var e = a != goog.i18n.bidi.Dir.NEUTRAL && a != this.contextDir_;
  this.alwaysSpan_ || e ? (c.push("<span"), e && c.push(a == goog.i18n.bidi.Dir.RTL ? ' dir="rtl"' : ' dir="ltr"'), c.push(">" + b + "</span>")) : c.push(b);
  c.push(this.dirResetIfNeeded_(b, a, !0, d));
  return c.join("")
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(a, b, c) {
  return this.unicodeWrapWithKnownDir(null, a, b, c)
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(a, b, c, d) {
  null == a && (a = this.estimateDirection(b, c));
  return this.unicodeWrapWithKnownDir_(a, b, c, d)
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir_ = function(a, b, c, d) {
  d = d || void 0 == d;
  var e = [];
  a != goog.i18n.bidi.Dir.NEUTRAL && a != this.contextDir_ ? (e.push(a == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE), e.push(b), e.push(goog.i18n.bidi.Format.PDF)) : e.push(b);
  e.push(this.dirResetIfNeeded_(b, a, c, d));
  return e.join("")
};
goog.i18n.BidiFormatter.prototype.markAfter = function(a, b) {
  return this.markAfterKnownDir(null, a, b)
};
goog.i18n.BidiFormatter.prototype.markAfterKnownDir = function(a, b, c) {
  null == a && (a = this.estimateDirection(b, c));
  return this.dirResetIfNeeded_(b, a, c, !0)
};
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch(this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
      return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
      return goog.i18n.bidi.Format.RLM;
    default:
      return""
  }
};
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT
};
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT
};
var soy = {esc:{}}, soydata = {VERY_UNSAFE:{}};
soy.StringBuilder = goog.string.StringBuffer;
soydata.SanitizedContentKind = goog.soy.data.SanitizedContentKind;
soydata.SanitizedHtml = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedContent);
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;
soydata.SanitizedJs = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedJs, goog.soy.data.SanitizedContent);
soydata.SanitizedJs.prototype.contentKind = soydata.SanitizedContentKind.JS;
soydata.SanitizedJsStrChars = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedJsStrChars, goog.soy.data.SanitizedContent);
soydata.SanitizedJsStrChars.prototype.contentKind = soydata.SanitizedContentKind.JS_STR_CHARS;
soydata.SanitizedUri = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedUri, goog.soy.data.SanitizedContent);
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;
soydata.SanitizedHtmlAttribute = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent);
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.ATTRIBUTES;
soydata.SanitizedCss = function() {
  goog.soy.data.SanitizedContent.call(this)
};
goog.inherits(soydata.SanitizedCss, goog.soy.data.SanitizedContent);
soydata.SanitizedCss.prototype.contentKind = soydata.SanitizedContentKind.CSS;
soydata.UnsanitizedText = function(a) {
  this.content = String(a)
};
goog.inherits(soydata.UnsanitizedText, goog.soy.data.SanitizedContent);
soydata.UnsanitizedText.prototype.contentKind = soydata.SanitizedContentKind.TEXT;
soydata.$$makeSanitizedContentFactory_ = function(a) {
  function b() {
  }
  b.prototype = a.prototype;
  return function(a) {
    var d = new b;
    d.content = String(a);
    return d
  }
};
soydata.markUnsanitizedText = function(a) {
  return new soydata.UnsanitizedText(a)
};
soydata.VERY_UNSAFE.ordainSanitizedHtml = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtml);
soydata.VERY_UNSAFE.ordainSanitizedJs = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJs);
soydata.VERY_UNSAFE.ordainSanitizedJsStrChars = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedJsStrChars);
soydata.VERY_UNSAFE.ordainSanitizedUri = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedUri);
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedHtmlAttribute);
soydata.VERY_UNSAFE.ordainSanitizedCss = soydata.$$makeSanitizedContentFactory_(soydata.SanitizedCss);
soy.renderElement = goog.soy.renderElement;
soy.renderAsFragment = function(a, b, c, d) {
  return goog.soy.renderAsFragment(a, b, d, new goog.dom.DomHelper(c))
};
soy.renderAsElement = function(a, b, c, d) {
  return goog.soy.renderAsElement(a, b, d, new goog.dom.DomHelper(c))
};
soy.$$augmentMap = function(a, b) {
  function c() {
  }
  c.prototype = a;
  var d = new c, e;
  for(e in b) {
    d[e] = b[e]
  }
  return d
};
soy.$$checkMapKey = function(a) {
  if("string" != typeof a) {
    throw Error("Map literal's key expression must evaluate to string (encountered type \"" + typeof a + '").');
  }
  return a
};
soy.$$getMapKeys = function(a) {
  var b = [], c;
  for(c in a) {
    b.push(c)
  }
  return b
};
soy.$$getDelTemplateId = function(a) {
  return a
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(a, b, c, d) {
  var e = "key_" + a + ":" + b, f = soy.$$DELEGATE_REGISTRY_PRIORITIES_[e];
  if(void 0 === f || c > f) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[e] = c, soy.$$DELEGATE_REGISTRY_FUNCTIONS_[e] = d
  }else {
    if(c == f) {
      throw Error('Encountered two active delegates with the same priority ("' + a + ":" + b + '").');
    }
  }
};
soy.$$getDelegateFn = function(a, b, c) {
  var d = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a + ":" + b];
  !d && "" != b && (d = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a + ":"]);
  if(d) {
    return d
  }
  if(c) {
    return soy.$$EMPTY_TEMPLATE_FN_
  }
  throw Error('Found no active impl for delegate call to "' + a + ":" + b + '" (and not allowemptydefault="true").');
};
soy.$$EMPTY_TEMPLATE_FN_ = function(a, b, c) {
  return""
};
soy.$$escapeHtml = function(a) {
  return a && a.contentKind && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtml), a.content) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$cleanHtml = function(a) {
  return a && a.contentKind && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtml), a.content) : soy.$$stripHtmlTags(a, soy.esc.$$SAFE_TAG_WHITELIST_)
};
soy.$$escapeHtmlRcdata = function(a) {
  return a && a.contentKind && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtml), soy.esc.$$normalizeHtmlHelper(a.content)) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$HTML5_VOID_ELEMENTS_ = /^<(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)\b/;
soy.$$stripHtmlTags = function(a, b) {
  if(!b) {
    return String(a).replace(soy.esc.$$HTML_TAG_REGEX_, "").replace(soy.esc.$$LT_REGEX_, "&lt;")
  }
  var c = String(a).replace(/\[/g, "&#91;"), d = [], c = c.replace(soy.esc.$$HTML_TAG_REGEX_, function(a, c) {
    if(c && (c = c.toLowerCase(), b.hasOwnProperty(c) && b[c])) {
      var e = "/" === a.charAt(1) ? "</" : "<", k = d.length;
      d[k] = e + c + ">";
      return"[" + k + "]"
    }
    return""
  }), c = soy.esc.$$normalizeHtmlHelper(c), e = soy.$$balanceTags_(d), c = c.replace(/\[(\d+)\]/g, function(a, b) {
    return d[b]
  });
  return c + e
};
soy.$$balanceTags_ = function(a) {
  for(var b = [], c = 0, d = a.length;c < d;++c) {
    var e = a[c];
    if("/" === e.charAt(1)) {
      for(var f = b.length - 1;0 <= f && b[f] != e;) {
        f--
      }
      0 > f ? a[c] = "" : (a[c] = b.slice(f).reverse().join(""), b.length = f)
    }else {
      soy.$$HTML5_VOID_ELEMENTS_.test(e) || b.push("</" + e.substring(1))
    }
  }
  return b.reverse().join("")
};
soy.$$escapeHtmlAttribute = function(a) {
  return a && a.contentKind && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtml), soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(a.content))) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$escapeHtmlAttributeNospace = function(a) {
  return a && a.contentKind && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtml), soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(a.content))) : soy.esc.$$escapeHtmlNospaceHelper(a)
};
soy.$$filterHtmlAttributes = function(a) {
  return a && a.contentKind === goog.soy.data.SanitizedContentKind.ATTRIBUTES ? (goog.asserts.assert(a.constructor === soydata.SanitizedHtmlAttribute), a.content.replace(/([^"'\s])$/, "$1 ")) : soy.esc.$$filterHtmlAttributesHelper(a)
};
soy.$$filterHtmlElementName = function(a) {
  return soy.esc.$$filterHtmlElementNameHelper(a)
};
soy.$$escapeJs = function(a) {
  return soy.$$escapeJsString(a)
};
soy.$$escapeJsString = function(a) {
  return a && a.contentKind === goog.soy.data.SanitizedContentKind.JS_STR_CHARS ? (goog.asserts.assert(a.constructor === soydata.SanitizedJsStrChars), a.content) : soy.esc.$$escapeJsStringHelper(a)
};
soy.$$escapeJsValue = function(a) {
  if(null == a) {
    return" null "
  }
  if(a.contentKind == goog.soy.data.SanitizedContentKind.JS) {
    return goog.asserts.assert(a.constructor === soydata.SanitizedJs), a.content
  }
  switch(typeof a) {
    case "boolean":
    ;
    case "number":
      return" " + a + " ";
    default:
      return"'" + soy.esc.$$escapeJsStringHelper(String(a)) + "'"
  }
};
soy.$$escapeJsRegex = function(a) {
  return soy.esc.$$escapeJsRegexHelper(a)
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(a) {
  return"%" + a.charCodeAt(0).toString(16)
};
soy.$$escapeUri = function(a) {
  if(a && a.contentKind === goog.soy.data.SanitizedContentKind.URI) {
    return goog.asserts.assert(a.constructor === soydata.SanitizedUri), soy.$$normalizeUri(a)
  }
  a = soy.esc.$$escapeUriHelper(a);
  soy.$$problematicUriMarks_.lastIndex = 0;
  return soy.$$problematicUriMarks_.test(a) ? a.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_) : a
};
soy.$$normalizeUri = function(a) {
  return soy.esc.$$normalizeUriHelper(a)
};
soy.$$filterNormalizeUri = function(a) {
  return a && a.contentKind == goog.soy.data.SanitizedContentKind.URI ? (goog.asserts.assert(a.constructor === soydata.SanitizedUri), soy.$$normalizeUri(a)) : soy.esc.$$filterNormalizeUriHelper(a)
};
soy.$$escapeCssString = function(a) {
  return soy.esc.$$escapeCssStringHelper(a)
};
soy.$$filterCssValue = function(a) {
  return a && a.contentKind === goog.soy.data.SanitizedContentKind.CSS ? (goog.asserts.assert(a.constructor === soydata.SanitizedCss), a.content) : null == a ? "" : soy.esc.$$filterCssValueHelper(a)
};
soy.$$filterNoAutoescape = function(a) {
  return a && a.contentKind === goog.soy.data.SanitizedContentKind.TEXT ? (goog.asserts.fail("Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`", [a.content]), "zSoyz") : String(a)
};
soy.$$changeNewlineToBr = function(a) {
  return goog.string.newLineToBr(String(a), !1)
};
soy.$$insertWordBreaks = function(a, b) {
  return goog.format.insertWordBreaks(String(a), b)
};
soy.$$truncate = function(a, b, c) {
  a = String(a);
  if(a.length <= b) {
    return a
  }
  c && (3 < b ? b -= 3 : c = !1);
  soy.$$isHighSurrogate_(a.charAt(b - 1)) && soy.$$isLowSurrogate_(a.charAt(b)) && (b -= 1);
  a = a.substring(0, b);
  c && (a += "...");
  return a
};
soy.$$isHighSurrogate_ = function(a) {
  return 55296 <= a && 56319 >= a
};
soy.$$isLowSurrogate_ = function(a) {
  return 56320 <= a && 57343 >= a
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(a) {
  return soy.$$bidiFormatterCache_[a] || (soy.$$bidiFormatterCache_[a] = new goog.i18n.BidiFormatter(a))
};
soy.$$bidiTextDir = function(a, b) {
  return!a ? 0 : goog.i18n.bidi.detectRtlDirectionality(a, b) ? -1 : 1
};
soy.$$bidiDirAttr = function(a, b, c) {
  return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(soy.$$getBidiFormatterInstance_(a).dirAttr(b, c))
};
soy.$$bidiMarkAfter = function(a, b, c) {
  return soy.$$getBidiFormatterInstance_(a).markAfter(b, c)
};
soy.$$bidiSpanWrap = function(a, b) {
  return soy.$$getBidiFormatterInstance_(a).spanWrap(b + "", !0)
};
soy.$$bidiUnicodeWrap = function(a, b) {
  return soy.$$getBidiFormatterInstance_(a).unicodeWrap(b + "", !0)
};
soy.esc.$$escapeUriHelper = function(a) {
  return goog.string.urlEncode(String(a))
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "<":"&lt;", ">":"&gt;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", "-":"&#45;", "/":"&#47;", "=":"&#61;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", "&":"\\x26", "'":"\\x27", "/":"\\/", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "\\":"\\\\", "\u0085":"\\x85", "\u2028":"\\u2028", "\u2029":"\\u2029", $:"\\x24", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", ":":"\\x3a", "?":"\\x3f", "[":"\\x5b", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", 
"|":"\\x7c", "}":"\\x7d"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", "\u001b":"%1B", "\u001c":"%1C", 
"\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", "\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", 
"\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[a]
};
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;
soy.esc.$$escapeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeJsStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeJsRegexHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeCssStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_)
};
soy.esc.$$filterCssValueHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterCssValue", [a]), "zSoyz") : a
};
soy.esc.$$normalizeUriHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterNormalizeUriHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [a]), "#zSoyz") : a.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterHtmlAttributesHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlAttributes", [a]), "zSoyz") : a
};
soy.esc.$$filterHtmlElementNameHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [a]), "zSoyz") : a
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
soy.esc.$$LT_REGEX_ = /</g;
soy.esc.$$SAFE_TAG_WHITELIST_ = {b:1, br:1, em:1, i:1, s:1, sub:1, sup:1, u:1};
lime.css = {};
lime.css.css = function(a, b) {
  return".lime-director {position:absolute; -webkit-transform-origin: 0 0; -moz-transform-origin: 0 0; -o-transform-origin: 0 0; image-rendering:  optimizeSpeed; overflow: hidden;}.lime-director div, .lime-director img, .lime-director canvas {-webkit-transform-origin: 0 0; -moz-transform-origin: 0 0; -o-transform-origin: 0 0; position: absolute; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; -moz-user-select: none; -webkit-user-select: none; -webkit-user-drag: none;}.lime-scene {position:absolute; width:100%; height:100%; left: 0px; top: 0px; overflow: hidden; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;}.lime-fps {float: left; background: #333; color: #fff; position: absolute; top:0px; left: 0px; padding:2px 4px;}div.lime-layer {position: absolute; left: 0px; top: 0px; width:0px; height:0px; border: none !important;}.lime-cover {position: absolute; left: 0px; top: 0px;}.lime-button {cursor: pointer;}"
};
lime.dom = {};
lime.dom.isDOMSupported = function() {
  return!0 === goog.global.CocoonJS_ENV ? !1 : !!document.head.parentNode
};
var old = goog.dom.getOwnerDocument;
goog.dom.getOwnerDocument = function() {
  return old.apply(goog.dom, arguments) || document
};
(function() {
  var a = [[], []], b = [[], []];
  lime.setObjectDirty = function(c, d, e) {
    goog.array.insert((e ? b : a)[d || 0], c)
  };
  lime.clearObjectDirty = function(a, b, e) {
  };
  lime.updateDirtyObjects = function() {
    for(var c, d = 0;2 > d;d++) {
      for(;a[d].length;) {
        c = a[d][0], c.update(d), c.dirty_ = 0, c == a[d][0] && a[d].shift()
      }
      a[d] = []
    }
    b = [[], []]
  }
})();
lime.Dirty = {POSITION:1, SCALE:2, CONTENT:4, FONT:8, ALPHA:16, VISIBILITY:32, LAYOUT:64, ROTATION:128, ALL:7};
lime.AutoResize = {NONE:0, LEFT:1, WIDTH:2, RIGHT:4, TOP:8, HEIGHT:16, BOTTOM:32, ALL:63};
lime.Transition = {POSITION:1, SCALE:2, SIZE:3, ROTATION:4, OPACITY:5};
lime.dom.isDOMSupported() && goog.style.installStyles(lime.css.css(null, null));
lime.Node = function() {
  goog.events.EventTarget.call(this);
  this.children_ = [];
  this.parent_ = null;
  this.transitionsAdd_ = {};
  this.transitionsActive_ = {};
  this.transitionsActiveSet_ = {};
  this.transitionsClear_ = {};
  this.allow3DCSSTransform_ = !0;
  this.inTree_ = !1;
  this.scene_ = this.director_ = null;
  this.eventHandlers_ = {};
  this.setScale(1);
  this.setPosition(0, 0);
  this.setSize(0, 0);
  this.setAnchorPoint(0.5, 0.5);
  this.setRotation(0);
  this.setAutoResize(lime.AutoResize.NONE);
  this.opacity_ = 1;
  this.setMask(null);
  this.setRenderer(this.supportedRenderers[0].getType());
  this.setDirty(lime.Dirty.LAYOUT);
  this.maskTarget_ = this.dependencySet_ = this.autoHide_ = this.hidden_ = this.relativeQuality_ = this.mRot = this.mY = this.mX = this.mSet = this.mPos = this.mHeight = this.mWidth = this.targetNode = this.isMask = this.activeMask_ = null
};
goog.inherits(lime.Node, goog.events.EventTarget);
lime.Node.prototype.supportedRenderers = [lime.Renderer.DOM, lime.Renderer.CANVAS];
lime.Node.prototype.setRenderer = function(a) {
  if(!this.renderer || this.renderer.getType() != a) {
    for(var b = -1, c = 0;c < this.supportedRenderers.length;c++) {
      if(this.supportedRenderers[c].getType() == a) {
        b = c;
        break
      }
    }
    if(-1 == b) {
      return this
    }
    this.renderer = this.supportedRenderers[c];
    this.setDirty(lime.Dirty.LAYOUT);
    for(c = 0;b = this.children_[c];c++) {
      b.setRenderer(a)
    }
  }
  return this
};
lime.Node.prototype.needsDomElement = function() {
  return!(this.parent_ && this.parent_.renderer.getType() == lime.Renderer.CANVAS)
};
lime.Node.prototype.getDeepestDomElement = function() {
  return this.getDeepestParentWithDom().domElement
};
lime.Node.prototype.getDeepestParentWithDom = function() {
  return this.needsDomElement() ? (this.updateDomElement(), this) : this.parent_ ? this.parent_.getDeepestParentWithDom() : null
};
lime.Node.prototype.getParentStack_ = function() {
  if(!this.parent_ || this instanceof lime.Scene) {
    return[]
  }
  var a = this.parent_.children_.indexOf(this), b = this.parent_.getParentStack_();
  b.push(a);
  return b
};
lime.Node.compareNode = function(a, b) {
  if(a == b) {
    return 0
  }
  for(var c = a.getParentStack_(), d = b.getParentStack_(), e = 0;;) {
    if(c.length <= e) {
      return 1
    }
    if(d.length <= e) {
      return-1
    }
    if(c[e] == d[e]) {
      e++
    }else {
      return c[e] > d[e] ? -1 : 1
    }
  }
};
lime.Node.prototype.getDirty = function() {
  return this.dirty_
};
lime.Node.prototype.setDirty = function(a, b, c) {
  a && !this.dirty_ && lime.setObjectDirty(this, b, c);
  var d = this.dirty_;
  this.dirty_ |= a;
  if(a == lime.Dirty.LAYOUT && !(d & lime.Dirty.LAYOUT)) {
    for(var d = 0, e;e = this.children_[d];d++) {
      e instanceof lime.Node && e.setDirty(lime.Dirty.LAYOUT)
    }
  }
  if(!goog.isDef(this.dirty_) || !a) {
    this.dirty_ = 0, lime.clearObjectDirty(this, b, c)
  }
  a && this.maskTarget_ && (this.mSet = !1, this.maskTarget_.setDirty(-1));
  return this
};
lime.Node.prototype.getScale = function() {
  return this.scale_
};
lime.Node.prototype.setScale = function(a, b) {
  1 == arguments.length && goog.isNumber(a) ? this.scale_ = new goog.math.Vec2(a, a) : this.scale_ = 2 == arguments.length ? new goog.math.Vec2(arguments[0], arguments[1]) : a;
  return this.transitionsActive_[lime.Transition.SCALE] ? this : this.setDirty(lime.Dirty.SCALE)
};
lime.Node.prototype.getPosition = function() {
  return this.position_
};
lime.Node.prototype.setPosition = function(a, b) {
  this.position_ = 2 == arguments.length ? new goog.math.Coordinate(arguments[0], arguments[1]) : a;
  return this.transitionsActive_[lime.Transition.POSITION] ? this : this.setDirty(lime.Dirty.POSITION)
};
lime.Node.prototype.getMask = function() {
  return this.mask_
};
lime.Node.prototype.setMask = function(a) {
  if(a == this.mask_) {
    return this
  }
  this.mask_ && (this.mask_.releaseDependencies(), delete this.mask_.maskTarget_);
  if(this.mask_ = a) {
    this.mask_.setupDependencies(), this.mask_.maskTarget_ = this
  }
  return this.setDirty(lime.Dirty.CONTENT)
};
lime.Node.prototype.getAnchorPoint = function() {
  return this.anchorPoint_
};
lime.Node.prototype.setAnchorPoint = function(a, b) {
  this.anchorPoint_ = 2 == arguments.length ? new goog.math.Vec2(arguments[0], arguments[1]) : a;
  return this.setDirty(lime.Dirty.POSITION)
};
lime.Node.prototype.getRotation = function() {
  return this.rotation_ %= 360
};
lime.Node.prototype.setRotation = function(a) {
  this.rotation_ = a;
  return this.transitionsActive_[lime.Transition.ROTATION] ? this : this.setDirty(lime.Dirty.POSITION)
};
lime.Node.prototype.getHidden = function() {
  return this.hidden_
};
lime.Node.prototype.setHidden = function(a) {
  this.hidden_ = a;
  this.setDirty(lime.Dirty.VISIBILITY);
  this.autoHide_ = 0;
  return this
};
lime.Node.prototype.getSize = function() {
  return this.size_
};
lime.Node.prototype.setSize = function(a, b) {
  var c = this.size_, d, e;
  d = 2 == arguments.length ? new goog.math.Size(arguments[0], arguments[1]) : a;
  var f = this.getAnchorPoint();
  if(c && this.children_.length) {
    for(var g = 0;g < this.children_.length;g++) {
      var h = this.children_[g];
      if(h.getAutoResize) {
        var k = h.getAutoResize();
        if(k != lime.AutoResize.NONE) {
          var l = h.getBoundingBox();
          e = c.width;
          var p = l.left + f.x * c.width, m = l.right - l.left, n = e - l.right - f.x * c.width;
          k & lime.AutoResize.LEFT && (e -= p);
          k & lime.AutoResize.WIDTH && (e -= m);
          k & lime.AutoResize.RIGHT && (e -= n);
          e != c.width && (e = (d.width - e) / (c.width - e), k & lime.AutoResize.LEFT && (p *= e), k & lime.AutoResize.WIDTH && (m *= e));
          e = c.height;
          var n = l.top + f.y * c.height, q = l.bottom - l.top, l = e - l.bottom - f.y * c.height;
          k & lime.AutoResize.TOP && (e -= n);
          k & lime.AutoResize.HEIGHT && (e -= q);
          k & lime.AutoResize.BOTTOM && (e -= l);
          e != c.height && (e = (d.height - e) / (c.height - e), k & lime.AutoResize.TOP && (n *= e), k & lime.AutoResize.HEIGHT && (q *= e));
          k = h.getAnchorPoint();
          h.setSize(m, q);
          h.setPosition(p + k.x * m - f.x * d.width, n + k.y * q - f.y * d.height)
        }
      }
    }
  }
  this.size_ = d;
  return this.setDirty(lime.Dirty.SCALE)
};
lime.Node.prototype.getAutoResize = function() {
  return this.autoResize_
};
lime.Node.prototype.setAutoResize = function(a) {
  this.autoResize_ = a;
  return this.setDirty(lime.Dirty.ALL)
};
lime.Node.prototype.setAllow3DCSSTransforms = function(a) {
  this.allow3DCSSTransform_ = a;
  return this
};
lime.Node.prototype.getCSS3DTransformsAllowed = function() {
  return this.allow3DCSSTransform_
};
lime.Node.prototype.screenToLocal = function(a) {
  if(!this.inTree_) {
    return a
  }
  a = this.getParent().screenToLocal(a);
  return this.parentToLocal(a)
};
lime.Node.prototype.parentToLocal = function(a) {
  if(!this.getParent()) {
    return null
  }
  a.x -= this.position_.x;
  a.y -= this.position_.y;
  a.x /= this.scale_.x;
  a.y /= this.scale_.y;
  if(0 != this.rotation_) {
    var b = a.clone(), c = this.rotation_ * Math.PI / 180, d = Math.cos(c), c = Math.sin(c);
    a.x = d * b.x - c * b.y;
    a.y = d * b.y + c * b.x
  }
  return a
};
lime.Node.prototype.localToScreen = function(a) {
  return!this.inTree_ ? a : this.getParent().localToScreen(this.localToParent(a))
};
lime.Node.prototype.localToParent = function(a) {
  if(!this.getParent()) {
    return a
  }
  var b = a.clone();
  if(0 != this.rotation_) {
    var c = -this.rotation_ * Math.PI / 180, d = Math.cos(c), c = Math.sin(c);
    b.x = d * a.x - c * a.y;
    b.y = d * a.y + c * a.x
  }
  b.x *= this.scale_.x;
  b.y *= this.scale_.y;
  b.x += this.position_.x;
  b.y += this.position_.y;
  return b
};
lime.Node.prototype.localToNode = function(a, b) {
  return!this.inTree_ ? a : b.screenToLocal(this.localToScreen(a))
};
lime.Node.prototype.getOpacity = function() {
  return this.opacity_
};
lime.Node.prototype.setOpacity = function(a) {
  this.opacity_ = a;
  a = this.getHidden();
  0 == this.opacity_ && !a ? (this.setHidden(!0), this.autoHide_ = 1) : 0 != this.opacity_ && (a && this.autoHide_) && this.setHidden(!1);
  if(goog.isDef(this.transitionsActive_[lime.Transition.OPACITY])) {
    return this
  }
  this.setDirty(lime.Dirty.ALPHA);
  return this
};
lime.Node.prototype.createDomElement = function() {
  var a = this.renderer.getType() == lime.Renderer.CANVAS ? "canvas" : "div", b = function() {
    this.domElement = this.rootElement = this.containerElement = goog.dom.createDom(a);
    this.domClassName && goog.dom.classes.add(this.domElement, this.domClassName);
    this.dirty_ |= -1
  };
  if(this.domElement) {
    if(this.domElement.tagName.toLowerCase() != a) {
      var c = this.rootElement;
      b.call(this);
      c.parentNode && c.parentNode.replaceChild(this.rootElement, c)
    }
  }else {
    b.call(this)
  }
};
lime.Node.prototype.updateDomElement = function() {
  this.needsDomElement() ? this.createDomElement() : this.removeDomElement()
};
lime.Node.prototype.removeDomElement = function() {
  this.rootElement && (goog.dom.removeNode(this.rootElement), delete this.domElement, delete this.rootElement, delete this.containerElement)
};
lime.Node.prototype.updateLayout = function() {
  this.dirty_ &= ~lime.Dirty.LAYOUT;
  this.updateDomElement();
  if(this.parent_ && this.parent_.dirty_ & lime.Dirty.LAYOUT) {
    this.parent_.updateLayout()
  }else {
    if(this.needsDomElement()) {
      for(var a = 0, b;b = this.children_[a];a++) {
        b instanceof lime.Node && b.updateLayout()
      }
      this.renderer.updateLayout.call(this)
    }
  }
};
lime.Node.prototype.update = function(a) {
  var b, c;
  a = a || 0;
  if(!this.inTree_) {
    return this.setDirty(0, a)
  }
  goog.getUid(this);
  this.dirty_ & lime.Dirty.LAYOUT && this.updateLayout();
  var d = this.renderer.getType() == lime.Renderer.DOM || a;
  if(d) {
    for(var e in this.transitionsClear_) {
      delete this.transitionsActive_[e], delete this.transitionsActiveSet_[e], b = lime.Node.getPropertyForTransition(parseInt(e, 10)), lime.style.clearTransition(this.domElement, b), this.domElement != this.containerElement && lime.style.clearTransition(this.continerElement, b)
    }
    b = 0;
    for(e in this.transitionsAdd_) {
      c = this.transitionsAdd_[e], c[3] || (c[3] = 1, e == lime.Transition.POSITION && this.positionDrawn_ != this.position_ && (this.setDirty(lime.Dirty.POSITION, 0, !0), b = 1), e == lime.Transition.SCALE && this.scaleDrawn_ != this.scale_ && (this.setDirty(lime.Dirty.SCALE, 0, !0), b = 1), e == lime.Transition.OPACITY && this.opacityDrawn_ != this.opacity_ && (this.setDirty(lime.Dirty.ALPHA, 0, !0), b = 1), e == lime.Transition.ROTATION && this.rotationDrawn_ != this.rotation_ && (this.setDirty(lime.Dirty.ROTATION, 
      0, !0), b = 1))
    }
    if(!b) {
      for(e in this.transitionsAdd_) {
        c = this.transitionsAdd_[e];
        b = lime.Node.getPropertyForTransition(parseInt(e, 10));
        if(this.renderer.getType() == lime.Renderer.DOM || "opacity" != b) {
          this.transitionsActive_[e] = c[0], lime.style.setTransition(this.domElement, b, c[1], c[2]), this.domElement != this.containerElement && b == lime.style.transformProperty && lime.style.setTransition(this.containerElement, b, c[1], c[2])
        }
        delete this.transitionsAdd_[e]
      }
    }
    this.positionDrawn_ = this.position_;
    this.scaleDrawn_ = this.scale_;
    this.opacityDrawn_ = this.opacity_;
    this.rotationDrawn_ = this.rotation_;
    this.transitionsClear_ = {}
  }
  a ? this.renderer.drawCanvas.call(this) : (this.renderer.getType() == lime.Renderer.CANVAS && (c = this.getDeepestParentWithDom(), c.redraw_ = 1, c == this && (this.dirty_ == lime.Dirty.POSITION && !this.mask_) && (c.redraw_ = 0), lime.setObjectDirty(this.getDeepestParentWithDom(), 1)), this.renderer.update.call(this));
  if(d) {
    for(e in this.transitionsActive_) {
      this.transitionsActive_[e] && (this.transitionsActiveSet_[e] = !0)
    }
  }
  if(this.dependencies_) {
    for(e = 0;e < this.dependencies_.length;e++) {
      this.dependencies_[e].setDirty(lime.Dirty.ALL)
    }
  }
  this.setDirty(0, a)
};
lime.Node.getPropertyForTransition = function(a) {
  return a == lime.Transition.OPACITY ? "opacity" : lime.style.transformProperty
};
lime.Node.prototype.getParent = function() {
  return this.parent_ || null
};
lime.Node.prototype.appendChild = function(a, b) {
  a instanceof lime.Node && a.getParent() ? a.getParent().removeChild(a) : a.parentNode && goog.dom.removeNode(a);
  a.parent_ = this;
  void 0 == b ? this.children_.push(a) : goog.array.insertAt(this.children_, a, b);
  this.renderer.getType() != lime.Renderer.DOM && a.setRenderer(this.renderer.getType());
  a instanceof lime.Node && (this.inTree_ && a.wasAddedToTree(), a.setDirty(lime.Dirty.LAYOUT));
  return this.setDirty(lime.Dirty.LAYOUT)
};
lime.Node.prototype.getNumberOfChildren = function() {
  return this.children_.length
};
lime.Node.prototype.getChildAt = function(a) {
  return 0 <= a && this.getNumberOfChildren() > a ? this.children_[a] : null
};
lime.Node.prototype.getChildIndex = function(a) {
  return this.children_.indexOf(a)
};
lime.Node.prototype.removeChild = function(a) {
  return this.removeChildAt(this.getChildIndex(a))
};
lime.Node.prototype.removeChildAt = function(a) {
  if(0 <= a && this.getNumberOfChildren() > a) {
    var b = this.getChildAt(a);
    b.maskTarget_ && b.maskTarget_.setMask(null);
    b instanceof lime.Node ? (this.inTree_ && b.wasRemovedFromTree(), b.removeDomElement(), b.parent_ = null) : goog.dom.removeNode(b);
    this.children_.splice(a, 1);
    return this.setDirty(lime.Dirty.LAYOUT)
  }
  return this
};
lime.Node.prototype.removeAllChildren = function() {
  for(;this.getNumberOfChildren();) {
    this.removeChildAt(0)
  }
  return this
};
lime.Node.prototype.setChildIndex = function(a, b) {
  var c = this.getChildIndex(a);
  return-1 != c && c != b ? (this.children_.splice(c, 1), goog.array.insertAt(this.children_, a, b), this.getDirector() && this.getDirector().eventDispatcher.updateDispatchOrder(a), this.setDirty(lime.Dirty.LAYOUT)) : this
};
lime.Node.prototype.listen = function(a, b, c, d) {
  goog.events.EventTarget.prototype.listen.apply(this, arguments);
  lime.userAgent.SUPPORTS_TOUCH && "mouse" == a.substring(0, 5) || (goog.isDef(this.eventHandlers_[a]) || (this.eventHandlers_[a] = [0, 0]), this.inTree_ && 0 == this.eventHandlers_[a][0] && (this.eventHandlers_[a][0] = 1, this.getDirector().eventDispatcher.register(this, a)), this.eventHandlers_[a][1]++)
};
lime.Node.prototype.unlisten = function(a, b, c, d) {
  goog.events.EventTarget.prototype.unlisten.apply(this, arguments);
  lime.userAgent.SUPPORTS_TOUCH && "mouse" == a.substring(0, 5) || (this.inTree_ && 1 == this.eventHandlers_[a][1] && (this.eventHandlers_[a][0] = 0, this.getDirector().eventDispatcher.release(this, a)), this.eventHandlers_[a][1]--, this.eventHandlers_[a][1] || delete this.eventHandlers_[a])
};
lime.Node.prototype.getDirector = function() {
  return!this.inTree_ ? null : this.director_
};
lime.Node.prototype.getScene = function() {
  return!this.inTree_ ? null : this.scene_
};
lime.Node.prototype.wasRemovedFromTree = function() {
  var a;
  this.dependencySet_ || this.removeDependency(this.getParent());
  for(var b = 0;a = this.children_[b];b++) {
    a instanceof lime.Node && a.wasRemovedFromTree()
  }
  for(var c in this.eventHandlers_) {
    this.eventHandlers_[c][0] = 0;
    if(!this.getDirector()) {
      debugger
    }
    this.getDirector().eventDispatcher.release(this, c)
  }
  this.getDirector().eventDispatcher.updateDispatchOrder(this);
  this.inTree_ = !1;
  this.scene_ = this.director_ = null
};
lime.Node.prototype.wasAddedToTree = function() {
  this.inTree_ = !0;
  this.director_ = this.parent_.getDirector();
  this.scene_ = this.parent_.getScene();
  for(var a = 0, b;b = this.children_[a];a++) {
    b instanceof lime.Node && b.wasAddedToTree()
  }
  for(var c in this.eventHandlers_) {
    this.eventHandlers_[c][0] = 1, this.getDirector().eventDispatcher.register(this, c)
  }
  this.dependencySet_ && this.setupDependencies();
  this.getDirector().eventDispatcher.updateDispatchOrder(this)
};
lime.Node.prototype.setupDependencies = function() {
  this.dependencySet_ = !0;
  this.inTree_ && this.addDependency(this.getParent())
};
lime.Node.prototype.addDependency = function(a) {
  a.dependencies_ || (a.dependencies_ = []);
  goog.array.insert(a.dependencies_, this);
  !a && !(a.getParent() instanceof lime.Scene) && this.addDependency(a.getParent())
};
lime.Node.prototype.removeDependency = function(a) {
  a && a.dependencies_ && (goog.array.remove(a.dependencies_, this), this.removeDependency(a.getParent()))
};
lime.Node.prototype.releaseDependencies = function() {
  delete this.dependencySet_;
  this.removeDependency(this.getParent())
};
lime.Node.prototype.getFrame = function() {
  var a = this.getSize(), b = this.getAnchorPoint();
  return new goog.math.Box(-a.height * b.y, a.width * (1 - b.x), a.height * (1 - b.y), -a.width * b.x)
};
lime.Node.prototype.getBoundingBox = function(a) {
  var b = a || this.getFrame();
  a = new goog.math.Coordinate(b.left, b.top);
  var c = new goog.math.Coordinate(b.right, b.top), d = new goog.math.Coordinate(b.left, b.bottom), b = new goog.math.Coordinate(b.right, b.bottom);
  a = this.localToParent(a);
  c = this.localToParent(c);
  d = this.localToParent(d);
  b = this.localToParent(b);
  return new goog.math.Box(Math.floor(Math.min(a.y, c.y, d.y, b.y)), Math.ceil(Math.max(a.x, c.x, d.x, b.x)), Math.ceil(Math.max(a.y, c.y, d.y, b.y)), Math.floor(Math.min(a.x, c.x, d.x, b.x)))
};
lime.Node.prototype.measureContents = function() {
  var a = this.getFrame();
  a.left == a.right && this.children_.length && (a = this.children_[0].getBoundingBox(this.children_[0].measureContents()));
  for(var b = 0, c;c = this.children_[b];b++) {
    1 != c.isMask && a.expandToInclude(c.getBoundingBox(c.measureContents()))
  }
  return a
};
lime.Node.prototype.addTransition = function(a, b, c, d) {
  this.transitionsAdd_[a] = [b, c, d, 0]
};
lime.Node.prototype.clearTransition = function(a) {
  this.transitionsClear_[a] = 1
};
lime.Node.prototype.hitTest = function(a) {
  var b = this.screenToLocal(a.screenPosition);
  return this.getFrame().contains(b) ? (a.position = b, !0) : !1
};
lime.Node.prototype.runAction = function(a) {
  a.addTarget(this);
  a.play()
};
function throwDeprecated(a) {
  throw Error("Function " + a + " Deprecated");
}
;lime.Layer = function() {
  lime.Node.call(this);
  this.domClassName = "lime-layer"
};
goog.inherits(lime.Layer, lime.Node);
lime.Layer.prototype.hitTest = function(a) {
  for(var b = 0, c;c = this.children_[b];b++) {
    if(c.hitTest(a)) {
      return a.position = this.screenToLocal(a.screenPosition), !0
    }
  }
  return!1
};
goog.fx = {};
goog.fx.easing = {};
goog.fx.easing.easeIn = function(a) {
  return goog.fx.easing.easeInInternal_(a, 3)
};
goog.fx.easing.easeInInternal_ = function(a, b) {
  return Math.pow(a, b)
};
goog.fx.easing.easeOut = function(a) {
  return goog.fx.easing.easeOutInternal_(a, 3)
};
goog.fx.easing.easeOutInternal_ = function(a, b) {
  return 1 - goog.fx.easing.easeInInternal_(1 - a, b)
};
goog.fx.easing.easeOutLong = function(a) {
  return goog.fx.easing.easeOutInternal_(a, 4)
};
goog.fx.easing.inAndOut = function(a) {
  return 3 * a * a - 2 * a * a * a
};
lime.scheduleManager = new function() {
  this.taskStack_ = [];
  this.active_ = !1;
  this.intervalID_ = 0;
  this.displayRate_ = 1E3 / 30;
  this.lastRunTime_ = 0;
  this.animationFrameHandlerBinded_ = null
};
lime.scheduleManager.Task = function(a, b) {
  this.delta = this.maxdelta = a;
  this.limit = goog.isDef(b) ? b : -1;
  this.functionStack_ = []
};
lime.scheduleManager.Task.prototype.step_ = function(a) {
  if(this.functionStack_.length) {
    if(this.delta > a) {
      this.delta -= a
    }else {
      var b = this.maxdelta + a - this.delta;
      this.delta = this.maxdelta - (a - this.delta);
      0 > this.delta && (this.delta = 0);
      var c;
      for(a = this.functionStack_.length;0 <= --a;) {
        (c = this.functionStack_[a]) && (c[0] && goog.isFunction(c[1])) && c[1].call(c[2], b)
      }
      -1 != this.limit && (this.limit--, 0 == this.limit && lime.scheduleManager.unschedule(c[1], c[2]))
    }
  }
};
lime.scheduleManager.taskStack_.push(new lime.scheduleManager.Task(0));
(function() {
  for(var a = ["webkit", "moz"], b = 0;b < a.length && !goog.global.requestAnimationFrame;++b) {
    goog.global.requestAnimationFrame = window[a[b] + "RequestAnimationFrame"], goog.global.cancelAnimationFrame = goog.global[a[b] + "CancelAnimationFrame"] || goog.global[a[b] + "CancelRequestAnimationFrame"]
  }
})();
lime.scheduleManager.USE_ANIMATION_FRAME = !!goog.global.requestAnimationFrame;
lime.scheduleManager.getDisplayRate = function() {
  return this.displayRate_
};
lime.scheduleManager.setDisplayRate = function(a) {
  this.displayRate_ = a;
  this.active_ && (lime.scheduleManager.disable_(), lime.scheduleManager.activate_())
};
lime.scheduleManager.schedule = function(a, b, c) {
  c = goog.isDef(c) ? c : this.taskStack_[0];
  goog.array.insert(c.functionStack_, [1, a, b]);
  goog.array.insert(this.taskStack_, c);
  this.active_ || lime.scheduleManager.activate_()
};
lime.scheduleManager.unschedule = function(a, b) {
  for(var c = this.taskStack_.length;0 <= --c;) {
    for(var d = this.taskStack_[c], e = d.functionStack_, f, g = e.length;0 <= --g;) {
      f = e[g], f[1] == a && f[2] == b && goog.array.remove(e, f)
    }
    0 == e.length && 0 != c && goog.array.remove(this.taskStack_, d)
  }
  1 == this.taskStack_.length && 0 == this.taskStack_[0].functionStack_.length && lime.scheduleManager.disable_()
};
lime.scheduleManager.activate_ = function() {
  this.active_ || (this.lastRunTime_ = goog.now(), lime.scheduleManager.USE_ANIMATION_FRAME && goog.global.requestAnimationFrame ? goog.global.mozRequestAnimationFrame && 11 > goog.userAgent.VERSION ? (goog.global.mozRequestAnimationFrame(), this.beforePaintHandlerBinded_ = goog.bind(lime.scheduleManager.beforePaintHandler_, this), goog.global.addEventListener("MozBeforePaint", this.beforePaintHandlerBinded_, !1)) : (this.animationFrameHandlerBinded_ = goog.bind(lime.scheduleManager.animationFrameHandler_, 
  this), goog.global.requestAnimationFrame(this.animationFrameHandlerBinded_)) : this.intervalID_ = setInterval(goog.bind(lime.scheduleManager.stepTimer_, this), lime.scheduleManager.getDisplayRate()), this.active_ = !0)
};
lime.scheduleManager.disable_ = function() {
  this.active_ && (lime.scheduleManager.USE_ANIMATION_FRAME && goog.global.requestAnimationFrame ? goog.global.mozRequestAnimationFrame && 11 > goog.userAgent.VERSION ? goog.global.removeEventListener("MozBeforePaint", this.beforePaintHandlerBinded_, !1) : goog.global.cancelAnimationFrame(this.animationFrameHandlerBinded_) : clearInterval(this.intervalID_), this.active_ = !1)
};
lime.scheduleManager.animationFrameHandler_ = function(a) {
  var b = goog.global.performance, c;
  b && b.timing && (c = b.now || b.webkitNow) ? a = b.timing.navigationStart + c.call(b) : a || (a = goog.now());
  b = a - this.lastRunTime_;
  0 > b && (b = 1);
  lime.scheduleManager.dispatch_(b);
  this.lastRunTime_ = a;
  goog.global.requestAnimationFrame(this.animationFrameHandlerBinded_)
};
lime.scheduleManager.beforePaintHandler_ = function(a) {
  lime.scheduleManager.dispatch_(a.timeStamp - this.lastRunTime_);
  this.lastRunTime_ = a.timeStamp;
  goog.global.mozRequestAnimationFrame()
};
lime.scheduleManager.stepTimer_ = function() {
  var a = goog.now(), b = a - this.lastRunTime_;
  0 > b && (b = 1);
  lime.scheduleManager.dispatch_(b);
  this.lastRunTime_ = a
};
lime.scheduleManager.dispatch_ = function(a) {
  for(var b = this.taskStack_.slice(), c = b.length;0 <= --c;) {
    b[c].step_(a)
  }
  1 == lime.transformSet_ && (/Firefox\/18./.test(goog.userAgent.getUserAgentString()) && !lime.FF4_USE_HW_ACCELERATION) && (lime.scheduleManager.odd_ ? (document.body.style.MozTransform = "", lime.scheduleManager.odd_ = 0) : (document.body.style.MozTransform = "scale(1,1)", lime.scheduleManager.odd_ = 1), lime.transformSet_ = 0)
};
lime.scheduleManager.changeDirectorActivity = function(a, b) {
  for(var c, d, e, f, g = this.taskStack_.length;0 <= --g;) {
    c = this.taskStack_[g];
    for(f = c.functionStack_.length;0 <= --f;) {
      e = c.functionStack_[f], d = e[2], goog.isFunction(d.getDirector) && (d = d.getDirector(), d == a && (e[0] = b))
    }
  }
};
lime.scheduleManager.callAfter = function(a, b, c) {
  lime.scheduleManager.scheduleWithDelay(a, b, c, 1)
};
lime.scheduleManager.scheduleWithDelay = function(a, b, c, d) {
  c = new lime.scheduleManager.Task(c, d);
  lime.scheduleManager.schedule(a, b, c)
};
lime.animation = {};
lime.animation.Animation = function() {
  goog.events.EventTarget.call(this);
  this.targets = [];
  this.initTargets_ = [];
  this.targetProp_ = {};
  this.isPlaying_ = !1;
  this.duration_ = 1;
  this.ease = lime.animation.Easing.EASEINOUT;
  this.status_ = 0;
  this.optimizations_ = null;
  this.playTime_ = 0;
  this.firstFrame_ = 1;
  this.dt_ = 0;
  goog.getUid(this)
};
goog.inherits(lime.animation.Animation, goog.events.EventTarget);
lime.animation.Animation.prototype.scope = "";
lime.animation.Event = {START:"start", STOP:"stop"};
lime.animation.Animation.prototype.getDuration = function() {
  return this.duration_
};
lime.animation.Animation.prototype.setDuration = function(a) {
  this.duration_ = a;
  return this
};
lime.animation.Animation.prototype.setEasing = function(a) {
  this.ease = a;
  return this
};
lime.animation.Animation.prototype.getEasing = function() {
  return this.ease
};
lime.animation.Animation.prototype.addTarget = function(a) {
  goog.array.insert(this.targets, a);
  return this
};
lime.animation.Animation.prototype.removeTarget = function(a) {
  goog.array.remove(this.targets, a);
  goog.array.remove(this.initTargets_, a);
  return this
};
lime.animation.Animation.prototype.play = function() {
  this.playTime_ = 0;
  this.firstFrame_ = this.status_ = 1;
  lime.scheduleManager.schedule(this.step_, this);
  this.dispatchEvent({type:lime.animation.Event.START})
};
lime.animation.Animation.prototype.stop = function() {
  if(0 != this.status_) {
    var a = this.initTargets_;
    if(this.useTransitions() && this.clearTransition) {
      for(var b = a.length;0 <= --b;) {
        this.clearTransition(a[b])
      }
    }
    this.initTargets_ = [];
    this.targetProp_ = {};
    this.status_ = 0;
    lime.scheduleManager.unschedule(this.step_, this);
    this.dispatchEvent({type:lime.animation.Event.STOP})
  }
};
lime.animation.Animation.prototype.makeTargetProp = function(a) {
  return{}
};
lime.animation.Animation.prototype.getTargetProp = function(a) {
  var b = goog.getUid(a);
  goog.isDef(this.targetProp_[b]) || (this.initTarget(a), this.targetProp_[b] = this.makeTargetProp(a));
  return this.targetProp_[b]
};
lime.animation.Animation.prototype.initTarget = function(a) {
  lime.animation.actionManager.register(this, a);
  this.status_ = 1;
  goog.array.insert(this.initTargets_, a);
  this.speed_ && (!this.speedCalcDone_ && this.calcDurationFromSpeed_) && this.calcDurationFromSpeed_()
};
lime.animation.Animation.prototype.getDirector = function() {
  return this.targets[0] ? this.targets[0].getDirector() : null
};
lime.animation.Animation.prototype.step_ = function(a) {
  this.speed_ && (!this.speedCalcDone_ && this.calcDurationFromSpeed_) && this.calcDurationFromSpeed_();
  this.firstFrame_ && (delete this.firstFrame_, a = 1);
  this.playTime_ += a;
  this.dt_ = a;
  a = this.playTime_ / (1E3 * this.duration_);
  if(isNaN(a) || 1 <= a) {
    a = 1
  }
  a = this.updateAll(a, this.targets);
  1 == a && this.stop()
};
lime.animation.Animation.prototype.updateAll = function(a, b) {
  a = this.getEasing()[0](a);
  isNaN(a) && (a = 1);
  for(var c = b.length;0 <= --c;) {
    this.update(a, b[c])
  }
  return a
};
lime.animation.Animation.prototype.useTransitions = function() {
  return lime.userAgent.IOS && 0 < this.duration_ && lime.style.isTransitionsSupported && this.optimizations_
};
lime.animation.Animation.prototype.enableOptimizations = function(a) {
  this.optimizations_ = goog.isDef(a) ? a : !0;
  return this
};
lime.animation.Animation.prototype.cloneParam = function(a) {
  return this.setDuration(a.getDuration()).enableOptimizations(a.optimizations_)
};
lime.animation.Animation.prototype.reverse = function() {
  throw"Reverseform not supported for this animation";
};
lime.animation.actionManager = new function() {
  this.actions = {}
};
lime.animation.actionManager.register = function(a, b) {
  if(a.scope.length) {
    var c = goog.getUid(b);
    goog.isDef(this.actions[c]) || (this.actions[c] = {});
    goog.isDef(this.actions[c][a.scope]) && this.actions[c][a.scope].stop();
    this.actions[c][a.scope] = a
  }
};
lime.animation.actionManager.stopAll = function(a) {
  a = goog.getUid(a);
  if(goog.isDef(this.actions[a])) {
    for(var b in this.actions[a]) {
      this.actions[a][b].stop(), delete this.actions[a][b]
    }
    delete this.actions[a]
  }
};
(function() {
  function a(a, e) {
    var f, g, m, n;
    m = a;
    for(g = 0;8 > g;g++) {
      n = ((b * m + c) * m + d) * m - a;
      if((0 <= n ? n : 0 - n) < e) {
        return m
      }
      f = (3 * b * m + 2 * c) * m + d;
      if(1E-6 > (0 <= f ? f : 0 - f)) {
        break
      }
      m -= n / f
    }
    f = 0;
    g = 1;
    m = a;
    if(m < f) {
      return f
    }
    if(m > g) {
      return g
    }
    for(;f < g;) {
      n = ((b * m + c) * m + d) * m;
      if((0 <= n - a ? n - a : 0 - (n - a)) < e) {
        break
      }
      a > n ? f = m : g = m;
      m = 0.5 * (g - f) + f
    }
    return m
  }
  var b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
  lime.animation.getEasingFunction = function(h, k, l, p) {
    return[function(m) {
      d = 3 * h;
      c = 3 * (l - h) - d;
      b = 1 - d - c;
      g = 3 * k;
      f = 3 * (p - k) - g;
      e = 1 - g - f;
      m = a(m, 5E-5);
      return((e * m + f) * m + g) * m
    }, h, k, l, p]
  }
})();
lime.animation.Easing = {EASE:lime.animation.getEasingFunction(0.25, 0.1, 0.25, 1), LINEAR:[function(a) {
  return a
}, 0, 0, 1, 1], EASEIN:lime.animation.getEasingFunction(0.42, 0, 1, 1), EASEOUT:lime.animation.getEasingFunction(0, 0, 0.58, 1), EASEINOUT:lime.animation.getEasingFunction(0.42, 0, 0.58, 1)};
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b", 
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", 
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3", 
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", 
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6", 
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5", 
yellow:"#ffff00", yellowgreen:"#9acd32"};
goog.color.parse = function(a) {
  var b = {};
  a = String(a);
  var c = goog.color.prependHashIfNecessaryHelper(a);
  if(goog.color.isValidHexColor_(c)) {
    return b.hex = goog.color.normalizeHex(c), b.type = "hex", b
  }
  c = goog.color.isValidRgbColor_(a);
  if(c.length) {
    return b.hex = goog.color.rgbArrayToHex(c), b.type = "rgb", b
  }
  if(goog.color.names && (c = goog.color.names[a.toLowerCase()])) {
    return b.hex = c, b.type = "named", b
  }
  throw Error(a + " is not a valid color string");
};
goog.color.isValidColor = function(a) {
  var b = goog.color.prependHashIfNecessaryHelper(a);
  return!(!goog.color.isValidHexColor_(b) && !(goog.color.isValidRgbColor_(a).length || goog.color.names && goog.color.names[a.toLowerCase()]))
};
goog.color.parseRgb = function(a) {
  var b = goog.color.isValidRgbColor_(a);
  if(!b.length) {
    throw Error(a + " is not a valid RGB color");
  }
  return b
};
goog.color.hexToRgbStyle = function(a) {
  return goog.color.rgbStyle_(goog.color.hexToRgb(a))
};
goog.color.hexTripletRe_ = /#(.)(.)(.)/;
goog.color.normalizeHex = function(a) {
  if(!goog.color.isValidHexColor_(a)) {
    throw Error("'" + a + "' is not a valid hex color");
  }
  4 == a.length && (a = a.replace(goog.color.hexTripletRe_, "#$1$1$2$2$3$3"));
  return a.toLowerCase()
};
goog.color.hexToRgb = function(a) {
  a = goog.color.normalizeHex(a);
  var b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16);
  a = parseInt(a.substr(5, 2), 16);
  return[b, c, a]
};
goog.color.rgbToHex = function(a, b, c) {
  a = Number(a);
  b = Number(b);
  c = Number(c);
  if(isNaN(a) || 0 > a || 255 < a || isNaN(b) || 0 > b || 255 < b || isNaN(c) || 0 > c || 255 < c) {
    throw Error('"(' + a + "," + b + "," + c + '") is not a valid RGB color');
  }
  a = goog.color.prependZeroIfNecessaryHelper(a.toString(16));
  b = goog.color.prependZeroIfNecessaryHelper(b.toString(16));
  c = goog.color.prependZeroIfNecessaryHelper(c.toString(16));
  return"#" + a + b + c
};
goog.color.rgbArrayToHex = function(a) {
  return goog.color.rgbToHex(a[0], a[1], a[2])
};
goog.color.rgbToHsl = function(a, b, c) {
  a /= 255;
  b /= 255;
  c /= 255;
  var d = Math.max(a, b, c), e = Math.min(a, b, c), f = 0, g = 0, h = 0.5 * (d + e);
  d != e && (d == a ? f = 60 * (b - c) / (d - e) : d == b ? f = 60 * (c - a) / (d - e) + 120 : d == c && (f = 60 * (a - b) / (d - e) + 240), g = 0 < h && 0.5 >= h ? (d - e) / (2 * h) : (d - e) / (2 - 2 * h));
  return[Math.round(f + 360) % 360, g, h]
};
goog.color.rgbArrayToHsl = function(a) {
  return goog.color.rgbToHsl(a[0], a[1], a[2])
};
goog.color.hueToRgb_ = function(a, b, c) {
  0 > c ? c += 1 : 1 < c && (c -= 1);
  return 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + 6 * (b - a) * (2 / 3 - c) : a
};
goog.color.hslToRgb = function(a, b, c) {
  var d = 0, e = 0, f = 0;
  a /= 360;
  if(0 == b) {
    d = e = f = 255 * c
  }else {
    var g = f = 0, g = 0.5 > c ? c * (1 + b) : c + b - b * c, f = 2 * c - g, d = 255 * goog.color.hueToRgb_(f, g, a + 1 / 3), e = 255 * goog.color.hueToRgb_(f, g, a), f = 255 * goog.color.hueToRgb_(f, g, a - 1 / 3)
  }
  return[Math.round(d), Math.round(e), Math.round(f)]
};
goog.color.hslArrayToRgb = function(a) {
  return goog.color.hslToRgb(a[0], a[1], a[2])
};
goog.color.validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
goog.color.isValidHexColor_ = function(a) {
  return goog.color.validHexColorRe_.test(a)
};
goog.color.normalizedHexColorRe_ = /^#[0-9a-f]{6}$/;
goog.color.isNormalizedHexColor_ = function(a) {
  return goog.color.normalizedHexColorRe_.test(a)
};
goog.color.rgbColorRe_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
goog.color.isValidRgbColor_ = function(a) {
  var b = a.match(goog.color.rgbColorRe_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), b = Number(b[3]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b) {
      return[a, c, b]
    }
  }
  return[]
};
goog.color.prependZeroIfNecessaryHelper = function(a) {
  return 1 == a.length ? "0" + a : a
};
goog.color.prependHashIfNecessaryHelper = function(a) {
  return"#" == a.charAt(0) ? a : "#" + a
};
goog.color.rgbStyle_ = function(a) {
  return"rgb(" + a.join(",") + ")"
};
goog.color.hsvToRgb = function(a, b, c) {
  var d = 0, e = 0, f = 0;
  if(0 == b) {
    f = e = d = c
  }else {
    var g = Math.floor(a / 60), h = a / 60 - g;
    a = c * (1 - b);
    var k = c * (1 - b * h);
    b = c * (1 - b * (1 - h));
    switch(g) {
      case 1:
        d = k;
        e = c;
        f = a;
        break;
      case 2:
        d = a;
        e = c;
        f = b;
        break;
      case 3:
        d = a;
        e = k;
        f = c;
        break;
      case 4:
        d = b;
        e = a;
        f = c;
        break;
      case 5:
        d = c;
        e = a;
        f = k;
        break;
      case 6:
      ;
      case 0:
        d = c, e = b, f = a
    }
  }
  return[Math.floor(d), Math.floor(e), Math.floor(f)]
};
goog.color.rgbToHsv = function(a, b, c) {
  var d = Math.max(Math.max(a, b), c), e = Math.min(Math.min(a, b), c);
  if(e == d) {
    e = a = 0
  }else {
    var f = d - e, e = f / d;
    a = 60 * (a == d ? (b - c) / f : b == d ? 2 + (c - a) / f : 4 + (a - b) / f);
    0 > a && (a += 360);
    360 < a && (a -= 360)
  }
  return[a, e, d]
};
goog.color.rgbArrayToHsv = function(a) {
  return goog.color.rgbToHsv(a[0], a[1], a[2])
};
goog.color.hsvArrayToRgb = function(a) {
  return goog.color.hsvToRgb(a[0], a[1], a[2])
};
goog.color.hexToHsl = function(a) {
  a = goog.color.hexToRgb(a);
  return goog.color.rgbToHsl(a[0], a[1], a[2])
};
goog.color.hslToHex = function(a, b, c) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(a, b, c))
};
goog.color.hslArrayToHex = function(a) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(a[0], a[1], a[2]))
};
goog.color.hexToHsv = function(a) {
  return goog.color.rgbArrayToHsv(goog.color.hexToRgb(a))
};
goog.color.hsvToHex = function(a, b, c) {
  return goog.color.rgbArrayToHex(goog.color.hsvToRgb(a, b, c))
};
goog.color.hsvArrayToHex = function(a) {
  return goog.color.hsvToHex(a[0], a[1], a[2])
};
goog.color.hslDistance = function(a, b) {
  var c, d;
  c = 0.5 >= a[2] ? a[1] * a[2] : a[1] * (1 - a[2]);
  d = 0.5 >= b[2] ? b[1] * b[2] : b[1] * (1 - b[2]);
  return(a[2] - b[2]) * (a[2] - b[2]) + c * c + d * d - 2 * c * d * Math.cos(2 * (a[0] / 360 - b[0] / 360) * Math.PI)
};
goog.color.blend = function(a, b, c) {
  c = goog.math.clamp(c, 0, 1);
  return[Math.round(c * a[0] + (1 - c) * b[0]), Math.round(c * a[1] + (1 - c) * b[1]), Math.round(c * a[2] + (1 - c) * b[2])]
};
goog.color.darken = function(a, b) {
  return goog.color.blend([0, 0, 0], a, b)
};
goog.color.lighten = function(a, b) {
  return goog.color.blend([255, 255, 255], a, b)
};
goog.color.highContrast = function(a, b) {
  for(var c = [], d = 0;d < b.length;d++) {
    c.push({color:b[d], diff:goog.color.yiqBrightnessDiff_(b[d], a) + goog.color.colorDiff_(b[d], a)})
  }
  c.sort(function(a, b) {
    return b.diff - a.diff
  });
  return c[0].color
};
goog.color.yiqBrightness_ = function(a) {
  return Math.round((299 * a[0] + 587 * a[1] + 114 * a[2]) / 1E3)
};
goog.color.yiqBrightnessDiff_ = function(a, b) {
  return Math.abs(goog.color.yiqBrightness_(a) - goog.color.yiqBrightness_(b))
};
goog.color.colorDiff_ = function(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
};
goog.color.alpha = {};
goog.color.alpha.parse = function(a) {
  var b = {};
  a = String(a);
  var c = goog.color.prependHashIfNecessaryHelper(a);
  if(goog.color.alpha.isValidAlphaHexColor_(c)) {
    return b.hex = goog.color.alpha.normalizeAlphaHex_(c), b.type = "hex", b
  }
  c = goog.color.alpha.isValidRgbaColor_(a);
  if(c.length) {
    return b.hex = goog.color.alpha.rgbaArrayToHex(c), b.type = "rgba", b
  }
  c = goog.color.alpha.isValidHslaColor_(a);
  if(c.length) {
    return b.hex = goog.color.alpha.hslaArrayToHex(c), b.type = "hsla", b
  }
  throw Error(a + " is not a valid color string");
};
goog.color.alpha.hexToRgbaStyle = function(a) {
  return goog.color.alpha.rgbaStyle_(goog.color.alpha.hexToRgba(a))
};
goog.color.alpha.extractHexColor = function(a) {
  if(goog.color.alpha.isValidAlphaHexColor_(a)) {
    return a = goog.color.prependHashIfNecessaryHelper(a), goog.color.alpha.normalizeAlphaHex_(a).substring(0, 7)
  }
  throw Error(a + " is not a valid 8-hex color string");
};
goog.color.alpha.extractAlpha = function(a) {
  if(goog.color.alpha.isValidAlphaHexColor_(a)) {
    return a = goog.color.prependHashIfNecessaryHelper(a), goog.color.alpha.normalizeAlphaHex_(a).substring(7, 9)
  }
  throw Error(a + " is not a valid 8-hex color string");
};
goog.color.alpha.hexQuadrupletRe_ = /#(.)(.)(.)(.)/;
goog.color.alpha.normalizeAlphaHex_ = function(a) {
  if(!goog.color.alpha.isValidAlphaHexColor_(a)) {
    throw Error("'" + a + "' is not a valid alpha hex color");
  }
  5 == a.length && (a = a.replace(goog.color.alpha.hexQuadrupletRe_, "#$1$1$2$2$3$3$4$4"));
  return a.toLowerCase()
};
goog.color.alpha.hexToRgba = function(a) {
  a = goog.color.alpha.normalizeAlphaHex_(a);
  var b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16), d = parseInt(a.substr(5, 2), 16);
  a = parseInt(a.substr(7, 2), 16);
  return[b, c, d, a / 255]
};
goog.color.alpha.rgbaToHex = function(a, b, c, d) {
  var e = Math.floor(255 * d);
  if(isNaN(e) || 0 > e || 255 < e) {
    throw Error('"(' + a + "," + b + "," + c + "," + d + '") is not a valid RGBA color');
  }
  d = goog.color.prependZeroIfNecessaryHelper(e.toString(16));
  return goog.color.rgbToHex(a, b, c) + d
};
goog.color.alpha.hslaToHex = function(a, b, c, d) {
  var e = Math.floor(255 * d);
  if(isNaN(e) || 0 > e || 255 < e) {
    throw Error('"(' + a + "," + b + "," + c + "," + d + '") is not a valid HSLA color');
  }
  d = goog.color.prependZeroIfNecessaryHelper(e.toString(16));
  return goog.color.hslToHex(a, b / 100, c / 100) + d
};
goog.color.alpha.rgbaArrayToHex = function(a) {
  return goog.color.alpha.rgbaToHex(a[0], a[1], a[2], a[3])
};
goog.color.alpha.rgbaToRgbaStyle = function(a, b, c, d) {
  if(isNaN(a) || 0 > a || 255 < a || isNaN(b) || 0 > b || 255 < b || isNaN(c) || 0 > c || 255 < c || isNaN(d) || 0 > d || 1 < d) {
    throw Error('"(' + a + "," + b + "," + c + "," + d + ')" is not a valid RGBA color');
  }
  return goog.color.alpha.rgbaStyle_([a, b, c, d])
};
goog.color.alpha.rgbaArrayToRgbaStyle = function(a) {
  return goog.color.alpha.rgbaToRgbaStyle(a[0], a[1], a[2], a[3])
};
goog.color.alpha.hslaArrayToHex = function(a) {
  return goog.color.alpha.hslaToHex(a[0], a[1], a[2], a[3])
};
goog.color.alpha.hslaArrayToRgbaStyle = function(a) {
  return goog.color.alpha.hslaToRgbaStyle(a[0], a[1], a[2], a[3])
};
goog.color.alpha.hslaToRgbaStyle = function(a, b, c, d) {
  return goog.color.alpha.rgbaStyle_(goog.color.alpha.hslaToRgba(a, b, c, d))
};
goog.color.alpha.hslaToRgba = function(a, b, c, d) {
  return goog.color.hslToRgb(a, b / 100, c / 100).concat(d)
};
goog.color.alpha.rgbaToHsla = function(a, b, c, d) {
  return goog.color.rgbToHsl(a, b, c).concat(d)
};
goog.color.alpha.rgbaArrayToHsla = function(a) {
  return goog.color.alpha.rgbaToHsla(a[0], a[1], a[2], a[3])
};
goog.color.alpha.validAlphaHexColorRe_ = /^#(?:[0-9a-f]{4}){1,2}$/i;
goog.color.alpha.isValidAlphaHexColor_ = function(a) {
  return goog.color.alpha.validAlphaHexColorRe_.test(a)
};
goog.color.alpha.normalizedAlphaHexColorRe_ = /^#[0-9a-f]{8}$/;
goog.color.alpha.isNormalizedAlphaHexColor_ = function(a) {
  return goog.color.alpha.normalizedAlphaHexColorRe_.test(a)
};
goog.color.alpha.rgbaColorRe_ = /^(?:rgba)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|1|0\.\d{0,10})\)$/i;
goog.color.alpha.hslaColorRe_ = /^(?:hsla)\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\%,\s?(0|[1-9]\d{0,2})\%,\s?(0|1|0\.\d{0,10})\)$/i;
goog.color.alpha.isValidRgbaColor_ = function(a) {
  var b = a.match(goog.color.alpha.rgbaColorRe_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), d = Number(b[3]), b = Number(b[4]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= d && 255 >= d && 0 <= b && 1 >= b) {
      return[a, c, d, b]
    }
  }
  return[]
};
goog.color.alpha.isValidHslaColor_ = function(a) {
  var b = a.match(goog.color.alpha.hslaColorRe_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), d = Number(b[3]), b = Number(b[4]);
    if(0 <= a && 360 >= a && 0 <= c && 100 >= c && 0 <= d && 100 >= d && 0 <= b && 1 >= b) {
      return[a, c, d, b]
    }
  }
  return[]
};
goog.color.alpha.rgbaStyle_ = function(a) {
  var b = a.slice(0);
  b[3] = Math.round(1E3 * a[3]) / 1E3;
  return"rgba(" + b.join(",") + ")"
};
goog.color.alpha.hsvaToHex = function(a, b, c, d) {
  d = Math.floor(255 * d);
  return goog.color.hsvArrayToHex([a, b, c]) + goog.color.prependZeroIfNecessaryHelper(d.toString(16))
};
goog.color.alpha.hsvaArrayToHex = function(a) {
  return goog.color.alpha.hsvaToHex(a[0], a[1], a[2], a[3])
};
lime.fill = {};
lime.fill.Fill = function() {
  goog.events.EventTarget.call(this)
};
goog.inherits(lime.fill.Fill, goog.events.EventTarget);
lime.fill.Fill.prototype.initForSprite = goog.nullFunction;
lime.fill.parse = function(a) {
  if(a[0] instanceof lime.fill.Fill) {
    return a[0]
  }
  goog.isArray(a) || (a = goog.array.toArray(arguments));
  return 2 < a.length ? new lime.fill.Color(a) : goog.isString(a[0]) && ("rgb(" == a[0].substring(0, 4) || "rgba(" == a[0].substring(0, 5) || "#" == a[0].substring(0, 1)) ? new lime.fill.Color(a[0]) : new lime.fill.Image(a[0])
};
lime.fill.Fill.prototype.setDOMStyle = goog.nullFunction;
lime.fill.Fill.prototype.setCanvasStyle = goog.nullFunction;
lime.fill.Color = function(a) {
  lime.fill.Fill.call(this);
  this.a = 1;
  this.setColor(a)
};
goog.inherits(lime.fill.Color, lime.fill.Fill);
lime.fill.Color.prototype.id = "color";
lime.fill.Color.prototype.getRgba = function() {
  var a = null;
  if(goog.isNumber(this.r) && goog.isNumber(this.g) && goog.isNumber(this.b)) {
    a = [this.r, this.g, this.b, this.a]
  }else {
    if(goog.isString(this.str)) {
      var b = goog.color.parse(this.str);
      "named" != b.type && (a = goog.color.hexToRgb(b.hex));
      a.push(1)
    }
  }
  return a
};
lime.fill.Color.prototype.addBrightness = function(a) {
  return this.modifyColor(2, a)
};
lime.fill.Color.prototype.modifyColor = function(a, b) {
  var c = b || 0.1, d = this.getRgba();
  if(!d) {
    return this
  }
  d.pop();
  d = goog.color.rgbArrayToHsl(d);
  d[a] += c;
  1 < d[a] && (d[a] = 1);
  d = goog.color.hslArrayToRgb(d);
  d.push(this.a);
  return this.setColor(d)
};
lime.fill.Color.prototype.addSaturation = function(a) {
  return this.modifyColor(1, a)
};
lime.fill.Color.prototype.setColor = function(a) {
  var b = a;
  if(goog.isString(a)) {
    return this.str = a, this
  }
  2 < arguments.length && (b = arguments);
  3 <= b.length && (this.r = b[0], this.g = b[1], this.b = b[2]);
  4 == b.length && (this.a = b[3]);
  this.str = 1 == this.a ? "rgb(" + this.r + "," + this.g + "," + this.b + ")" : "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  return this
};
lime.fill.Color.prototype.setDOMStyle = function(a) {
  a.style.background = this.str
};
lime.fill.Color.prototype.setCanvasStyle = function(a) {
  a.fillStyle = this.str
};
lime.fill.Color.prototype.clone = function() {
  var a = new lime.fill.Color("");
  a.r = this.r;
  a.g = this.g;
  a.b = this.b;
  a.a = this.a;
  a.str = this.str;
  return a
};
lime.fill.Color.prototype.equals = function(a) {
  return a && a instanceof lime.fill.Color && (this.str === a.str || void 0 !== a.r && a.r === this.r && a.g === this.g && a.b === this.b && r.a === this.a || goog.array.equals(this.getRgba(), a.getRgba()))
};
lime.fill.Stroke = function(a, b) {
  lime.fill.Fill.call(this);
  var c = goog.isArray(a) ? a : goog.array.toArray(arguments);
  this.width_ = c[0] || 1;
  c.shift();
  this.setColor.apply(this, c)
};
goog.inherits(lime.fill.Stroke, lime.fill.Fill);
lime.fill.Stroke.prototype.id = "stroke";
lime.fill.Stroke.prototype.setDOMStyle = function(a) {
  a.style.border = this.width_ + "px solid " + this.color_.str
};
lime.fill.Stroke.prototype.setCanvasStyle = function(a) {
  a.strokeStyle = this.color_.str;
  a.lineWidth = this.width_
};
lime.fill.Stroke.prototype.getWidth = function() {
  return this.width_
};
lime.fill.Stroke.prototype.setWidth = function(a) {
  this.width_ = a;
  return this
};
lime.fill.Stroke.prototype.getColor = function() {
  return this.color_
};
lime.fill.Stroke.prototype.setColor = function(a) {
  var b = goog.array.toArray(arguments);
  b[0] instanceof lime.fill.Color ? this.color_ = b[0] : (this.color_ = new lime.fill.Color("#000"), b.length && this.color_.setColor.apply(this.color_, b));
  return this
};
lime.fill.Stroke.prototype.clone = function() {
  var a = new lime.fill.Stroke;
  a.width_ = this.width_;
  a.color_ = this.color_;
  return a
};
lime.fill.Image = function(a) {
  lime.fill.Fill.call(this);
  a && goog.isFunction(a.data) && (a = a.data());
  goog.isString(a) ? (this.url_ = a, 50 < this.url_.length && (this.url_ = this.url_.substr(-50)), lime.fill.Image.loadedImages_[this.url_] ? this.image_ = lime.fill.Image.loadedImages_[this.url_] : (this.image_ = new Image, this.image_.src = a)) : (this.url_ = a.src, 50 < this.url_.length && (this.url_ = this.url_.substr(-50)), this.image_ = lime.fill.Image.loadedImages_[this.url_] ? lime.fill.Image.loadedImages_[this.url_] : a);
  this.isLoaded() || this.addLoadHandler_();
  lime.fill.Image.loadedImages_[this.url_] = this.image_
};
goog.inherits(lime.fill.Image, lime.fill.Fill);
lime.fill.Image.loadedImages_ = {};
lime.fill.Image.prototype.id = "image";
lime.fill.Image.prototype.initForSprite = function(a) {
  var b = a.getSize(), c = this;
  !b.width && !b.height && (this.isLoaded() ? a.setSize(this.image_.width, this.image_.height) : goog.events.listen(this, goog.events.EventType.LOAD, function() {
    var a = this.getSize();
    !a.width && !a.height && this.setSize(c.image_.width, c.image_.height)
  }, !1, a));
  this.isLoaded() || goog.events.listen(this, goog.events.EventType.LOAD, function() {
    a.setDirty(lime.Dirty.CONTENT)
  }, !1, this)
};
lime.fill.Image.prototype.addLoadHandler_ = function() {
  goog.events.listen(this.image_, goog.events.EventType.LOAD, this.imageLoadedHandler_, !1, this)
};
lime.fill.Image.prototype.imageLoadedHandler_ = function(a) {
  this.dispatchEvent({type:"load"})
};
lime.fill.Image.prototype.getImageElement = function() {
  return this.image_
};
lime.fill.Image.prototype.isLoaded = function() {
  return!(!this.image_ || !this.image_.width || !this.image_.height)
};
lime.fill.Image.prototype.setSize = function(a, b, c) {
  goog.isNumber(a) && (a = new goog.math.Size(a, b), b = c || !1);
  this.size_ = a;
  this.size_perc_ = b;
  return this
};
lime.fill.Image.prototype.setOffset = function(a, b, c) {
  goog.isNumber(a) && (a = new goog.math.Coordinate(a, b), b = c || !1);
  this.offset_ = a;
  this.offset_perc_ = b;
  return this
};
lime.fill.Image.prototype.getPixelSizeAndOffset = function(a) {
  a = a.getSize().clone();
  this.size_ && (this.size_perc_ ? (a.width *= this.size_.width, a.height *= this.size_.height) : a = this.size_);
  var b = new goog.math.Coordinate(0, 0);
  this.offset_ && (this.offset_perc_ ? (b.x = a.width * this.offset_.x, b.y = a.height * this.offset_.y) : b = this.offset_);
  return[a, b]
};
lime.fill.Image.prototype.setDOMBackgroundProp_ = function(a, b) {
  var c = this.getPixelSizeAndOffset(b), d = c[0], c = c[1];
  a.style[lime.style.getCSSproperty("BackgroundSize")] = d.width + "px " + d.height + "px";
  d = b.stroke_ ? b.stroke_.width_ : 0;
  a.style.backgroundPosition = c.x - d + "px " + (c.y - d) + "px";
  this.qualityRenderer && (a.style.imageRendering = "optimizeQuality")
};
lime.fill.Image.prototype.IS_IOS_CHROME = lime.userAgent.IOS && (lime.userAgent.CHROME || /CriOS/.test(goog.global.navigator.userAgent));
lime.fill.Image.prototype.setDOMStyle = function(a, b) {
  var c = "url(" + this.image_.src + ")";
  if(this.IS_IOS_CHROME) {
    var d = a.style.background;
    if(!d || -1 === d.indexOf(c)) {
      a.style.background = c
    }
  }else {
    a.style.background = c
  }
  this.setDOMBackgroundProp_(a, b)
};
lime.fill.Image.prototype.setCanvasStyle = function(a, b) {
  var c = b.getSize(), d = b.getFrame();
  if(c.width && c.height) {
    var e = this.getPixelSizeAndOffset(b), f = e[0], e = e[1];
    if(0 > e.x || 0 > e.y || c.width > f.width - e.x || c.height > f.height - e.y || !this.writeToCanvas || this.rotated_) {
      var g = this.getImageElement();
      !g._pattern && g.complete && (g._pattern = a.createPattern(g, "repeat"));
      var h = f.width / g.width, f = f.height / g.height;
      a.save();
      a.translate(d.left + e.x, d.top + e.y);
      a.scale(h, f);
      a.fillStyle = g._pattern || "none";
      a.fillRect(-e.x / h, -e.y / f, c.width / h, c.height / f)
    }else {
      g = this.image_, !g._pattern && g.complete && (g._pattern = a.createPattern(g, "repeat")), h = f.width / this.csize_.width, f = f.height / this.csize_.height, a.save(), a.translate(d.left + e.x, d.top + e.y), a.scale(h, f), a.fillStyle = g._pattern || "none", d = this.rect_.left, g = this.rect_.top, a.translate(this.coffset_.x - d, this.coffset_.y - g), c = goog.math.Rect.intersection(this.rect_, new goog.math.Rect(d - e.x / h - this.coffset_.x, g - e.y / f - this.coffset_.y, c.width / h, c.height / 
      f)), a.fillRect(c.left, c.top, c.width, c.height)
    }
    a.restore()
  }
};
lime.Renderer.CANVAS.SPRITE = {};
lime.Renderer.DOM.SPRITE = {};
lime.Sprite = function() {
  lime.Node.call(this);
  this.stroke_ = this.fill_ = null
};
goog.inherits(lime.Sprite, lime.Node);
lime.Sprite.prototype.id = "sprite";
lime.Sprite.prototype.supportedRenderers = [lime.Renderer.DOM.makeSubRenderer(lime.Renderer.DOM.SPRITE), lime.Renderer.CANVAS.makeSubRenderer(lime.Renderer.CANVAS.SPRITE)];
lime.Sprite.prototype.getFill = function() {
  return this.fill_
};
lime.Sprite.prototype.setFill = function(a, b, c, d) {
  this.fill_ = lime.fill.parse(goog.array.toArray(arguments));
  this.fill_.initForSprite(this);
  this.setDirty(lime.Dirty.CONTENT);
  return this
};
lime.Sprite.prototype.getStroke = function() {
  return this.stroke_
};
lime.Sprite.prototype.setStroke = function(a) {
  a && !(a instanceof lime.fill.Stroke) && (a = new lime.fill.Stroke(goog.array.toArray(arguments)));
  this.stroke_ = a;
  this.setDirty(lime.Dirty.CONTENT);
  return this
};
lime.Sprite.prototype.getCanvasContextName_ = function() {
  var a = 0;
  return function() {
    goog.isDef(this.canvasContextName_) || (this.canvasContextName_ = "limedc" + a++);
    return this.canvasContextName_
  }
}();
lime.Renderer.DOM.SPRITE.draw = function(a) {
  goog.isNull(this.fill_) || this.fill_.setDOMStyle(a, this);
  goog.isNull(this.stroke_) ? this.hadStroke_ && (goog.style.setStyle(a, "border-width", 0), this.hadStroke_ = !1) : (this.stroke_.setDOMStyle(a, this), this.hadStroke_ = !0)
};
lime.Renderer.CANVAS.SPRITE.draw = function(a) {
  var b = this.getSize(), c = this.fill_, d = this.stroke_;
  if(c || d) {
    var e = this.getFrame();
    c && (c.setCanvasStyle(a, this), "image" != c.id && "frame" != c.id && a.fillRect(e.left, e.top, b.width, b.height));
    if(d && (d.setCanvasStyle(a, this), "sprite" == this.id || "label" == this.id)) {
      c = d.width_ / 2, a.strokeRect(e.left + c, e.top + c, b.width - 2 * c, b.height - 2 * c)
    }
  }
};
lime.animation.Delay = function() {
  lime.animation.Animation.call(this)
};
goog.inherits(lime.animation.Delay, lime.animation.Animation);
lime.animation.Delay.prototype.update = goog.nullFunction;
lime.animation.Delay.prototype.reverse = function() {
  return(new lime.animation.Delay).setDuration(this.getDuration())
};
lime.animation.Sequence = function(a) {
  lime.animation.Animation.call(this);
  var b = goog.array.toArray(arguments);
  goog.isArray(a) && (b = a);
  this.actions = 2 < b.length ? [b.shift(), new lime.animation.Sequence(b)] : b;
  this.setDuration(this.actions[0].duration_ + this.actions[1].duration_);
  this.split_ = null;
  this.last_ = 0
};
goog.inherits(lime.animation.Sequence, lime.animation.Animation);
lime.animation.Sequence.prototype.initTarget = function(a) {
  lime.animation.Animation.prototype.initTarget.call(this, a);
  this.setDuration(this.actions[0].duration_ + this.actions[1].duration_);
  this.split_ = this.actions[0].duration_ / this.duration_;
  this.last_ = -1
};
lime.animation.Sequence.prototype.stop = function() {
  this.last_ && -1 != this.last_ && this.actions[this.last_].stop(this.targets);
  lime.animation.Animation.prototype.stop.apply(this, arguments)
};
lime.animation.Sequence.prototype.updateAll = function(a, b) {
  if(0 == this.status_) {
    return a
  }
  for(var c = b.length;0 <= --c;) {
    this.getTargetProp(b[c])
  }
  var d = c = 0;
  a >= this.split_ ? (c = 1, d = 1 == this.split_ ? 1 : (a - this.split_) / (1 - this.split_)) : (c = 0, d = 0 != this.split_ ? a / this.split_ : 1);
  -1 == this.last_ && 1 == c && (this.actions[0].status_ = 1, this.actions[0].updateAll(1, b), this.actions[0].stop());
  this.last_ != c && (-1 != this.last_ && this.actions[this.last_] && (this.actions[this.last_].updateAll(1, b), this.actions[this.last_].stop()), this.actions[c].status_ = 1);
  this.actions[c].updateAll(d, b);
  this.last_ = c;
  return a
};
lime.animation.Sequence.prototype.reverse = function() {
  return new lime.animation.Sequence(this.actions[1].reverse(), this.actions[0].reverse())
};
lime.animation.Spawn = function(a) {
  lime.animation.Animation.call(this);
  var b = goog.array.toArray(arguments);
  goog.isArray(a) && (b = a);
  2 < b.length ? (this.one = b.shift(), this.two = new lime.animation.Spawn(b)) : (this.one = b[0], this.two = b[1]);
  var b = this.one.duration_, c = this.two.duration_;
  this.setDuration(Math.max(b, c));
  var d = new lime.animation.Delay;
  b > c ? this.two = new lime.animation.Sequence(this.two, d.setDuration(b - c)) : b < c && (this.one = new lime.animation.Sequence(this.one, d.setDuration(c - b)))
};
goog.inherits(lime.animation.Spawn, lime.animation.Animation);
lime.animation.Spawn.prototype.initTarget = function(a) {
  lime.animation.Animation.prototype.initTarget.call(this, a);
  this.one.status_ = 1;
  this.two.status_ = 1
};
lime.animation.Spawn.prototype.updateAll = function(a, b) {
  if(0 != this.status_) {
    for(var c = b.length;0 <= --c;) {
      this.getTargetProp(b[c])
    }
    this.one.updateAll(a, b);
    this.two.updateAll(a, b);
    return a
  }
};
lime.animation.Spawn.prototype.reverse = function() {
  return new lime.animation.Spawn(this.one.reverse(), this.two.reverse())
};
goog.cssom = {};
goog.cssom.CssRuleType = {STYLE:1, IMPORT:3, MEDIA:4, FONT_FACE:5, PAGE:6, NAMESPACE:7};
goog.cssom.getAllCssText = function(a) {
  return goog.cssom.getAllCss_(a || document.styleSheets, !0)
};
goog.cssom.getAllCssStyleRules = function(a) {
  return goog.cssom.getAllCss_(a || document.styleSheets, !1)
};
goog.cssom.getCssRulesFromStyleSheet = function(a) {
  var b = null;
  try {
    b = a.rules || a.cssRules
  }catch(c) {
    if(15 == c.code) {
      throw c.styleSheet = a, c;
    }
  }
  return b
};
goog.cssom.getAllCssStyleSheets = function(a, b) {
  var c = [], d = a || document.styleSheets, e = goog.isDef(b) ? b : !1;
  if(d.imports && d.imports.length) {
    for(var f = 0, g = d.imports.length;f < g;f++) {
      goog.array.extend(c, goog.cssom.getAllCssStyleSheets(d.imports[f]))
    }
  }else {
    if(d.length) {
      f = 0;
      for(g = d.length;f < g;f++) {
        goog.array.extend(c, goog.cssom.getAllCssStyleSheets(d[f]))
      }
    }else {
      var h = goog.cssom.getCssRulesFromStyleSheet(d);
      if(h && h.length) {
        for(var f = 0, g = h.length, k;f < g;f++) {
          k = h[f], k.styleSheet && goog.array.extend(c, goog.cssom.getAllCssStyleSheets(k.styleSheet))
        }
      }
    }
  }
  (d.type || d.rules || d.cssRules) && (!d.disabled || e) && c.push(d);
  return c
};
goog.cssom.getCssTextFromCssRule = function(a) {
  var b = "";
  a.cssText ? b = a.cssText : a.style && (a.style.cssText && a.selectorText) && (b = a.style.cssText.replace(/\s*-closure-parent-stylesheet:\s*\[object\];?\s*/gi, "").replace(/\s*-closure-rule-index:\s*[\d]+;?\s*/gi, ""), b = a.selectorText + " { " + b + " }");
  return b
};
goog.cssom.getCssRuleIndexInParentStyleSheet = function(a, b) {
  if(a.style && a.style["-closure-rule-index"]) {
    return a.style["-closure-rule-index"]
  }
  var c = b || goog.cssom.getParentStyleSheet(a);
  if(!c) {
    throw Error("Cannot find a parentStyleSheet.");
  }
  if((c = goog.cssom.getCssRulesFromStyleSheet(c)) && c.length) {
    for(var d = 0, e = c.length, f;d < e;d++) {
      if(f = c[d], f == a) {
        return d
      }
    }
  }
  return-1
};
goog.cssom.getParentStyleSheet = function(a) {
  return a.parentStyleSheet || a.style && a.style["-closure-parent-stylesheet"]
};
goog.cssom.replaceCssRule = function(a, b, c, d) {
  if(c = c || goog.cssom.getParentStyleSheet(a)) {
    if(a = 0 <= d ? d : goog.cssom.getCssRuleIndexInParentStyleSheet(a, c), 0 <= a) {
      goog.cssom.removeCssRule(c, a), goog.cssom.addCssRule(c, b, a)
    }else {
      throw Error("Cannot proceed without the index of the cssRule.");
    }
  }else {
    throw Error("Cannot proceed without the parentStyleSheet.");
  }
};
goog.cssom.addCssRule = function(a, b, c) {
  if(0 > c || void 0 == c) {
    c = (a.cssRules || a.rules).length
  }
  if(a.insertRule) {
    a.insertRule(b, c)
  }else {
    if(b = /^([^\{]+)\{([^\{]+)\}/.exec(b), 3 == b.length) {
      a.addRule(b[1], b[2], c)
    }else {
      throw Error("Your CSSRule appears to be ill-formatted.");
    }
  }
};
goog.cssom.removeCssRule = function(a, b) {
  a.deleteRule ? a.deleteRule(b) : a.removeRule(b)
};
goog.cssom.addCssText = function(a, b) {
  var c = b ? b.getDocument() : goog.dom.getDocument(), d = c.createElement("style");
  d.type = "text/css";
  c.getElementsByTagName("head")[0].appendChild(d);
  d.styleSheet ? d.styleSheet.cssText = a : (c = c.createTextNode(a), d.appendChild(c));
  return d
};
goog.cssom.getFileNameFromStyleSheet = function(a) {
  a = a.href;
  return!a ? null : /([^\/\?]+)[^\/]*$/.exec(a)[1]
};
goog.cssom.getAllCss_ = function(a, b) {
  for(var c = [], d = goog.cssom.getAllCssStyleSheets(a), e = 0;a = d[e];e++) {
    var f = goog.cssom.getCssRulesFromStyleSheet(a);
    if(f && f.length) {
      if(!b) {
        var g = 0
      }
      for(var h = 0, k = f.length, l;h < k;h++) {
        l = f[h], b && !l.href ? (l = goog.cssom.getCssTextFromCssRule(l), c.push(l)) : l.href || (l.style && (l.parentStyleSheet || (l.style["-closure-parent-stylesheet"] = a), l.style["-closure-rule-index"] = g), c.push(l)), b || g++
      }
    }
  }
  return b ? c.join(" ") : c
};
lime.fill.Frame = function(a, b, c, d, e) {
  lime.fill.Image.call(this, a);
  goog.isNumber(b) && (b = new goog.math.Rect(b, c, d, e), c = new goog.math.Vec2(0, 0), d = new goog.math.Size(b.width, b.height), e = !1);
  this.rect_ = b;
  this.coffset_ = c;
  this.csize_ = d;
  this.rotated_ = e;
  a = this.rect_;
  a = [this.url_, a.width, a.height, a.left, a.top, this.coffset_.x, this.coffset_.y].join("_");
  goog.isDef(this.dataCache_[a]) ? (this.data_ = this.dataCache_[a], this.data_.processed || goog.events.listen(this.data_.initializer, "processed", function() {
    this.dispatchEvent(new goog.events.Event("processed"))
  }, !1, this)) : (this.data_ = {}, this.data_.processed = !1, this.data_.initializer = this, this.data_.classname = this.getNextCssClass_(), this.dataCache_[a] = this.data_, this.USE_CSS_CANVAS && (this.ctx = document.getCSSCanvasContext("2d", this.data_.classname, this.csize_.width, this.csize_.height)), this.isLoaded() ? this.makeFrameData_() : goog.events.listen(this, goog.events.EventType.LOAD, this.makeFrameData_, !1, this))
};
goog.inherits(lime.fill.Frame, lime.fill.Image);
lime.fill.Frame.prototype.id = "frame";
lime.fill.Frame.prototype.dataCache_ = {};
lime.fill.Frame.prototype.USE_CSS_CANVAS = goog.isFunction(document.getCSSCanvasContext);
lime.fill.Frame.prototype.initForSprite = function(a) {
  var b = a.getSize();
  0 == b.width && 0 == b.height && a.setSize(this.csize_.width, this.csize_.height);
  lime.fill.Image.prototype.initForSprite.call(this, a);
  this.isProcessed() || goog.events.listen(this, "processed", function() {
    a.setDirty(lime.Dirty.CONTENT)
  }, !1, this)
};
lime.fill.Frame.prototype.isProcessed = function() {
  return this.data_ && this.data_.processed
};
(function() {
  var a = "cvsbg_" + Math.round(1E3 * Math.random()) + "_", b = 0, c;
  lime.fill.Frame.prototype.getNextCssClass_ = function() {
    b++;
    return a + b
  };
  lime.fill.Frame.prototype.makeFrameData_ = function() {
    this.ctx && this.writeToCanvas(this.ctx);
    if(!this.USE_CSS_CANVAS && lime.dom.isDOMSupported()) {
      var a = this.cvs.toDataURL("image/png"), b = "." + this.data_.classname + "{background-image:url(" + a + ") !important}";
      c ? goog.userAgent.IE ? c.cssText += b : goog.cssom.addCssRule(c, b) : (goog.style.installStyles(b), c = document.styleSheets[document.styleSheets.length - 1]);
      this.data_.img = goog.dom.createDom("img");
      this.data_.img.src = a
    }
    this.data_.processed = !0;
    this.dispatchEvent(new goog.events.Event("processed"));
    this.getImageElement().complete = !0
  }
})();
lime.fill.Frame.prototype.getImageElement = function() {
  if(!this.frameImgCache_) {
    if(this.data_.initializer && this.data_.initializer.frameImgCache_) {
      this.frameImgCache_ = this.data_.initializer.frameImgCache_
    }else {
      if(!this.cvs) {
        var a = this.makeCanvas();
        this.writeToCanvas(a);
        this.ctx = a;
        this.cvs._pattern = !1
      }
      this.frameImgCache_ = this.cvs
    }
  }
  return this.frameImgCache_
};
lime.fill.Frame.prototype.makeCanvas = function() {
  this.cvs = goog.dom.createDom("canvas");
  var a = this.cvs.getContext("2d");
  this.cvs.width = this.csize_.width;
  this.cvs.height = this.csize_.height;
  return a
};
lime.fill.Frame.prototype.writeToCanvas = function(a) {
  var b = this.rect_, c = b.width, d = b.height, e = b.left, b = b.top, f, g;
  0 > e && (c += e, e = 0);
  0 > b && (d += b, b = 0);
  c + e > this.image_.width && (c = this.image_.width - e);
  d + b > this.image_.height && (d = this.image_.height - b);
  this.rotated_ ? (a.rotate(0.5 * -Math.PI), a.translate(-this.csize_.height, 0), f = this.csize_.height - this.coffset_.y - c, g = this.coffset_.x) : (f = this.coffset_.x, g = this.coffset_.y);
  a.drawImage(this.image_, e, b, c, d, f, g, c, d)
};
lime.fill.Frame.prototype.setDOMStyle = function(a, b) {
  this.USE_CSS_CANVAS ? a.style.background = "-webkit-canvas(" + this.data_.classname + ")" : this.data_.classname != b.cvs_background_class_ && (goog.dom.classes.add(a, this.data_.classname), a.style.background = "", b.cvs_background_class_ && goog.dom.classes.remove(a, b.cvs_background_class_), b.cvs_background_class_ = this.data_.classname);
  this.setDOMBackgroundProp_(a, b)
};
lime.animation.ScaleTo = function(a, b) {
  lime.animation.Animation.call(this);
  1 == arguments.length && goog.isNumber(a) ? this.scale_ = new goog.math.Vec2(a, a) : this.scale_ = 2 == arguments.length ? new goog.math.Vec2(arguments[0], arguments[1]) : a
};
goog.inherits(lime.animation.ScaleTo, lime.animation.Animation);
lime.animation.ScaleTo.prototype.scope = "scale";
lime.animation.ScaleTo.prototype.makeTargetProp = function(a) {
  var b = a.getScale(), c = new goog.math.Vec2(this.scale_.x - b.x, this.scale_.y - b.y);
  this.useTransitions() && (a.addTransition(lime.Transition.SCALE, new goog.math.Vec2(b.x + c.x, b.y + c.y), this.duration_, this.getEasing()), a.setDirty(lime.Dirty.SCALE));
  return{startScale:b, delta:c}
};
lime.animation.ScaleTo.prototype.update = function(a, b) {
  if(0 != this.status_) {
    var c = this.getTargetProp(b);
    b.setScale(c.startScale.x + c.delta.x * a, c.startScale.y + c.delta.y * a)
  }
};
lime.animation.ScaleTo.prototype.clearTransition = function(a) {
  this.useTransitions() && (a.clearTransition(lime.Transition.SCALE), a.setDirty(lime.Dirty.SCALE))
};
lime.animation.FadeTo = function(a) {
  lime.animation.Animation.call(this);
  this.opacity_ = a
};
goog.inherits(lime.animation.FadeTo, lime.animation.Animation);
lime.animation.FadeTo.prototype.scope = "fade";
lime.animation.FadeTo.prototype.makeTargetProp = function(a) {
  var b = a.getOpacity();
  this.useTransitions() && (a.addTransition(lime.Transition.OPACITY, this.opacity_, this.duration_, this.getEasing()), a.setDirty(lime.Dirty.ALPHA));
  return{startOpacity:b, delta:this.opacity_ - b}
};
lime.animation.FadeTo.prototype.update = function(a, b) {
  if(0 != this.status_) {
    var c = this.getTargetProp(b);
    b.setOpacity(c.startOpacity + c.delta * a)
  }
};
lime.animation.FadeTo.prototype.clearTransition = function(a) {
  this.useTransitions() && (a.clearTransition(lime.Transition.OPACITY), a.setDirty(lime.Dirty.ALPHA))
};
lime.Renderer.CANVAS.LABEL = {};
lime.Renderer.DOM.LABEL = {};
lime.Label = function(a) {
  lime.Sprite.call(this);
  this.setMultiline(!1);
  this.setText(a);
  this.setFontFamily(lime.Label.defaultFont);
  this.setFontSize(14);
  this.setFontColor("#000");
  this.setAlign("center");
  this.setFontWeight("400");
  this.setPadding(0);
  this.setLineHeight(1.15);
  this.setShadow(null);
  this.setFill(255, 255, 255, 0);
  this.setStyle("normal");
  this.lines_ = this.words_ = this.sizeCache_ = this.lastDrawnWidth_ = null
};
goog.inherits(lime.Label, lime.Sprite);
lime.Label.prototype.id = "label";
lime.Label.defaultFont = "Arial";
lime.Label.prototype.supportedRenderers = [lime.Renderer.DOM.SPRITE.makeSubRenderer(lime.Renderer.DOM.LABEL), lime.Renderer.CANVAS.SPRITE.makeSubRenderer(lime.Renderer.CANVAS.LABEL)];
(function() {
  var a;
  lime.Label.prototype.measureText = function() {
    goog.isDef(a) || (a = document.createElement("canvas").getContext("2d"));
    var b = this.getLineHeight() * this.getFontSize();
    this.getMultiline() && (b *= goog.string.trim(this.text_).split("\n").length);
    a.font = this.getFontSize() + "px FuturaHv.ttf";
    var c = a.measureText(this.text_), c = goog.userAgent.WEBKIT ? c.width : c.width + 1;
    lime.userAgent.IOS5 && (c += 1);
    var d = this.stroke_ ? this.stroke_.width_ : 0;
    return this.sizeCache_ = new goog.math.Size(this.padding_[1] + this.padding_[3] + c + 2 * d, this.padding_[0] + this.padding_[2] + b + 2 * d)
  }
})();
lime.Label.prototype.getSize = function() {
  var a = lime.Node.prototype.getSize.call(this);
  return!a || !a.width && !a.height ? this.sizeCache_ || this.measureText() : a
};
lime.Label.prototype.getText = function() {
  return this.text_
};
lime.Label.prototype.setText = function(a) {
  this.text_ = a + "";
  this.setDirty(lime.Dirty.CONTENT);
  this.words_ = null;
  return this
};
lime.Label.prototype.setStyle = function(a) {
  this.style_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getStyle = function() {
  return this.style_
};
lime.Label.prototype.getFontFamily = function() {
  return this.fontFamily_
};
lime.Label.prototype.setFontWeight = function(a) {
  this.fontWeight_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getFontWeight = function() {
  return this.fontWeight_
};
lime.Label.prototype.setFontFamily = function(a) {
  this.fontFamily_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getFontSize = function() {
  return this.fontSize_
};
lime.Label.prototype.setFontSize = function(a) {
  this.fontSize_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getFontColor = function() {
  return this.fontColor_
};
lime.Label.prototype.setFontColor = function(a) {
  this.fontColor_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getPadding = function() {
  return this.padding_
};
lime.Label.prototype.setPadding = function(a, b, c, d) {
  a = [a, a, a, a];
  goog.isDef(b) && (a[1] = a[3] = b);
  goog.isDef(c) && (a[2] = c);
  goog.isDef(d) && (a[3] = d);
  this.padding_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.setLineHeight = function(a, b) {
  this.lineHeightAbsolute_ = b || !1;
  this.lineHeight_ = a;
  return this
};
lime.Label.prototype.getLineHeight = function() {
  var a = Math.abs(this.getShadowOffset().y) + 2 * this.shadowBlur_;
  return this.lineHeightAbsolute_ ? (this.lineHeight_ + a) / this.getFontSize() : this.lineHeight_ + a / this.getFontSize()
};
lime.Label.prototype.getAlign = function() {
  return this.align_
};
lime.Label.prototype.setAlign = function(a) {
  this.align_ = a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getMultiline = function() {
  return this.multiline_
};
lime.Label.prototype.setMultiline = function(a) {
  this.multiline_ = a;
  this.setDirty(lime.Dirty.CONTENT);
  return this
};
lime.Label.prototype.setShadow = function(a, b, c, d) {
  1 == arguments.length && goog.isNull(a) ? (this.setShadowColor("#ccc"), this.setShadowBlur(0), this.setShadowOffset(0, 0)) : 2 == arguments.length ? (this.setShadowColor(a), this.setShadowBlur(b), this.setShadowOffset(new goog.math.Vec2(0, 0))) : 3 == arguments.length ? (this.setShadowColor(a), this.setShadowBlur(b), this.setShadowOffset(c)) : (this.setShadowColor(a), this.setShadowBlur(b), this.setShadowOffset(c, d));
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.hasShadow_ = function() {
  return this.shadowBlur_ || this.shadowOffset_.x || this.shadowOffset_.y
};
lime.Label.prototype.getShadowColor = function() {
  return this.shadowColor_
};
lime.Label.prototype.getShadowOffset = function() {
  return this.shadowOffset_
};
lime.Label.prototype.setShadowColor = function(a) {
  this.shadowColor_ = a;
  return this
};
lime.Label.prototype.setShadowBlur = function(a) {
  this.shadowBlur_ = a;
  return this
};
lime.Label.prototype.setShadowOffset = function(a, b) {
  this.shadowOffset_ = 2 == arguments.length ? new goog.math.Vec2(arguments[0], arguments[1]) : a;
  this.setDirty(lime.Dirty.FONT);
  return this
};
lime.Label.prototype.getShadowBlur = function() {
  return this.shadowBlur_
};
lime.Label.prototype.calcWordsArray = function() {
  var a = [], b = this.text_.length, c = this.text_.match(goog.userAgent.GECKO ? /[\s\.]+/g : /[\s-\.]+/g), d = 0;
  if(c) {
    for(var e = 0;e < c.length;e++) {
      var f = c[e], f = this.text_.indexOf(f, d) + f.length;
      a.push(this.text_.substring(d, f));
      d = f
    }
  }
  d != b && a.push(this.text_.substring(d, b));
  return a
};
lime.Label.prototype.wrapText = function(a, b) {
  for(var c = [], d = "", e = this.words_, f, g = 0;g < e.length;g++) {
    var h = 0;
    if(this.multiline_ && (f = e[g].match(/\n/g))) {
      h = f.length
    }
    "" == d ? d = e[g] : (f = a.measureText(goog.string.trim(d + e[g])), f.width > b ? (c.push(goog.string.trim(d)), d = e[g]) : d += e[g]);
    for(f = 0;f < h;f++) {
      c.push(goog.string.trim(d)), d = ""
    }
  }
  c.push(d);
  return c
};
lime.Label.prototype.update = function() {
  var a = this.getDirty();
  a & lime.Dirty.CONTENT && (this.lastDrawnWidth_ = null);
  a && (this.sizeCache_ = null);
  lime.Node.prototype.update.apply(this, arguments)
};
lime.Renderer.DOM.LABEL.draw = function(a) {
  lime.Renderer.DOM.SPRITE.draw.call(this, a);
  var b = a.style;
  this.dirty_ & lime.Dirty.CONTENT && (this.getMultiline() ? a.innerHTML = goog.string.htmlEscape(this.text_).replace(/\n/g, "<br/>") : goog.dom.setTextContent(a, this.text_));
  this.dirty_ & lime.Dirty.FONT && (b.lineHeight = this.getLineHeight(), b.padding = goog.array.map(this.padding_, function(a) {
    return a
  }, this).join("px ") + "px", b.color = this.getFontColor(), b.fontFamily = this.getFontFamily(), b.fontSize = this.getFontSize() + "px", b.fontWeight = this.getFontWeight(), b.textAlign = this.getAlign(), b["font-style"] = this.getStyle(), b.textShadow = this.hasShadow_() ? this.getShadowColor() + " " + this.getShadowOffset().x + "px " + this.getShadowOffset().y + "px " + this.getShadowBlur() + "px" : "")
};
lime.Renderer.CANVAS.LABEL.draw = function(a) {
  lime.Renderer.CANVAS.SPRITE.draw.call(this, a);
  var b = this.getFrame(), c = -b.left - this.padding_[3] + b.right - this.padding_[1] + Math.abs(this.getShadowOffset().x) + Math.abs(2 * this.getShadowBlur()), d = 0;
  this.words_ || (this.words_ = this.calcWordsArray(), d = 1);
  var e = this.stroke_ ? this.stroke_.width_ : 0;
  a.save();
  var f = this.getAlign();
  "left" == f ? a.translate(b.left + this.padding_[3] + e, b.top + this.padding_[0] + e) : "right" == f ? a.translate(b.right - this.padding_[1] - e, b.top + this.padding_[0] + e) : "center" == f && a.translate(0.5 * (b.left + this.padding_[3] + b.right - this.padding_[1]), b.top + this.padding_[0] + e);
  b = this.getLineHeight();
  a.fillStyle = this.getFontColor();
  a.font = this.getFontSize() + "px FuturaHv.ttf";
  a.textAlign = f;
  a.textBaseline = "top";
  this.hasShadow_() && (a.shadowColor = this.getShadowColor(), a.shadowOffsetX = this.getShadowOffset().x, a.shadowOffsetY = this.getShadowOffset().y, a.shadowBlur = this.getShadowBlur());
  if(d || c != this.lastDrawnWidth_) {
    this.lines_ = this.wrapText(a, c - 2 * e), this.lastDrawnWidth_ = c
  }
  if(this.lines_) {
    c = b * this.getFontSize();
    d = (goog.isDef(this.getShadowBlur()) ? Math.abs(this.getShadowBlur()) : 0) + (goog.isDef(this.getShadowOffset()) ? Math.abs(this.getShadowOffset().y) / 2 : 0);
    c = goog.userAgent.WEBKIT ? Math.floor(c) : Math.round(c);
    for(e = 0;e < this.lines_.length;e++) {
      a.fillText(this.lines_[e], 0, c * e + d - 0.5)
    }
  }
  a.restore()
};
lime.Label.installFont = function(a, b, c) {
  lime.dom.isDOMSupported() && goog.style.installStyles('@font-face{font-family: "' + a + '";src: url(' + b + ') format("' + (c || "truetype") + '");})')
};
lime.Renderer.CANVAS.ROUNDEDRECT = {};
lime.Renderer.DOM.ROUNDEDRECT = {};
lime.RoundedRect = function() {
  lime.Sprite.call(this);
  this.setRadius(5)
};
goog.inherits(lime.RoundedRect, lime.Sprite);
lime.RoundedRect.prototype.id = "roundedrect";
lime.RoundedRect.prototype.supportedRenderers = [lime.Renderer.DOM.SPRITE.makeSubRenderer(lime.Renderer.DOM.ROUNDEDRECT), lime.Renderer.CANVAS.SPRITE.makeSubRenderer(lime.Renderer.CANVAS.ROUNDEDRECT)];
lime.RoundedRect.prototype.getRadius = function() {
  return this.radius_
};
lime.RoundedRect.prototype.getUnitPercentage = function() {
  return this.unitPercentage_
};
lime.RoundedRect.prototype.setRadius = function(a, b) {
  this.unitPercentage_ = b || !1;
  this.radius_ = a;
  return this
};
lime.Renderer.DOM.ROUNDEDRECT.draw = function(a) {
  this.getSize();
  lime.Renderer.DOM.SPRITE.draw.call(this, a);
  lime.style.setBorderRadius(a, [this.radius_, this.radius_])
};
lime.Renderer.CANVAS.ROUNDEDRECT.draw = function(a) {
  this.getSize();
  this.getFill();
  var b = this.getFrame(), c = this.getRadius(), d = b.left, e = b.top, f = b.right - b.left, b = b.bottom - b.top;
  a.save();
  a.beginPath();
  a.moveTo(d + c, e);
  a.lineTo(d + f - c, e);
  a.quadraticCurveTo(d + f, e, d + f, e + c);
  a.lineTo(d + f, e + b - c);
  a.quadraticCurveTo(d + f, e + b, d + f - c, e + b);
  a.lineTo(d + c, e + b);
  a.quadraticCurveTo(d, e + b, d, e + b - c);
  a.lineTo(d, e + c);
  a.quadraticCurveTo(d, e, d + c, e);
  a.closePath();
  a.clip();
  lime.Renderer.CANVAS.SPRITE.draw.call(this, a);
  this.stroke_ && (a.lineWidth *= 2, a.stroke());
  a.restore()
};
goog.dom.xml = {};
goog.dom.xml.MAX_XML_SIZE_KB = 2048;
goog.dom.xml.MAX_ELEMENT_DEPTH = 256;
goog.dom.xml.createDocument = function(a, b) {
  if(b && !a) {
    throw Error("Can't create document with namespace and no root tag");
  }
  if(document.implementation && document.implementation.createDocument) {
    return document.implementation.createDocument(b || "", a || "", null)
  }
  if("undefined" != typeof ActiveXObject) {
    var c = goog.dom.xml.createMsXmlDocument_();
    if(c) {
      return a && c.appendChild(c.createNode(goog.dom.NodeType.ELEMENT, a, b || "")), c
    }
  }
  throw Error("Your browser does not support creating new documents");
};
goog.dom.xml.loadXml = function(a) {
  if("undefined" != typeof DOMParser) {
    return(new DOMParser).parseFromString(a, "application/xml")
  }
  if("undefined" != typeof ActiveXObject) {
    var b = goog.dom.xml.createMsXmlDocument_();
    b.loadXML(a);
    return b
  }
  throw Error("Your browser does not support loading xml documents");
};
goog.dom.xml.serialize = function(a) {
  if("undefined" != typeof XMLSerializer) {
    return(new XMLSerializer).serializeToString(a)
  }
  if(a = a.xml) {
    return a
  }
  throw Error("Your browser does not support serializing XML documents");
};
goog.dom.xml.selectSingleNode = function(a, b) {
  if("undefined" != typeof a.selectSingleNode) {
    var c = goog.dom.getOwnerDocument(a);
    "undefined" != typeof c.setProperty && c.setProperty("SelectionLanguage", "XPath");
    return a.selectSingleNode(b)
  }
  if(document.implementation.hasFeature("XPath", "3.0")) {
    var c = goog.dom.getOwnerDocument(a), d = c.createNSResolver(c.documentElement);
    return c.evaluate(b, a, d, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  }
  return null
};
goog.dom.xml.selectNodes = function(a, b) {
  if("undefined" != typeof a.selectNodes) {
    var c = goog.dom.getOwnerDocument(a);
    "undefined" != typeof c.setProperty && c.setProperty("SelectionLanguage", "XPath");
    return a.selectNodes(b)
  }
  if(document.implementation.hasFeature("XPath", "3.0")) {
    for(var c = goog.dom.getOwnerDocument(a), d = c.createNSResolver(c.documentElement), c = c.evaluate(b, a, d, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), d = [], e = c.snapshotLength, f = 0;f < e;f++) {
      d.push(c.snapshotItem(f))
    }
    return d
  }
  return[]
};
goog.dom.xml.setAttributes = function(a, b) {
  for(var c in b) {
    b.hasOwnProperty(c) && a.setAttribute(c, b[c])
  }
};
goog.dom.xml.createMsXmlDocument_ = function() {
  var a = new ActiveXObject("MSXML2.DOMDocument");
  if(a) {
    a.resolveExternals = !1;
    a.validateOnParse = !1;
    try {
      a.setProperty("ProhibitDTD", !0), a.setProperty("MaxXMLSize", goog.dom.xml.MAX_XML_SIZE_KB), a.setProperty("MaxElementDepth", goog.dom.xml.MAX_ELEMENT_DEPTH)
    }catch(b) {
    }
  }
  return a
};
lime.parser = {};
lime.parser.ZWOPTEX = function() {
  function a(a) {
    var d = {}, e = b(a, "key");
    for(a = 0;a < e.length;a++) {
      d[e[a].firstChild.nodeValue] = goog.dom.getNextElementSibling(e[a])
    }
    return d
  }
  function b(a, b) {
    var e, f = [];
    for(e = 0;e < a.childNodes.length;e++) {
      a.childNodes[e].nodeName == b && f.push(a.childNodes[e])
    }
    return f
  }
  return function(c) {
    var d = {};
    c = goog.dom.xml.loadXml(c);
    c = b(b(c, "plist")[1], "dict")[0];
    c = a(c);
    c = a(c.frames);
    for(var e in c) {
      var f = a(c[e]);
      f.getValue = function(a) {
        return parseFloat(f[a].firstChild.nodeValue)
      };
      var g = f.getValue("originalWidth"), h = f.getValue("originalHeight"), k = f.getValue("width"), l = f.getValue("height"), p = (g - k) / 2 + f.getValue("offsetX"), m = (h - l) / 2 + f.getValue("offsetY");
      d[e] = [new goog.math.Rect(f.getValue("x"), f.getValue("y"), k, l), new goog.math.Vec2(p, m), new goog.math.Size(g, h), !1]
    }
    return d
  }
}();
lime.SpriteSheet = function(a, b, c) {
  this.image_ = new lime.fill.Image(a);
  !goog.isDef(c) && (goog.DEBUG && goog.global.console && goog.global.console.warn) && goog.global.console.warn("DEPRECATED: SpriteSheet 3rd parser parameter is now required.");
  a = c || lime.parser.ZWOPTEX;
  b = b.data ? b.data() : b;
  this.metadata_ = a(b)
};
lime.SpriteSheet.prototype.getFrame = function(a) {
  var b = this.metadata_[a];
  if(!b) {
    throw"Frame " + a + " not found in the spritesheet";
  }
  return new lime.fill.Frame(this.image_.image_, b[0], b[1], b[2], b[3])
};
lime.SpriteSheet.prototype.hasFrame = function(a) {
  return goog.isDef(this.metadata_[a])
};
lime.Renderer.CANVAS.CIRCLE = {};
lime.Renderer.DOM.CIRCLE = {};
lime.Circle = function() {
  lime.Sprite.call(this)
};
goog.inherits(lime.Circle, lime.Sprite);
lime.Circle.prototype.id = "circle";
lime.Circle.prototype.supportedRenderers = [lime.Renderer.DOM.SPRITE.makeSubRenderer(lime.Renderer.DOM.CIRCLE), lime.Renderer.CANVAS.SPRITE.makeSubRenderer(lime.Renderer.CANVAS.CIRCLE)];
lime.Circle.prototype.hitTest = function(a) {
  var b = this.screenToLocal(a.screenPosition), c = this.size_, d = this.anchorPoint_, e = 0.5 * c.width, f = 0.5 * c.height, g = b.x - c.width * (0.5 - d.x), c = b.y - c.height * (0.5 - d.y);
  return 1 > g * g / (e * e) + c * c / (f * f) ? (a.position = b, !0) : !1
};
lime.Renderer.DOM.CIRCLE.draw = function(a) {
  var b = this.getSize();
  lime.Renderer.DOM.SPRITE.draw.call(this, a);
  lime.style.setBorderRadius(a, 0.5 * b.width, 0.5 * b.height)
};
lime.Renderer.CANVAS.CIRCLE.draw = function(a) {
  this.getSize();
  var b = this.getAnchorPoint(), c = this.getFrame(), d = 0.5 * (c.right - c.left), c = 0.5 * (c.bottom - c.top);
  a.save();
  a.save();
  a.scale(d, c);
  a.translate(1 - 2 * b.x, 1 - 2 * b.y);
  a.beginPath();
  a.arc(0, 0, 1, 0, 2 * Math.PI, !1);
  a.closePath();
  a.restore();
  a.clip();
  lime.Renderer.CANVAS.SPRITE.draw.call(this, a);
  this.stroke_ && (a.lineWidth *= 2, a.stroke());
  a.restore()
};
lime.Scene = function() {
  lime.Node.call(this);
  this.setAnchorPoint(0, 0);
  this.domClassName = "lime-scene"
};
goog.inherits(lime.Scene, lime.Node);
lime.Scene.prototype.getScene = function() {
  return this
};
lime.Scene.prototype.measureContents = function() {
  return this.getFrame()
};
lime.animation.MoveTo = function(a, b) {
  lime.animation.Animation.call(this);
  this.position_ = 2 == arguments.length ? new goog.math.Coordinate(arguments[0], arguments[1]) : a
};
goog.inherits(lime.animation.MoveTo, lime.animation.Animation);
lime.animation.MoveTo.prototype.scope = "move";
lime.animation.MoveTo.prototype.setSpeed = function(a) {
  this.speed_ = a;
  delete this.speedCalcDone_;
  return this
};
lime.animation.MoveTo.prototype.makeTargetProp = function(a) {
  var b = a.getPosition(), c = new goog.math.Coordinate(this.position_.x - b.x, this.position_.y - b.y);
  this.useTransitions() && (a.addTransition(lime.Transition.POSITION, this.position_, this.duration_, this.getEasing()), a.setDirty(lime.Dirty.POSITION));
  return{startpos:b, delta:c}
};
lime.animation.MoveTo.prototype.calcDurationFromSpeed_ = function() {
  if(this.speed_ && this.targets.length) {
    var a = this.targets[0].getPosition(), a = new goog.math.Coordinate(this.position_.x - a.x, this.position_.y - a.y);
    this.setDuration(this.speed_ * goog.math.Coordinate.distance(a, new goog.math.Coordinate(0, 0)) / 100);
    this.speedCalcDone_ = 1
  }
};
lime.animation.MoveTo.prototype.update = function(a, b) {
  if(0 != this.status_) {
    var c = this.getTargetProp(b);
    b.setPosition(c.startpos.x + c.delta.x * a, c.startpos.y + c.delta.y * a)
  }
};
lime.animation.MoveTo.prototype.clearTransition = function(a) {
  this.useTransitions() && (a.clearTransition(lime.Transition.POSITION), a.setDirty(lime.Dirty.POSITION))
};
lime.CoverNode = function() {
  lime.Node.call(this);
  var a = this.baseElement;
  this.baseElement = document.createElement("canvas");
  goog.dom.replaceNode(this.baseElement, a);
  this.context = this.baseElement.getContext("2d");
  goog.dom.classes.add(this.baseElement, "lime-cover")
};
goog.inherits(lime.CoverNode, lime.Node);
lime.CoverNode.prototype.update = function() {
  if(this.director) {
    var a = goog.style.getSize(this.director.baseElement.parentNode), b = this.baseElement.style, c = this.director.getScale();
    b.width = a.width + "px";
    b.height = a.height + "px";
    this.baseElement.width = a.width / c.x;
    this.baseElement.height = a.height / c.y;
    this.updateRect_ ? this.setNeedsRedrawInRect(this.updateRect_) : this.setNeedsRedraw()
  }
};
lime.CoverNode.prototype.setNeedsRedraw = function() {
  var a = new goog.math.Box(0, this.baseElement.width / this.getQuality(), this.baseElement.height / this.getQuality(), 0);
  this.setNeedsRedrawInRect(this.director.getBounds(a))
};
lime.CoverNode.prototype.setNeedsRedrawInRect = function(a) {
  var b = this.director, c = b.getScale(), b = b.getPosition();
  this.context.save();
  this.context.translate(b.x / c.x, b.y / c.y);
  this.drawInRect(a);
  this.context.restore()
};
lime.helper = {};
lime.helper.PauseScene = function() {
  lime.Scene.call(this);
  this.domElement.style.cssText = "background:rgba(255,255,255,.8)"
};
goog.inherits(lime.helper.PauseScene, lime.Scene);
lime.events = {};
lime.events.Drag = function(a, b, c, d) {
  goog.events.EventTarget.call(this);
  this.target = d || a.targetObject;
  this.dropTargets_ = [];
  this.dropIndex_ = -1;
  this.y = this.x = 0;
  b || (b = this.target.localToScreen(new goog.math.Coordinate(0, 0)), this.x = a.screenPosition.x - b.x, this.y = a.screenPosition.y - b.y);
  a.swallow(["touchmove", "mousemove"], goog.bind(this.moveHandler_, this));
  a.swallow(["touchend", "touchcancel", "mouseup"], goog.bind(this.releaseHandler_, this));
  this.setBounds(c || null);
  this.dispatchEvent(new goog.events.Event(lime.events.Drag.Event.START))
};
goog.inherits(lime.events.Drag, goog.events.EventTarget);
lime.events.Drag.Event = {START:"start", END:"end", MOVE:"move", CHANGE:"change", DROP:"drop", CANCEL:"cancel"};
lime.events.Drag.prototype.disposeInternal = function() {
  lime.events.Drag.superClass_.disposeInternal.call(this);
  this.dropTargets_ = this.target = this.event_ = null
};
lime.events.Drag.prototype.getBounds = function() {
  return this.bounds_
};
lime.events.Drag.prototype.setBounds = function(a) {
  this.bounds_ = a
};
lime.events.Drag.prototype.moveHandler_ = function(a) {
  a = a.screenPosition.clone();
  a.x -= this.x;
  a.y -= this.y;
  a = this.target.getParent().screenToLocal(a);
  var b = this.getBounds();
  goog.isDefAndNotNull(b) && (a.x < b.left ? a.x = b.left : a.x > b.right && (a.x = b.right), a.y < b.top ? a.y = b.top : a.y > b.bottom && (a.y = b.bottom));
  this.target.setPosition(a);
  this.dispatchEvent(new goog.events.Event(lime.events.Drag.Event.MOVE));
  a = -1;
  for(var b = goog.math.Rect.createFromBox(this.target.getFrame()), c = [], d = 0;d < this.dropTargets_.length;d++) {
    var e = this.dropTargets_[d];
    if(!goog.isFunction(e.confirmTargetActive) || e.confirmTargetActive(this.target)) {
      var f = e.getFrame(), g = e.localToNode(new goog.math.Coordinate(f.left, f.top), this.target), e = e.localToNode(new goog.math.Coordinate(f.right, f.bottom), this.target), g = goog.math.Rect.createFromBox(new goog.math.Box(Math.min(g.y, e.y), Math.max(g.x, e.x), Math.max(g.y, e.y), Math.min(e.x, g.x)));
      (e = goog.math.Rect.intersection(b, g)) && c.push([e.width * e.height / (g.width * g.height), d])
    }
  }
  c.length && (c = c.sort(function(a, b) {
    return b[0] - a[0]
  }), a = c[0][1]);
  a != this.dropIndex_ && (-1 != this.dropIndex_ && goog.isFunction(this.dropTargets_[this.dropIndex_].hideDropHighlight) && this.dropTargets_[this.dropIndex_].hideDropHighlight(), this.dropIndex_ = a, -1 != this.dropIndex_ && goog.isFunction(this.dropTargets_[this.dropIndex_].showDropHighlight) && this.dropTargets_[this.dropIndex_].showDropHighlight(), a = new goog.events.Event(lime.events.Drag.Event.CHANGE), a.activeDropTarget = -1 != this.dropIndex_ ? this.dropTargets_[this.dropIndex_] : null, 
  this.dispatchEvent(a))
};
lime.events.Drag.prototype.releaseHandler_ = function(a) {
  if(-1 != this.dropIndex_) {
    if(a = new goog.events.Event(lime.events.Drag.Event.DROP), a.activeDropTarget = this.dropTargets_[this.dropIndex_], goog.isFunction(a.activeDropTarget.showDropHighlight) && a.activeDropTarget.hideDropHighlight(), this.dispatchEvent(a), !a.propagationStopped_) {
      var b = a.activeDropTarget.getParent().localToNode(a.activeDropTarget.getPosition(), this.target.getParent()), b = (new lime.animation.MoveTo(b)).setDuration(0.5).enableOptimizations();
      this.target.runAction(b);
      goog.isFunction(a.moveEndedCallback) && goog.events.listen(b, lime.animation.Event.STOP, a.moveEndedCallback, !1, this.target)
    }
  }else {
    this.dispatchEvent(new goog.events.Event(lime.events.Drag.Event.CANCEL))
  }
  this.dispatchEvent(new goog.events.Event(lime.events.Drag.Event.END));
  lime.scheduleManager.callAfter(this.dispose, this, 100)
};
lime.events.Drag.prototype.addDropTarget = function(a) {
  this.dropTargets_.push(a)
};
lime.events.Event = function(a) {
  this.dispatcher_ = a;
  this.identifier = 0
};
lime.events.Event.prototype.swallow = function(a, b, c) {
  a = goog.isArray(a) ? a : [a];
  for(var d = 0;d < a.length;d++) {
    this.dispatcher_.swallow(this, a[d], b)
  }
  c && this.event.stopPropagation()
};
lime.events.Event.prototype.release = function(a) {
  var b = goog.isDef(a), c = goog.isArray(a) ? a : [a];
  if(a = this.dispatcher_.swallows[this.identifier]) {
    var d = this;
    a = goog.array.filter(a, function(a) {
      return!goog.isDef(d.targetObject) || a[0] == d.targetObject && (!b || goog.array.contains(c, a[1])) ? (goog.events.unlisten(a[0], a[1], a[2]), !1) : !0
    });
    a.length ? this.dispatcher_.swallows[this.identifier] = a : delete this.dispatcher_.swallows[this.identifier]
  }
};
lime.events.Event.prototype.startDrag = function(a, b, c) {
  return new lime.events.Drag(this, a, b, c)
};
lime.events.Event.prototype.clone = function() {
  var a = new lime.events.Event(this.dispatcher_);
  goog.object.extend(a, this);
  return a
};
lime.events.EventDispatcher = function(a) {
  this.director = a;
  this.handlers = {};
  this.swallows = {}
};
lime.events.EventDispatcher.prototype.register = function(a, b) {
  goog.isDef(this.handlers[b]) ? goog.array.contains(this.handlers[b], a) || (this.handlers[b].push(a), this.handlers[b].sorted = !1) : (this.handlers[b] = [a], this.handlers[b].sorted = !0, goog.events.listen("touch" == b.substring(0, 5) && a != this.director ? document : "key" == b.substring(0, 3) ? window : this.director.container, b, this, !1, this))
};
lime.events.EventDispatcher.prototype.release = function(a, b) {
  goog.isDef(this.handlers[b]) && (goog.array.remove(this.handlers[b], a), this.handlers[b].length || (goog.events.unlisten(this.director.container, b, this, !1, this), delete this.handlers[b]))
};
lime.events.EventDispatcher.prototype.updateDispatchOrder = function(a) {
  for(var b in this.handlers) {
    var c = this.handlers[b];
    goog.array.contains(c, a) && (c.sorted = !1)
  }
};
lime.events.EventDispatcher.prototype.swallow = function(a, b, c) {
  var d = a.identifier;
  goog.isDef(this.swallows[d]) || (this.swallows[d] = []);
  this.swallows[d].push([a.targetObject, b, c]);
  goog.events.listen(a.targetObject, b, goog.nullFunction)
};
lime.events.EventDispatcher.prototype.handleEvent = function(a) {
  if(goog.isDef(this.handlers[a.type])) {
    this.handlers[a.type].sorted || (this.handlers[a.type].sort(lime.Node.compareNode), this.handlers[a.type].sorted = !0);
    for(var b = this.handlers[a.type].slice(), c = !1, d = 0, e = 0;!e;) {
      var f = new lime.events.Event(this);
      f.type = a.type;
      f.event = a;
      if("touch" == a.type.substring(0, 5)) {
        var g = a.getBrowserEvent().changedTouches[d];
        f.screenPosition = new goog.math.Coordinate(g.pageX, g.pageY);
        f.identifier = g.identifier;
        d++;
        d >= a.getBrowserEvent().changedTouches.length && (e = 1)
      }else {
        f.screenPosition = new goog.math.Coordinate(a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, a.clientY + document.body.scrollTop + document.documentElement.scrollTop), e = 1
      }
      if(goog.isDef(this.swallows[f.identifier])) {
        for(var g = this.swallows[f.identifier], h = 0;h < g.length;h++) {
          if(g[h][1] == a.type || goog.isArray(g[h][1]) && goog.array.contains(g[h][1], a.type)) {
            var k = g[h][0];
            f.targetObject = k;
            f.position = k.screenToLocal(f.screenPosition);
            g[h][2].call(k, f);
            c = !0
          }
        }
        if("touchend" == a.type || "touchcancel" == a.type || "mouseup" == a.type || "keyup" == a.type) {
          delete f.targetObject, f.release()
        }
      }else {
        for(h = 0;h < b.length;h++) {
          if(k = b[h], !(this.director.getCurrentScene() != k.getScene() && k != this.director) && (!k.getHidden() && k.inTree_) && (f.targetObject = k, k.hitTest(f) || "key" == a.type.substring(0, 3))) {
            if(f.targetObject = k, k.dispatchEvent(f), c = !0, f.event.propagationStopped_) {
              break
            }
          }
        }
      }
    }
    c && a.preventDefault()
  }
};
goog.dom.ViewportSizeMonitor = function(a) {
  goog.events.EventTarget.call(this);
  this.window_ = a || window;
  this.listenerKey_ = goog.events.listen(this.window_, goog.events.EventType.RESIZE, this.handleResize_, !1, this);
  this.size_ = goog.dom.getViewportSize(this.window_)
};
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget);
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(a) {
  a = a || window;
  var b = goog.getUid(a);
  return goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] = goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] || new goog.dom.ViewportSizeMonitor(a)
};
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(a) {
  a = goog.getUid(a || window);
  goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]);
  delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]
};
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {};
goog.dom.ViewportSizeMonitor.prototype.listenerKey_ = null;
goog.dom.ViewportSizeMonitor.prototype.window_ = null;
goog.dom.ViewportSizeMonitor.prototype.size_ = null;
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
  return this.size_ ? this.size_.clone() : null
};
goog.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
  goog.dom.ViewportSizeMonitor.superClass_.disposeInternal.call(this);
  this.listenerKey_ && (goog.events.unlistenByKey(this.listenerKey_), this.listenerKey_ = null);
  this.size_ = this.window_ = null
};
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(a) {
  a = goog.dom.getViewportSize(this.window_);
  goog.math.Size.equals(a, this.size_) || (this.size_ = a, this.dispatchEvent(goog.events.EventType.RESIZE))
};
lime.transitions = {};
lime.transitions.Transition = function(a, b) {
  goog.events.EventTarget.call(this);
  this.duration_ = 1;
  this.outgoing_ = a;
  this.incoming_ = b;
  this.finished_ = !1
};
goog.inherits(lime.transitions.Transition, goog.events.EventTarget);
lime.transitions.Transition.prototype.getDuration = function() {
  return this.duration_
};
lime.transitions.Transition.prototype.setDuration = function(a) {
  this.duration_ = a;
  return this
};
lime.transitions.Transition.prototype.setFinishCallback = function(a) {
  goog.DEBUG && (console && console.warn) && console.warn("Transition.prototype.setFinishCallback() is deprecated. Use event listeners.");
  return this
};
lime.transitions.Transition.prototype.start = function() {
  this.incoming_.setPosition(new goog.math.Coordinate(0, 0));
  this.incoming_.setHidden(!1);
  this.finish()
};
lime.transitions.Transition.prototype.finish = function() {
  this.dispatchEvent(new goog.events.Event("end"));
  this.finished_ = !0
};
lime.Director = function(a, b, c) {
  lime.Node.call(this);
  this.container = a;
  this.inTree_ = !0;
  this.setAnchorPoint(0, 0);
  this.sceneStack_ = [];
  this.coverStack_ = [];
  this.domClassName = "lime-director";
  a.getContext && (this.container.tagName || (this.container.tagName = "CANVAS"), this.setRenderer(lime.Renderer.CANVAS), this.domElement = this.container);
  this.updateDomElement();
  this.domElement && this.domElement !== this.container && a.appendChild(this.domElement);
  goog.userAgent.WEBKIT && goog.userAgent.MOBILE && (this.coverElementBelow = document.createElement("div"), goog.dom.classes.add(this.coverElementBelow, "lime-cover-below"), goog.dom.insertSiblingBefore(this.coverElementBelow, this.domElement), this.coverElementAbove = document.createElement("div"), goog.dom.classes.add(this.coverElementAbove, "lime-cover-above"), goog.dom.insertSiblingAfter(this.coverElementAbove, this.domElement));
  "absolute" != a.style.position && (a.style.position = "relative");
  a.style.overflow = "hidden";
  if(a == document.body) {
    goog.style.installStyles("html,body{margin:0;padding:0;height:100%;}");
    var d = document.createElement("meta");
    d.name = "viewport";
    var e = "initial-scale=1.0,minimum-scale=1,maximum-scale=1.0,user-scalable=no";
    /android/i.test(navigator.userAgent) && (e += ",target-densityDpi=device-dpi");
    d.content = e;
    document.getElementsByTagName("head").item(0).appendChild(d);
    if(goog.userAgent.MOBILE && !goog.global.navigator.standalone) {
      var f = this;
      setTimeout(function() {
        window.scrollTo(0, 0);
        f.invalidateSize_()
      }, 100)
    }
  }
  var g, h = goog.style.getSize(a);
  this.setSize(new goog.math.Size(g = b || h.width || lime.Director.DEFAULT_WIDTH, c || h.height * g / h.width || lime.Director.DEFAULT_HEIGHT));
  this.setDisplayFPS(goog.DEBUG);
  this.setPaused(!1);
  b = new goog.dom.ViewportSizeMonitor;
  goog.events.listen(b, goog.events.EventType.RESIZE, this.invalidateSize_, !1, this);
  goog.events.listen(goog.global, "orientationchange", this.invalidateSize_, !1, this);
  lime.scheduleManager.schedule(this.step_, this);
  this.container === this.domElement && lime.scheduleManager.schedule(function() {
    var b = goog.style.getSize(a);
    if(b.width !== h.width || b.height !== h.height) {
      this.invalidateSize_(), h = b
    }
  }, this);
  this.eventDispatcher = new lime.events.EventDispatcher(this);
  goog.events.listen(this, ["touchmove", "touchstart"], function(a) {
    a.event.preventDefault()
  }, !1, this);
  goog.events.listen(this, ["mouseup", "touchend", "mouseout", "touchcancel"], function() {
  }, !1);
  this.invalidateSize_();
  goog.DEBUG && goog.events.listen(goog.global, "keyup", this.keyUpHandler_, !1, this)
};
goog.inherits(lime.Director, lime.Node);
lime.Director.FPS_INTERVAL = 100;
lime.Director.DEFAULT_WIDTH = 400;
lime.Director.DEFAULT_HEIGHT = 400;
lime.Director.prototype.isPaused = function() {
  return this.isPaused_
};
lime.Director.prototype.setPaused = function(a) {
  this.isPaused_ != a && (this.isPaused_ = a, lime.scheduleManager.changeDirectorActivity(this, !a), this.isPaused_ ? (this.pauseScene = new (this.pauseClassFactory || lime.helper.PauseScene), this.pushScene(this.pauseScene)) : this.pauseScene && (this.popScene(), delete this.pauseScene));
  return this
};
lime.Director.prototype.isDisplayFPS = function() {
  return this.displayFPS_
};
lime.Director.prototype.setDisplayFPS = function(a) {
  if(this.displayFPS_ && !a) {
    goog.dom.removeNode(this.fpsElement_)
  }else {
    if(!this.displayFPS_ && a) {
      this.accumDt_ = this.frames_ = 0;
      if(!lime.dom.isDOMSupported()) {
        return
      }
      this.fpsElement_ = goog.dom.createDom("div");
      goog.dom.classes.add(this.fpsElement_, "lime-fps");
      this.domElement.parentNode.appendChild(this.fpsElement_)
    }
  }
  this.displayFPS_ = a;
  return this
};
lime.Director.prototype.getCurrentScene = function() {
  return this.sceneStack_.length ? this.sceneStack_[this.sceneStack_.length - 1] : null
};
lime.Director.prototype.getDirector = function() {
  return this
};
lime.Director.prototype.getScene = function() {
  return null
};
lime.Director.prototype.step_ = function(a) {
  this.isDisplayFPS() && (this.frames_++, this.accumDt_ += a, this.accumDt_ > lime.Director.FPS_INTERVAL && (this.fps = 1E3 * this.frames_ / this.accumDt_, goog.dom.setTextContent(this.fpsElement_, this.fps.toFixed(2)), this.accumDt_ = this.frames_ = 0));
  lime.updateDirtyObjects()
};
lime.Director.prototype.replaceScene = function(a, b, c) {
  a.setSize(this.getSize().clone());
  b = b || lime.transitions.Transition;
  var d = null;
  this.sceneStack_.length && (d = this.sceneStack_[this.sceneStack_.length - 1]);
  for(var e = [], f = this.sceneStack_.length;0 <= --f;) {
    e.push(this.sceneStack_[f])
  }
  this.sceneStack_.length = 0;
  this.sceneStack_.push(a);
  this.appendChild(a);
  a = new b(d, a);
  goog.events.listenOnce(a, "end", function() {
    for(var a = e.length;0 <= --a;) {
      this.removeChild(e[a])
    }
    e.length = 0
  }, !1, this);
  goog.isDef(c) && a.setDuration(c);
  a.start();
  return a
};
lime.Director.prototype.pushScene = function(a, b, c) {
  var d;
  a.setSize(this.getSize().clone());
  goog.isDef(b) && this.sceneStack_.length && (d = this.sceneStack_[this.sceneStack_.length - 1], d = new b(d, a), goog.isDef(c) && d.setDuration(c), a.domElement.style.display = "none");
  this.sceneStack_.push(a);
  this.appendChild(a);
  if(d) {
    return d.start(), d
  }
};
lime.Director.prototype.popScene = function(a, b) {
  var c, d = this.getCurrentScene();
  if(!goog.isNull(d)) {
    var e = function() {
      this.removeChild(d);
      this.sceneStack_.pop();
      d = null
    };
    goog.isDef(a) && 1 < this.sceneStack_.length ? (c = new a(d, this.sceneStack_[this.sceneStack_.length - 2]), goog.isDef(b) && c.setDuration(b), goog.events.listenOnce(c, "end", e, !1, this)) : e.call(this);
    if(c) {
      return c.start(), c
    }
  }
};
lime.Director.prototype.addCover = function(a, b) {
  goog.userAgent.WEBKIT && goog.userAgent.MOBILE ? b ? this.coverElementAbove.appendChild(a.domElement) : this.coverElementBelow.appendChild(a.domElement) : b ? goog.dom.insertSiblingAfter(a.domElement, this.domElement) : goog.dom.insertSiblingBefore(a.domElement, this.domElement);
  a.director = this;
  this.coverStack_.push(a)
};
lime.Director.prototype.removeCover = function(a) {
  goog.array.remove(this.coverStack_, a);
  goog.dom.removeNode(a.domElement)
};
lime.Director.prototype.getBounds = function(a) {
  var b = this.getPosition(), c = this.getScale();
  return new goog.math.Box(a.top - b.y / c.y, a.right - b.x / c.x, a.bottom - b.y / c.y, a.left - b.x / c.x)
};
lime.Director.prototype.screenToLocal = function(a) {
  a = a.clone();
  a.x -= this.domOffset.x + this.position_.x;
  a.y -= this.domOffset.y + this.position_.y;
  a.x /= this.scale_.x;
  a.y /= this.scale_.y;
  return a
};
lime.Director.prototype.localToScreen = function(a) {
  a = a.clone();
  a.x *= this.scale_.x;
  a.y *= this.scale_.y;
  a.x += this.domOffset.x + this.position_.x;
  a.y += this.domOffset.y + this.position_.y;
  return a
};
lime.Director.prototype.measureContents = function() {
  return this.getFrame()
};
lime.Director.prototype.update = function() {
  lime.Node.prototype.update.apply(this, arguments);
  for(var a = this.coverStack_.length;0 <= --a;) {
    this.coverStack_[a].update()
  }
};
lime.Director.prototype.invalidateSize_ = function() {
  var a = goog.style.getSize(this.container);
  this.container == document.body && (window.scrollTo(0, 0), goog.isNumber(window.innerHeight) && (a.height = window.innerHeight));
  var b = this.getSize().clone().scaleToFit(a), c = b.width / this.getSize().width;
  this.setScale(c);
  a.aspectRatio() < b.aspectRatio() ? this.setPosition(0, (a.height - b.height) / 2) : this.setPosition((a.width - b.width) / 2, 0);
  this.updateDomOffset_();
  goog.userAgent.MOBILE && this.domElement.parentNode == document.body && (this.overflowStyle_ && goog.style.uninstallStyles(this.overflowStyle_), this.overflowStyle_ = goog.style.installStyles("html{height:" + (a.height + 120) + "px;overflow:hidden;}"))
};
lime.Director.prototype.makeMobileWebAppCapable = function() {
  if(lime.dom.isDOMSupported()) {
    var a = document.createElement("meta");
    a.name = "apple-mobile-web-app-capable";
    a.content = "yes";
    document.getElementsByTagName("head").item(0).appendChild(a);
    a = document.createElement("meta");
    a.name = "apple-mobile-web-app-status-bar-style";
    a.content = "black";
    document.getElementsByTagName("head").item(0).appendChild(a);
    a = !1;
    goog.isDef(localStorage) && (a = localStorage.getItem("_lime_visited"));
    /(ipod|iphone|ipad)/i.test(navigator.userAgent) && (!window.navigator.standalone && COMPILED && !a && this.domElement.parentNode == document.body) && (alert("Please install this page as a web app by clicking Share + Add to home screen."), goog.isDef(localStorage) && localStorage.setItem("_lime_visited", !0))
  }
};
lime.Director.prototype.updateDomOffset_ = function() {
  this.domOffset = goog.style.getPageOffset(this.container)
};
lime.Director.prototype.keyUpHandler_ = function(a) {
  a.altKey && "d" == String.fromCharCode(a.keyCode).toLowerCase() && (this.debugModeOn_ ? (goog.style.uninstallStyles(this.debugModeOn_), this.debugModeOn_ = null) : this.debugModeOn_ = goog.style.installStyles(".lime-scene div,.lime-scene img,.lime-scene canvas{border: 1px solid #c00;}"), a.stopPropagation(), a.preventDefault())
};
lime.Director.prototype.hitTest = function(a) {
  a && a.screenPosition && (a.position = this.screenToLocal(a.screenPosition));
  return!0
};
var helloworld = {scene:null, drawDelegate:function() {
  helloworld.scene.setDirty(lime.Dirty.CONTENT)
}, start:function() {
  console.log("helloworld.start");
  lime.Renderer.CANVAS.CLEAR_COLOR = "#1c6aa1";
  var a = document.getElementById("canvas");
  window.canvas && (console.log("canvas exists"), window.canvas.tagName && console.log("canvas original tagname is " + window.canvas.tagName), window.canvas.tagName = "canvas", window.canvas.tagName && console.log("canvas changed tagname is " + window.canvas.tagName), window.canvas.style = {position:"absolute"}, window.canvas.offsetWidth = 1080, window.canvas.offsetHeight = 1776);
  a = new lime.Director(window.canvas || a, 1080, 1776);
  helloworld.scene = scene = new lime.Scene;
  var b = (new lime.Layer).setPosition(100, 100), c = (new lime.Circle).setSize(100, 100).setFill(255, 150, 0), d = (new lime.Sprite).setPosition(200, 200).setFill("button.png");
  b.appendChild(c);
  b.appendChild(d);
  scene.appendChild(b);
  goog.events.listen(b, ["mousedown", "touchstart"], function(a) {
    console.log("in my touchstart fn");
    b.runAction(new lime.animation.Spawn((new lime.animation.FadeTo(0.5)).setDuration(0.2), (new lime.animation.ScaleTo(1.5)).setDuration(0.8)));
    console.log("touchstart");
    a.startDrag();
    a.swallow(["mouseup", "touchend"], function() {
      b.runAction(new lime.animation.Spawn(new lime.animation.FadeTo(1), new lime.animation.ScaleTo(1), new lime.animation.MoveTo(500, 300)));
      console.log("touchend")
    })
  });
  a.replaceScene(scene);
  window.ejecta.setDrawDelegate(helloworld.drawDelegate)
}};
goog.exportSymbol("helloworld.start", helloworld.start);
helloworld.start();

