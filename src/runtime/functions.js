export default class FunctionManager{

    constructor (){
        this.fn_dict = {};
    }

    clear(){
        this.fn_dict = {}
    }

    get(fn_name){
        return this.fn_dict[fn_name]
    }

    define(fn_name, fn_args, expression){
        this.fn_dict[fn_name] = Basicfunction(fn_name, fn_args, expression);
    }
}

class Basicfunction{

    constructor(fn_name, fn_args, expression){
        this.name = fn_name;
        this.args = fn_args;
        this.expression = new Expression(expression);
    }

    _zip_args(values){
        try{
            var zipped = this.args.reduce((obj, k, i) => ({...obj, [k]: values[i]}))
            return zipped;
        }
        catch(e){
            throw Error('')
        }
    }

    evaulate(args){
        var arg_dict = this._zip_args(args);
        return this.expression.evaulate(arg_dict);
    }
}