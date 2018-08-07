import FunctionManager from '../functions/functions';
import VaribableManager from './variables';
import ExpressionEvaluator from './expression_evaluator';
import BasicParser from '../parser/main';
import LoopManager from './loop_manager';

export default class Runtime {

    constructor(statements, operators) {
        this.parser = new BasicParser(statements, operators);
        this.expr_evaluator = new ExpressionEvaluator();
        this.var_manager = new VaribableManager();

        this.statements = statements;
        this.operators = operators;
        this.fn_manager = new FunctionManager();
        this.loop_man = new LoopManager();
    }

    execute(code) {
        var tree = this.parser.parse(code);
        console.log(tree);

        var i = 0;
        while (i < tree.length) {
            i = this._executeStatement(tree[i], i);
        }
    }

    _executeStatement(statement, index) {
        var next;
        var interpreter = this.statements.get(statement.statement);

        if (!interpreter) {
            throw `Statement ${statement.statement} not registered`;
        }
        next = interpreter.execute(statement, this, index);

        if(next)
            return next;
        return ++index;
    }
}