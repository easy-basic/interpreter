import BasicParser from './parser/basic_parser';


class Easybasic{

    constructor(){
        this.parser = new BasicParser();
    }

    parse(text){
        return this.parser.parse(text);
    }
}

window.BASIC = Easybasic;

export default Easybasic;