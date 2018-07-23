import PrintStatement from './print';
import { LetStatement } from './data';

export default class StatementManager {

    constructor(terminal) {
        this.builtin_statements = {
            'PRINT': new PrintStatement(terminal),
            'LET': new LetStatement(terminal)
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