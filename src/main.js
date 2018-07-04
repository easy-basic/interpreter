import BasicParser from './parser/basic_parser';
import Runtime from './runtime/main'

class Easybasic{

    constructor(){
        this.parser = new BasicParser();
        this.runtime = new Runtime();
    }

    execute(code){
        var parsed = this.parser.parse(code);

        this.runtime.execute(parsed);
    }
}

window.BASIC = Easybasic;

export default Easybasic;
