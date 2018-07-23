import Runtime from './runtime/main';
import StatementManager from './statements/base'
import OperatorManager from './operators/operators';

class Easybasic{

    constructor(terminal){
        this.terminal = terminal;
        this.statements = new StatementManager(this.terminal);
        this.operators = new OperatorManager();

        this.runtime = new Runtime(this.statements, this.operators);
    }

    execute(code){
        this.terminal.clear();
        this.runtime.execute(code);
    }

    version(){
        return '0.1';
    }
}

window.BASIC = Easybasic;

export default Easybasic;
