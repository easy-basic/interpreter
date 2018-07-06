export default function buildBuiltin() {
    var fn_dict = {};

    // Math functions
    fn_dict['FIX'] = Math.round; // TODO: enhance fix function
    fn_dict['INT'] = Math.floor;
    fn_dict['SGN'] = Math.sign;
    fn_dict['ABS'] = Math.abs;
    fn_dict['SQR'] = Math.sqrt;
    fn_dict['LOG'] = Math.log;
    fn_dict['EXP'] = Math.exp;
    fn_dict['SIN'] = Math.sin;
    fn_dict['SINH'] = Math.sinh;
    fn_dict['COS'] = Math.cos;
    fn_dict['COSH'] = Math.cosh;
    fn_dict['TAN'] = Math.tan;
    fn_dict['TANH'] = Math.tanh;
    fn_dict['ATN'] = Math.atan;
    fn_dict['MIN'] = Math.min;
    fn_dict['MAX'] = Math.max;
    fn_dict['RND'] = Math.random;

    // String function

    fn_dict['ASC'] = (inp) => is_str(inp).charCodeAt(0);
    fn_dict['CHR'] = (inp) => is_num(inp).charCodeAt(0);
    fn_dict['STR'] = (inp) => inp.toString();
    fn_dict['HEX'] = (inp) => inp.toString(16);
    fn_dict['MATCH'] = (inp1, inp2) => is_str(inp1).match(is_str(inp2));
    fn_dict['LEFT'] = (str, len) => is_str(str).substr(0, is_num(len));
    fn_dict['SUBSTR'] = (str, pos, len) => is_str(str).substr(is_num(pos), is_num(len));
    fn_dict['LEN'] = (str) => is_str(str).length;

    return fn_dict;
}


function is_num(inp){
    if (typeof inp != 'number')
        throw `Number expected but got ${typeof inp}`;
    return inp;
}


function is_str(inp){
    if (typeof inp != 'string')
        throw `String expected but got ${typeof inp}`;
    return inp;
}