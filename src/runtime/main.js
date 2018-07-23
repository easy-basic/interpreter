import FunctionManager from '../functions/functions';
import VaribableManager from './variables';
import ExpressionEvaluator from './expression_evaluator';
import BasicParser from '../parser/basic_parser';

export default class Runtime{

    constructor(statements, operators){
        this.parser = new BasicParser(statements, operators);
        this.expr_evaluator = new ExpressionEvaluator();
        this.var_manager = new VaribableManager();

        this.statements = statements;
        this.operators = operators;
        this.fn_manager = new FunctionManager();
    }

    execute(code){
        var tree = this.parser.parse(code);
        console.log(tree);
        for(var line of tree){
            this._executeLine(line);
        }
    }

    _executeLine(line){
        for(var statement of line.statements){
            var interpreter = this.statements.get(statement.statement);
            if(!interpreter){
                throw `Statement ${statement.statement} not registered`;
            }
            interpreter.execute(statement, this);
        }
    }
}