"use strict";

var _loose = require("./loose");

var _loose2 = _interopRequireDefault(_loose);

var _vanilla = require("./vanilla");

var _vanilla2 = _interopRequireDefault(_vanilla);

var _babelHelperFunctionName = require("babel-helper-function-name");

var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ie8Plugin(_ref) {
  var t = _ref.types;

  // todo: investigate traversal requeueing
  var VISITED = Symbol();

  return {
    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;

        var node = path.node;

        var ref = node.declaration.id || path.scope.generateUidIdentifier("class");
        node.declaration.id = ref;

        // Split the class declaration and the export into two separate statements.
        path.replaceWith(node.declaration);
        path.insertAfter(t.exportDefaultDeclaration(ref));
      },
      ClassDeclaration: function ClassDeclaration(path) {
        var node = path.node;


        var ref = node.id || path.scope.generateUidIdentifier("class");

        path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]));
      },
      ClassExpression: function ClassExpression(path, state) {
        var node = path.node;

        if (node[VISITED]) return;

        var inferred = (0, _babelHelperFunctionName2.default)(path);
        if (inferred && inferred !== node) return path.replaceWith(inferred);

        node[VISITED] = true;

        var Constructor = _vanilla2.default;
        if (state.opts.loose) Constructor = _loose2.default;

        path.replaceWith(new Constructor(path, state.file).run());
      }
    }
  };
} /**
   * ES2015 Classes Transform [Adapt IE8]
   *
   * @author calefy<clfsw0201@gmail.com>
   * @since 2016-03-08
   */


module.exports = ie8Plugin;