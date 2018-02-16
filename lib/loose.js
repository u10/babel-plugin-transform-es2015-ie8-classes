"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _babelHelperFunctionName = require("babel-helper-function-name");

var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

var _vanilla = require("./vanilla");

var _vanilla2 = _interopRequireDefault(_vanilla);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * copy from es2015-classes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var LooseClassTransformer = function (_VanillaTransformer) {
  _inherits(LooseClassTransformer, _VanillaTransformer);

  function LooseClassTransformer() {
    _classCallCheck(this, LooseClassTransformer);

    var _this = _possibleConstructorReturn(this, (LooseClassTransformer.__proto__ || Object.getPrototypeOf(LooseClassTransformer)).apply(this, arguments));

    _this.isLoose = true;
    return _this;
  }

  _createClass(LooseClassTransformer, [{
    key: "_processMethod",
    value: function _processMethod(node, scope) {
      if (!node.decorators) {
        // use assignments instead of define properties for loose classes

        var classRef = this.classRef;
        if (!node.static) classRef = t.memberExpression(classRef, t.identifier("prototype"));
        var methodName = t.memberExpression(classRef, node.key, node.computed || t.isLiteral(node.key));

        var func = t.functionExpression(null, node.params, node.body, node.generator, node.async);
        var key = t.toComputedKey(node, node.key);
        if (t.isStringLiteral(key)) {
          func = (0, _babelHelperFunctionName2.default)({
            node: func,
            id: key,
            scope: scope
          });
        }

        var expr = t.expressionStatement(t.assignmentExpression("=", methodName, func));
        t.inheritsComments(expr, node);
        this.body.push(expr);
        return true;
      }
    }
  }]);

  return LooseClassTransformer;
}(_vanilla2.default);

module.exports = LooseClassTransformer;