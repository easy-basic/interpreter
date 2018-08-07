export class ForStatement {
    execute(statement, runtime, index) {
        var ident = statement.params.ident;
        var start = runtime.expr_evaluator.evaluate(statement.params.start, runtime)
        var end = runtime.expr_evaluator.evaluate(statement.params.end, runtime)
        var step = runtime.expr_evaluator.evaluate(statement.params.step, runtime)

        // register loop variable wit start value
        runtime.var_manager.register(ident, start);

        runtime.loop_man.registerLoop('for', index, {
            'ident': ident,
            'start': start,
            'end': end,
            'step': step || 1
        })
    }
}

export class NextStatement{
    constructor(terminal){
        this.terminal = terminal;
    }

    execute(statement, runtime) {
        var loop = runtime.loop_man.getLastLoop('for');
        var next = runtime.var_manager.get(loop.params.ident) + loop.params.step;
        runtime.var_manager.register(loop.params.ident, next);

        if(next <= loop.params.end)
            return loop.index+1;
    }
}
