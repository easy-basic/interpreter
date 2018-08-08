import PrintStatement from './print';
import { LetStatement } from './data';
import { ForStatement, NextStatement, WhileStatement } from './loops';

export default class StatementManager {

    constructor(terminal) {
        this.builtin_statements = {
            'PRINT': new PrintStatement(terminal),
            'LET': new LetStatement(terminal),
            'FOR': new ForStatement(terminal),
            'NEXT': new NextStatement(terminal),
            'WHILE': new WhileStatement(terminal),
        }
        this.statement_dict = this.builtin_statements;
    }

    clear() {
        this.statement_dict = this.builtin_statements
    }

    get(name) {
        return this.statement_dict[name];
    }

    remove(name) {
        delete this.statement_dict[name];
    }

    register(name, statement) {
        this.statement_dict[name] = statement;
    }

    getKeywords(){
        return Object.keys(this.statement_dict);
    }
}