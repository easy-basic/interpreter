export default class VaribableManager{
    constructor (){
        this.var_dict = {};
    }

    clear(){
        this.var_dict = {}
    }

    get(name){
        return this.var_dict[name]
    }

    register(name, val, type){
        this.var_dict[name] = {
            expr: val,
            type: type
        };
    }
}
