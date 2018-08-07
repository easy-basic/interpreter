export class LetStatement {

    constructor() {
        this.type_dict = {
            'string': 0,
            'number': 1,
            'object': 2
        }
    }

    execute(statement, runtime) {
        var ident = statement.params.ident;
        var val = runtime.expr_evaluator.evaluate(statement.params.val, runtime)
        var var_type = this.type_dict[typeof val];

        runtime.var_manager.register(ident, val, var_type)
    }
}