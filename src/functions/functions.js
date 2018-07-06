import buildBuiltin from './builtin'

export default class FunctionManager{

    constructor (){
        this.builtin = buildBuiltin();
        this.fn_dict = this.builtin;
    }

    clear(){
        this.fn_dict = this.builtin;
    }

    get(fn_name){
        return this.fn_dict[fn_name]
    }

    register(fn_name, fn){
        this.fn_dict[fn_name] = fn;
    }
}
