// Adopted from http://jsep.from.so/
// Rewritten / Modified by Nauman Umer

const token_types = {
    COMPOUND: 0,
    IDENTIFIER: 1,
    MEMBER_EXP: 2,
    LITERAL: 3,
    CALL_EXP: 5,
    UNARY_EXP: 6,
    BINARY_EXP: 7,
    LOGICAL_EXP: 8,
    CONDITIONAL_EXP: 9,
    ARRAY_EXP: 10
}

const token_codes = {
    PERIOD_CODE: 46, // '.'
    COMMA_CODE: 44, // ','
    DQUOTE_CODE: 34, // double quotes
    OPAREN_CODE: 40, // (
    CPAREN_CODE: 41, // )
    OBRACK_CODE: 91, // [
    CBRACK_CODE: 93, // ]
    QUMARK_CODE: 63, // ?
    SEMCOL_CODE: 59, // ;
    COLON_CODE: 58, // :
}

const binary_ops = {
    'IMP': 1,
    'EQV': 2,
    'XOR': 3,
    'OR': 4,
    'AND': 5,
    'NOT': 6,
    '=': 7, '<>': 7, '><': 7, '<': 7, '>': 7, '<=': 7, '>=': 7, '=>': 7, '=<': 7,
    '-': 8, '+': 8,
    'MOD': 9,
    '\\': 10,
    '*': 11,
    '/': 11,
    '^': 12
}

const unary_ops = {
    '-': true,
    'NOT': true,
    '+': true
}


module.exports = class ExpressionParser {

    constructor(){
        this.max_unop_len = this._getMaxKeyLen(unary_ops);
        this.max_binop_len = this._getMaxKeyLen(binary_ops);
    }


    _getMaxKeyLen(obj) {
        var max_len = 0, len;
        for (var key in obj) {
            if ((len = key.length) > max_len && obj.hasOwnProperty(key)) {
                max_len = len;
            }
        }
        return max_len;
    }

    _throwError(message, index) {
        var error = new Error(message + ' at character ' + index);
        error.index = index;
        error.description = message;
        throw error;
    }

    _binaryPrecedence(op_val) {
        return binary_ops[op_val] || 0;
    }

    _createBinaryExpression(operator, left, right) {
        var type = (operator === '||' || operator === '&&') ? token_types.LOGICAL_EXP : token_types.BINARY_EXP;
        return {
            type: type,
            operator: operator,
            left: left,
            right: right
        };
    }

    _isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57); // 0...9
    }

    _isIdentifierStart(ch) {
        return (ch === 36) || (ch === 95) || // `$` and `_`
            (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 128 && !binary_ops[String.fromCharCode(ch)]); // any non-ASCII that is not an operator
    }

    _isIdentifierPart(ch) {
        return (ch === 36) || (ch === 95) || // `$` and `_`
            (ch >= 65 && ch <= 90) || // A...Z
            (ch >= 97 && ch <= 122) || // a...z
            (ch >= 48 && ch <= 57) || // 0...9
            (ch >= 128 && !binary_ops[String.fromCharCode(ch)]); // any non-ASCII that is not an operator
    }

    exprI(i) {
        return this.charAtFunc.call(this.expr, i);
    }

    exprICode(i) {
        return this.charCodeAtFunc.call(this.expr, i);
    }

    gobbleSpaces() {
        var ch = this.exprICode(this.index);
        while (ch === 32 || ch === 9 || ch === 10 || ch === 13) {
            ch = this.exprICode(++this.index);
        }
    }

    gobbleExpression() {
        var test = this.gobbleBinaryExpression(),
            consequent, alternate;

        this.gobbleSpaces();
        if (this.exprICode(this.index) === token_codes.QUMARK_CODE) {
            this.index++;
            consequent = this.gobbleExpression();
            if (!consequent) {
                this._throwError('Expected expression', this.index);
            }

            this.gobbleSpaces();
            if (this.exprICode(this.index) === token_codes.COLON_CODE) {
                this.index++;
                alternate = this.gobbleExpression();
                if (!alternate) {
                    this._throwError('Expected expression', this.index);
                }
                return {
                    type: token_types.CONDITIONAL_EXP,
                    test: test,
                    consequent: consequent,
                    alternate: alternate
                };
            } else {
                this._throwError('Expected :', this.index);
            }
        } else {
            return test;
        }
    }

    gobbleBinaryOp() {
        this.gobbleSpaces();
        var biop, to_check = this.expr.substr(this.index, this.max_binop_len), tc_len = to_check.length;
        while (tc_len > 0) {
            if (binary_ops.hasOwnProperty(to_check) && (
                !this._isIdentifierStart(this.exprICode(this.index)) ||
                (this.index + to_check.length < this.expr.length &&
                    !this._isIdentifierPart(this.exprICode(this.index + to_check.length))
                )
            )) {
                this.index += tc_len;
                return to_check;
            }
            to_check = to_check.substr(0, --tc_len);
        }
        return false;
    }

    gobbleBinaryExpression () {
        var ch_i, node, biop, prec, stack, biop_info, left, right, i;
        left = this.gobbleToken();
        biop = this.gobbleBinaryOp();
        if (!biop) {
            return left;
        }
        biop_info = { value: biop, prec: this._binaryPrecedence(biop) };

        right = this.gobbleToken();
        if (!right) {
            this._throwError("Expected expression after " + biop, this.index);
        }
        stack = [left, biop_info, right];
        while ((biop = this.gobbleBinaryOp())) {
            prec = this._binaryPrecedence(biop);

            if (prec === 0) {
                break;
            }
            biop_info = { value: biop, prec: prec };
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                biop = stack.pop().value;
                left = stack.pop();
                node = this._createBinaryExpression(biop, left, right);
                stack.push(node);
            }

            node = this.gobbleToken();
            if (!node) {
                this._throwError("Expected expression after " + biop, this.index);
            }
            stack.push(biop_info, node);
        }

        i = stack.length - 1;
        node = stack[i];
        while (i > 1) {
            node = this._createBinaryExpression(stack[i - 1].value, stack[i - 2], node);
            i -= 2;
        }
        return node;
    }

    gobbleToken() {
        var ch, to_check, tc_len;

        this.gobbleSpaces();
        ch = this.exprICode(this.index);

        if (this._isDecimalDigit(ch) || ch === token_codes.PERIOD_CODE) {
            return this.gobbleNumericLiteral();
        } else if (ch === token_codes.SQUOTE_CODE || ch === token_codes.DQUOTE_CODE) {
            return this.gobbleStringLiteral();
        } else if (ch === token_codes.OBRACK_CODE) {
            return this.gobbleArray();
        } else {
            to_check = this.expr.substr(this.index, this.max_unop_len);
            tc_len = to_check.length;
            while (tc_len > 0) {
                if (unary_ops.hasOwnProperty(to_check) && (
                    !this._isIdentifierStart(this.exprICode(this.index)) ||
                    (this.index + to_check.length < this.expr.length && !this._isIdentifierPart(this.exprICode(this.index + to_check.length)))
                )) {
                    this.index += tc_len;
                    return {
                        type: token_types.UNARY_EXP,
                        operator: to_check,
                        argument: this.gobbleToken(),
                        prefix: true
                    };
                }
                to_check = to_check.substr(0, --tc_len);
            }

            if (this._isIdentifierStart(ch) || ch === token_codes.OPAREN_CODE) { // open parenthesis
                return this.gobbleVariable();
            }
        }

        return false;
    }

    gobbleNumericLiteral() {
        var number = '', ch, chCode;
        while (this._isDecimalDigit(this.exprICode(this.index))) {
            number +=this.exprI(this.index++);
        }

        if (this.exprICode(this.index) === token_codes.PERIOD_CODE) { // can start with a decimal marker
            number +=this.exprI(this.index++);

            while (this._isDecimalDigit(this.exprICode(this.index))) {
                number +=this.exprI(this.index++);
            }
        }

        ch =this.exprI(this.index);
        if (ch === 'e' || ch === 'E') { // exponent marker
            number +=this.exprI(this.index++);
            ch =this.exprI(this.index);
            if (ch === '+' || ch === '-') { // exponent sign
                number +=this.exprI(this.index++);
            }
            while (this._isDecimalDigit(this.exprICode(this.index))) { //exponent itself
                number +=this.exprI(this.index++);
            }
            if (!this._isDecimalDigit(this.exprICode(this.index - 1))) {
                this._throwError('Expected exponent (' + number +this.exprI(this.index) + ')', this.index);
            }
        }


        chCode = this.exprICode(this.index);
        if (this._isIdentifierStart(chCode)) {
            this._throwError('Variable names cannot start with a number (' +
                number +this.exprI(this.index) + ')', this.index);
        } else if (chCode === token_codes.PERIOD_CODE) {
            this._throwError('Unexpected period', this.index);
        }

        return {
            type: token_types.LITERAL,
            value: parseFloat(number),
            raw: number
        };
    }

    gobbleStringLiteral() {
        var str = '', quote =this.exprI(this.index++), closed = false, ch;

        while (this.index < length) {
            ch =this.exprI(this.index++);
            if (ch === quote) {
                closed = true;
                break;
            } else if (ch === '\\') {
                ch =this.exprI(this.index++);
                switch (ch) {
                    case 'n': str += '\n'; break;
                    case 'r': str += '\r'; break;
                    case 't': str += '\t'; break;
                    case 'b': str += '\b'; break;
                    case 'f': str += '\f'; break;
                    case 'v': str += '\x0B'; break;
                    default: str += ch;
                }
            } else {
                str += ch;
            }
        }

        if (!closed) {
            this._throwError('Unclosed quote after "' + str + '"', this.index);
        }

        return {
            type: token_types.LITERAL,
            value: str,
            raw: quote + str + quote
        };
    }

    gobbleIdentifier() {
        var ch = this.exprICode(this.index), start = this.index, identifier;

        if (this._isIdentifierStart(ch)) {
            this.index++;
        } else {
            this._throwError('Unexpected ' +this.exprI(this.index), this.index);
        }

        while (this.index < this.expr.length) {
            ch = this.exprICode(this.index);
            if (this._isIdentifierPart(ch)) {
                this.index++;
            } else {
                break;
            }
        }
        identifier = this.expr.slice(start, this.index);


        return {
            type: token_types.IDENTIFIER,
            name: identifier
        };

    }

    gobbleArguments(termination) {
        var ch_i, args = [], node, closed = false;
        while (this.index < length) {
            this.gobbleSpaces();
            ch_i = this.exprICode(this.index);
            if (ch_i === termination) { // done parsing
                closed = true;
                this.index++;
                break;
            } else if (ch_i === token_codes.COMMA_CODE) { // between expressions
                this.index++;
            } else {
                node = this.gobbleExpression();
                if (!node || node.type === token_types.COMPOUND) {
                    this._throwError('Expected comma', this.index);
                }
                args.push(node);
            }
        }
        if (!closed) {
            this._throwError('Expected ' + String.fromCharCode(termination), this.index);
        }
        return args;
    }

    gobbleVariable() {
        var ch_i, node;
        ch_i = this.exprICode(this.index);

        if (ch_i === token_codes.OPAREN_CODE) {
            node = this.gobbleGroup();
        } else {
            node = this.gobbleIdentifier();
        }
        this.gobbleSpaces();
        ch_i = this.exprICode(this.index);
        while (ch_i === token_codes.PERIOD_CODE || ch_i === token_codes.OBRACK_CODE || ch_i === token_codes.OPAREN_CODE) {
            this.index++;
            if (ch_i === token_codes.PERIOD_CODE) {
                this.gobbleSpaces();
                node = {
                    type: token_types.MEMBER_EXP,
                    computed: false,
                    object: node,
                    property: this.gobbleIdentifier()
                };
            } else if (ch_i === token_codes.OBRACK_CODE) {
                node = {
                    type: token_types.MEMBER_EXP,
                    computed: true,
                    object: node,
                    property: this.gobbleExpression()
                };
                this.gobbleSpaces();
                ch_i = this.exprICode(this.index);
                if (ch_i !== token_codes.CBRACK_CODE) {
                    this._throwError('Unclosed [', this.index);
                }
                this.index++;
            } else if (ch_i === token_codes.OPAREN_CODE) {
                node = {
                    type: token_types.CALL_EXP,
                    'arguments': this.gobbleArguments(token_codes.CPAREN_CODE),
                    callee: node
                };
            }
            this.gobbleSpaces();
            ch_i = this.exprICode(this.index);
        }
        return node;
    }

    gobbleGroup() {
        this.index++;
        var node = this.gobbleExpression();
        this.gobbleSpaces();
        if (this.exprICode(this.index) === token_codes.CPAREN_CODE) {
            this.index++;
            return node;
        } else {
            this._throwError('Unclosed (', this.index);
        }
    }

    gobbleArray() {
        this.index++;
        return {
            type: token_codes.ARRAY_EXP,
            elements: this.gobbleArguments(token_codes.CBRACK_CODE)
        };
    }

    parse(expr){
        this.expr = expr.toUpperCase();
        this.index = 0;
        var length = this.expr.length;
        var nodes = [], ch_i, node;

        this.charAtFunc = this.expr.charAt;
        this.charCodeAtFunc = this.expr.charCodeAt;

        while (this.index < length) {
            ch_i = this.exprICode(this.index);
            if (ch_i === token_codes.SEMCOL_CODE || ch_i === token_codes.COMMA_CODE) {
                this.index++; // ignore separators
            } else {
                if ((node = this.gobbleExpression())) {
                    nodes.push(node);
                } else if (this.index < length) {
                    this._throwError('Unexpected "' +this.exprI(this.index) + '"', this.index);
                }
            }
        }
        if (nodes.length === 1) {
            return nodes[0];
        } else {
            return {
                type: token_types.COMPOUND,
                body: nodes
            };
        }
    }
}