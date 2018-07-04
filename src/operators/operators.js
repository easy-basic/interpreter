export default class OperatorManager {
    constructor() {
        this.builtin_uniary = {
            '+': (inp) => inp,
            '-': (inp) => -inp,
            'NOT': (inp) => ~inp
        }
        this.builtin_binary = {
            "+": (inp1, inp2) => inp1 + inp2,
            "-": (inp1, inp2) => inp1 - inp2,
            "*": (inp1, inp2) => inp1 * inp2,
            "/": (inp1, inp2) => inp1 / inp2,
            "\\": (inp1, inp2) => parseInt(inp1 / inp2),
            "^": (inp1, inp2) => Math.pow(inp1, inp2),
            "<": (inp1, inp2) => inp1 < inp2,
            ">": (inp1, inp2) => inp1 > inp2,
            "==": (inp1, inp2) => inp1 == inp2,
            "<=": (inp1, inp2) => inp1 <= inp2,
            "=<": (inp1, inp2) => inp1 <= inp2,
            ">=": (inp1, inp2) => inp1 >= inp2,
            "=>": (inp1, inp2) => inp1 >= inp2,
            "<>": (inp1, inp2) => inp1 != inp2,
            "AND": (inp1, inp2) => inp1 && inp2,
            "OR": (inp1, inp2) => inp1 || inp2,
            "MOD": (inp1, inp2) => inp1 % inp2,
            "XOR": (inp1, inp2) => inp1 ^ inp2,
            "EQV": (inp1, inp2) => ~(inp1 ^ inp2),
            "IMP": (inp1, inp2) => ~inp1 ^ inp2,

        }
        this.uniary_dict = this.builtin_uniary;
        this.binary_dict = this.builtin_binary;
    }

    clear() {
        this.uniary_dict = this.builtin_uniary;
        this.binary_dict = this.builtin_binary;
    }

    get_uniary(name) {
        return this.uniary_dict[name];
    }

    get_binary(name) {
        return this.binary_dict[name];
    }

    register_uniary(name, op_function) {
        this.uniary_dict[name] = op_function;
    }

    register_binary(name, op_function) {
        this.binary_dict[name] = op_function;
    }
}
