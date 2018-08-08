export default class VaribableManager {
    constructor() {
        this.var_types = {
            STR: 0,
            NUM: 1,
            ARR: 2,
            BOL: 3
        }

        this.builtin = {
            'E': { val: Math.E, type: this.var_types.NUM },
            'PI': { val: Math.PI, type: this.var_types.NUM },
            'TRUE': { val: true, type: this.var_types.NUM },
            'FALSE': { val: false, type: this.var_types.NUM },
        }
        this.var_dict = this.builtin;
    }

    clear() {
        this.var_dict = this.builtin;
    }

    get(name) {
        return this.var_dict[name]
    }

    register(name, val) {
        this.var_dict[name] = val;
    }
}