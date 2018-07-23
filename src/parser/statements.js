import orderedDict from 'ordered-dict';
import ExpressionParser from './expression';


export function build_satements () {
    var statements = new orderedDict();

    // Drawing
    statements['ARC'] = CommaArgsParser;
    statements['ELLIPSE'] = CommaArgsParser;
    statements['LINE'] = CommaArgsParser;
    statements['POINT'] = CommaArgsParser;
    statements['QUAD'] = CommaArgsParser;
    statements['RECT'] = CommaArgsParser;
    statements['TRIANGLE'] = CommaArgsParser;
    statements['CIRCLE'] = CommaArgsParser;
    statements['COLOR'] = CommaArgsParser;
    statements['DRAW'] = CommaArgsParser;
    statements['PAINT'] = CommaArgsParser;
    statements['PALETTE'] = CommaArgsParser;
    statements['POINT'] = CommaArgsParser;
    statements['GET'] = CommaArgsParser;
    statements['PUT'] = CommaArgsParser;

    // CONSOLE
    statements['CLS'] = CommaArgsParser;
    statements['LOCATE'] = CommaArgsParser;
    statements['PRINT'] = print_parser;
    statements['?'] = print_parser;

    // SOUND
    statements['BEEP'] = CommaArgsParser;
    statements['NOISE'] = CommaArgsParser;
    statements['PLAY'] = CommaArgsParser;

    // DATA
    statements['INPUT'] = CommaArgsParser;
    statements['LET'] = LetParser;
    statements['DATA'] = CommaArgsParser;
    statements['READ'] = CommaArgsParser;
    statements['ERASE'] = no_args_parser;
    statements['SWAP'] = no_args_parser;

    // No Args
    statements['END'] = no_args_parser;
    statements['WEND'] = no_args_parser;
    statements['NEW'] = no_args_parser;
    statements['ELSE'] = no_args_parser;
    statements['ENDIF'] = no_args_parser;
    statements['REM'] = no_args_parser;
    statements["'"] = no_args_parser;

    // Complex
    statements['FOR'] = for_parser;
    statements['NEXT'] = CommaArgsParser;
    statements['WHILE'] = CommaArgsParser;
    statements['IF'] = if_parser;
    statements['ELIF'] = if_parser;

    return statements;
}


function no_args_parser(scnr, expr_parser){
    expr_parser.parse(scnr);
    return;
}

function CommaArgsParser(scnr, expr_parser){
    return expr_parser.parse(scnr);
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
        val: expr_parser.parse(scnr)[1],
    }
}


function for_parser(scnr, expr_parser){
    var ident = scnr.scan().text;

    var token = scnr.scan();
    if (token.text != '=')
        throw `Invalid token ${token.text}`;


    var start = expr_parser.parse(scnr, 'TO');
    var token = scnr.scan();
    if (token.text != 'TO')
        throw `Invalid token ${token.text}`;

    var end = expr_parser.parse(scnr, 'STEP'), step;

    var token = scnr.scan();
    if (token.text == 'STEP'){
        step = expr_parser.parse(scnr);
    }

    return {
        ident: ident,
        start: start,
        end: end,
        step: step
    }
}

function if_parser(scnr, expr_parser){
    return {
      cond: expr_parser.parse(scnr)[1]
    }
}


function print_parser(scnr, expr_parser){
    var exprs = expr_parser.parse(scnr, 'USING')
    var format = exprs[0] && expr_parser.parse(scnr)[1]
    return {
      exprs : exprs[1],
      format : format
    }
}
