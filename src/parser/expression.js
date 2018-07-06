import { token_types, binary_operators } from '../token.js';

const expr_types = {
    locigalExpr: 1,
    BinaryExpr: 2,
    UnaryExpr: 3
}


export default class ExpressionParser {

    parse(scanner, until) {
        this.scanner = scanner;

        return this._parseUntil(until);
    }

    _parseUntil(until) {
        var nodes = [];
        while (true) {
            this.scanner.peekState();
            this.token = this.scanner.scan();
            this.scanner.seekState();

            if (!this.token.text ||
                this.token.text == until ||
                this.token.type == token_types.EOL ||
                this.token.text == ':'
            ) {
                this.token = this.scanner.scan();
                break;
            }

            else {
                if (nodes.length > 0 && this.token.text != ',') {
                    throw `Unexpected token ${this.token.text}`;
                }
                else if (this.token.text == ',') {
                    this.token = this.scanner.scan();
                }

                var node = this._binaryParser();
                nodes.push(node);
            }
        }
        if(nodes.length == 1)
            return nodes[0]
        return nodes;
    }

    _readToken() {
        this.token = this.scanner.scan();

        // Decimal Number
        if (this.token.type == token_types.DeciamlNum) {
            var value = this.token.text.replace(/(!|%|#|)$/, '') || 0
            return Object.assign(this.token, {
                value: parseFloat(value)
            })
        }

        // Octal Number
        else if (this.token.type == token_types.OcatalNum) {
            var value = this.token.text.replace(/^&o?/i, '') || '0';
            return Object.assign(this.token, {
                value: this._convertFromBaseToBase(value, 8, 10),
            })
        }

        // Hexa Number
        else if (this.token.type == token_types.HexaNum) {
            var value = this.token.text.replace(/^&h/i, '') || '0';
            return Object.assign(this.token, {
                value: this._convertFromBaseToBase(value, 16, 10),
            })
        }

        // String
        else if (this.token.type == token_types.String) {
            return Object.assign(this.token, {
                value: this.token.text.substr(1).slice(0, -1)
            })
        }

        // Array
        else if (this.token.text == '[') {
            return {
                object: this._parseUntil(']'),
                is_array: true
            }
        }

        // Uniary Operators
        else if (this._isUniaryOp(this.token.text)) {
            return {
                type: token_types.UniaryOperator,
                operator: this.token.text,
                argument: this._readToken(),
                prefix: true
            }
        }

        // Parentheses
        else if (this.token.text == '(') {
            return this._parseUntil(')');
        }

        // Variables and Function Calls
        else if (this.token.type == token_types.Identifier) {
            this.scanner.peekState();
            var node = this.token;
            this.token = this.scanner.scan();

            if (this.token.text == '[') {
                return {
                    type: token_types.Array,
                    object: node,
                    property: this._parseUntil(']')
                }
            }

            else if (this.token.text == '(') {
                return {
                    type: token_types.Function,
                    object: node,
                    property: this._parseUntil(')')
                }
            }
            this.scanner.seekState();
            this.token = this.scanner.token;
        }

        // Identifier
        return this.token;
    }

    _binaryPrecedence(op) {
        return binary_operators[op] || 0;
    }

    _readBinaryToken() {
        this.scanner.peekState();
        this.token = this.scanner.scan();

        if (this.token.type == token_types.Operator) {
            return Object.assign(this.token, {
                prec: this._binaryPrecedence(this.token.text)
            })
        }

        this.scanner.seekState();
        return false;
    }

    _isUniaryOp(text) {
        var operators = ['+', '-', 'NOT'];
        return operators.indexOf(text) > -1;
    }

    _binaryParser() {
        var left = this._readToken();
        var operator = this._readBinaryToken();

        if (!operator) return left;

        var right = this._readToken();
        if (!right) {
            throw `Expected expression after ${operator}, ${this.scanner.index}`
        }

        var stack = [left, operator, right];
        while (operator = this._readBinaryToken()) {
            if (operator.prec == 0) break;

            while (stack.length > 2 && operator.prec <= stack[stack.length - 2].prec) {
                right = stack.pop();
                var op = stack.pop();
                left = stack.pop();
                var node = this._createBinaryExpression(op, left, right);
                stack.push(node);
            }

            var node = this._readToken();
            if (!node) {
                throw `Expected expression after ${operator}, ${this.scanner.index}`
            }
            stack.push(operator, node);
        }

        var i = stack.length - 1;
        node = stack[i];
        while (i > 1) {
            node = this._createBinaryExpression(stack[i - 1], stack[i - 2], node);
            i -= 2;
        }
        return node;
    }

    _createBinaryExpression(op, left, right) {
        return {
            operator: op.text,
            left: left,
            right: right,
            is_binary: true
        };
    }

    _convertFromBaseToBase(str, fromBase, toBase) {
        var num = parseInt(str, fromBase);
        return parseInt(num.toString(toBase));
    }
}
