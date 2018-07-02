import orderedDict from 'ordered-dict';
import ExpressionParser from './expression';


export function build_satements () {
    var statements = new orderedDict();

    statements['BEEP'] = BeepParser;
    statements['LET'] = LetParser;

    return statements;
}


// BEEP freq, duration
function BeepParser(scnr, expr_parser){
    return {
        freq: expr_parser.parse(scnr, ','),
        duration: expr_parser.parse(scnr, '\n'),
    }
}

// [LET] x = 12
function LetParser(scnr, expr_parser, ident){
    if (!ident){
        ident = scnr.scan().text;

        var token = scnr.scan();
        if (token.text != '=')
            throw `Invalid token ${token.text}`;
    }
    return {
        ident: ident,
        val: expr_parser.parse(scnr, '\n'),
    }
}
