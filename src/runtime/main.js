import FunctionManager from '../functions/functions';
import VaribableManager from './variables';
import StatementManager from '../statements/base'
import ExpressionEvaluator from './expression_evaluator';
import OperatorManager from '../operators/operators'

export default class Runtime{

    constructor(){
        this.statement_manager = new StatementManager();
        this.fn_manager = new FunctionManager();
        this.var_manager = new VaribableManager();
        this.op_manager = new OperatorManager();
        this.expr_evaluator = new ExpressionEvaluator();
    }

    execute(tree){
        for(var line of tree){
            this._executeLine(line);
        }
    }

    _executeLine(line){
        for(var statement of line.statements){
            var interpreter = this.statement_manager.get(statement.statement);
            if(!interpreter){
                throw `Statement ${statement.statement} not registered`;
            }
            interpreter.execute(statement, this);
        }
    }
}