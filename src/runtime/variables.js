export default class VaribableManager {
    constructor() {
        this.var_types = {
            STR: 0,
            NUM: 1,
            ARR: 2,
        }

        this.builtin = {
            'E': { val: Math.E, type: this.var_types.NUM },
            'PI': { val: Math.PI, type: this.var_types.NUM }
        }
        this.var_dict = this.builtin;
    }

    clear() {
        this.var_dict = this.builtin;
    }

    get(name) {
        return this.var_dict[name]
    }

    register(name, val, type) {
        this.var_dict[name] = {
            val: val,
            type: type
        };
    }
}