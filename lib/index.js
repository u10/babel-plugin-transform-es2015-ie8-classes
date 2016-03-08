"use strict";

exports.__esModule = true;

exports.default = function (_ref) {
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

        var Constructor = _transformer2.default;
        if (state.opts.loose) Constructor = _loose2.default;

        path.replaceWith(new Constructor(path, state.file).run());
      }
    }
  };
};

var _loose = require("babel-plugin-transform-es2015-classes/lib/loose");

var _loose2 = _interopRequireDefault(_loose);

var _transformer = require("./transformer");

var _transformer2 = _interopRequireDefault(_transformer);

var _babelHelperFunctionName = require("babel-plugin-transform-es2015-classes/node_modules/babel-helper-function-name");

var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }