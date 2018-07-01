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

            // break if until reaches
            if (!this.token || this.token.type == token_types.EOL) {
                throw `Expected ${until}`
            }

            else if (this.token.text == until) {
                break;
            }

            // Ignore ','
            else if (this.token.text == ',') {
                continue;
            }

            else {
                var node = this._binaryParser();
                nodes.push(node);
            }
        }
        return nodes;
    }

    _readToken() {
        this.token = this.scanner.scan();

        // Decimal Number
        if (this.token.type == token_types.DeciamlNum) {
            var value = this.token.text.replace(/(!|%|#|)$/, '') || 0
            return Object.assign(this.token, {
                value: value
            })
        }

        // Octal Number
        else if (this.token.type == token_types.OcatalNum) {
            var value = this.token.text.replace(/^&o?/i, '') || '0';
            return Object.assign(this.token, {
                value: parseFloat(value, 8)
            })
        }

        // Hexa Number
        else if (this.token.type == token_types.HexaNum) {
            var value = this.token.text.replace(/^&h/i, '') || '0';
            return Object.assign(this.token, {
                value: parseFloat(value, 16)
            })
        }

        // String
        else if (this.token.type == token_types.String) {
            return this.token;
        }

        // Array
        else if (this.token.text == '[') {
            return _parseUntil(']');
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
        }

        return false;
    }

    _binaryPrecedence(op) {
        return binary_operators[op] || 0;
    }

    _readBinaryToken() {
        this.token = this.scanner.scan();

        if (this.token.type == token_types.Operator) {
            return Object.assign(this.token, {
                prec: this._binaryPrecedence(this.token.text)
            })
        }

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

            console.log(stack);
            while (stack.length > 2 && operator.prec <= stack[stack.length - 2].prec) {
                right = stack.pop();
                operator = stack.pop();
                left = stack.pop();
                var node = this._createBinaryExpression(operator, left, right);
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
            type: expr_types.BinaryExpr,
            operator: op.text,
            left: left,
            right: right
        };
    }
}