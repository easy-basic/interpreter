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

    register(fn_name, fn){
        this.fn_dict[fn_name] = fn;
    }
}
