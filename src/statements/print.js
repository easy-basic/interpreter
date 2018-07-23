export default class PrintStatement {

    constructor(terminal){
        this.terminal = terminal;
    }

    execute(statement, runtime) {
        this.runtime = runtime;
        var format = statement.format && statement.format.length && statement.format[0] || '';
        var exprs = Array.isArray(statement.params.exprs)
                    ? statement.params.exprs
                    : [statement.params.exprs];

        for (var expr of exprs) {
            var out = this.formateExpr(format, expr, runtime);
            this.terminal.write(`${out}\n`);
        }
    }

    formateExpr(format, expr, runtime) {
        return runtime.expr_evaluator.evaluate(expr, runtime);
    }
}

