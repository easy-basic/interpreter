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

    _getOps() {
        var uniary = Object.keys(this.uniary_dict);
        var binary = Object.keys(this.binary_dict);
        return uniary.concat(binary);
    }

    _getMaxOpLength() {
        var ops = this._getOps(), len = 0;
        ops.map((val) => {
            if (val.length > len) len = val.length;
        })
        return len;
    }

    isOp(text) {
        var ops = this._getOps();
        for (var i = this._getMaxOpLength(); i > 0; i--) {
            var chunk = text.slice(0, i);
            if (ops.indexOf(chunk) > -1) {
                return [i, chunk];
            }
        }
    }
}
