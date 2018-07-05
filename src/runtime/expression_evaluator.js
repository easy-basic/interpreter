

export default class ExpressionEvaluator {
    evaluate(expr, runtime) {
        console.log(expr);
        this.runtime = runtime;
        return this._evaluateNode(expr);
    }

    _evaluateNode(node) {
        if (node.type == 4 || // Deciaml Number
            node.type == 5 || // Octal Number
            node.type == 6 || // Hexa Number
            node.type == 8    // String
        ) {
            return node.value
        }

        // Uniary Operators
        else if (node.prefix) {
            var op_fn = this.runtime.op_manager.get_uniary(node.operator);

            if (op_fn)
                return op_fn(this._evaluateNode(node.argument))
            else
                throw `Invalid Operator ${node.operator}`
        }

        // Binary Operators
        else if(node.is_binary){
            var left = this._evaluateNode(node.left);
            var right = this._evaluateNode(node.right);
            var op_fn = this.runtime.op_manager.get_binary(node.operator);
            
            if (op_fn)
                return op_fn(left, right)
            else
                throw `Invalid Operator ${node.operator}`
        }


        // Array
        else if (node.is_array){
            var arr = [];
            for(var el of node.object){
                arr.push(this._evaluateNode(el));
            }
            return arr;
        }

        // Identifier
        else if (node.type == 9){
            var variable= this.runtime.var_manager.get(node.text);
            if(variable)
                return variable.val;
            return undefined;
        }

        // array index
        else if (node.type == 15){
            var variable = this.runtime.var_manager.get(node.object.text);
            var index = this._evaluateNode(node.property);
            if(variable){
                return variable.val[index];
            }
            else{
                throw `Index '${index}' out of range`;
            }
        }

        // function calls
        else if (node.type == 16){
            var fn = this.runtime.fn_manager.get(node.object.text);
            var fn_args = Array.isArray(node.property)? node.property: [node.property];
            var args = [];
            for(var arg of fn_args){
                args.push(this._evaluateNode(arg));
            }

            if(fn){
                return fn(...args);
            }
            else{
                throw `Function '${node.object.text}' is not defined`;
            }
        }
    }
}

