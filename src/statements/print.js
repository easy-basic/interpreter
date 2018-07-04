export default class PrintStatment{
    constructor(){

    }

    execute(statement, runtime){
        var format = statement.format && statement.format.length && statement.format[0] || '';
        var exprs = statement.exprs;
        for(var expr of exprs){
            var out = this.formateExpr(format, expr);
            console.log(out);
        }
    }

    formateExpr(format, expr){
        
    }
}