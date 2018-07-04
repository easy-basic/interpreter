

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
    }
}

