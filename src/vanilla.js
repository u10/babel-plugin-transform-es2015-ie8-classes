/**
 * override 原插件的run方法，在只有一个constructor的情况下，修改命名函数表达式名称
 * @autor calefy<clfsw0201@gmail.com>
 * @since 2016-03-08
 */
import * as t from 'babel-types';
import ClassTransformer from 'babel-plugin-transform-es2015-classes/lib/vanilla';

class Transformer extends ClassTransformer {
    constructor(path, file) {
        super(path, file);
    }

    run() {
        let superName = this.superName;
        let file      = this.file;
        let body      = this.body;

        //

        let constructorBody = this.constructorBody = t.blockStatement([]);
        this.constructor    = this.buildConstructor();

        //

        let closureParams = [];
        let closureArgs = [];

        //
        if (this.isDerived) {
          closureArgs.push(superName);

          superName = this.scope.generateUidIdentifierBasedOnNode(superName);
          closureParams.push(superName);

          this.superName = superName;
        }

        //
        this.buildBody();

        // make sure this class isn't directly called
        constructorBody.body.unshift(t.expressionStatement(t.callExpression(file.addHelper("classCallCheck"), [
          t.thisExpression(),
          this.classRef
        ])));

        body = body.concat(this.staticPropBody.map((fn) => fn(this.classRef)));

        if (this.classId) {
          // named class with only a constructor
          // run方法中仅有这里做了修改
          if (body.length === 1) {
            body[0].id = this.scope.generateUidIdentifier(body[0].id.name);
            return t.toExpression(body[0]);
          }
        }

        //
        body.push(t.returnStatement(this.classRef));

        let container = t.functionExpression(null, closureParams, t.blockStatement(body));
        container.shadow = true;
        return t.callExpression(container, closureArgs);
    }
}

module.exports = Transformer;
