import orderedDict from 'ordered-dict';
import { token_types } from "../token.js";

export function build_scanners () {
    var scanners = new orderedDict();

    scanners.append('eof_scanner', EOFScanner);
    scanners.append('eol_scanner', EOLScanner);
    scanners.append('eos_scanner', EOSScanner);
    // scanners.append('linenumber_scanner', LineNumberScanner);
    scanners.append('comment_scanner', CommentScanner);
    scanners.append('keyword_scanner', KeywordScanner);
    scanners.append('operator_scanner', OperatorScanner);
    scanners.append('string_scanner', StringScanner);
    scanners.append('hexa_scanner', HexaScanner);
    scanners.append('octal_scanner', OctalScanner);
    scanners.append('decimal_scanner', DecimalScanner);
    scanners.append('identifier_scanner', IdentifierScanner);
    scanners.append("unkown_scanner", UnknownScanner);

    return scanners;
}


function EOFScanner(text){
    if (!text[0]){
        return {
            length: 0,
            type: token_types.EOF,
            text: text[0]
        }
    }
}

function EOLScanner(text) {
    if (text.match(/^(\r\n|\r|\n)/)) {
        return {
            length: 1,
            type: token_types.EOL,
            text: text.slice(0, 1)
        };
    }
}

function EOSScanner(text){
    if(text[0] == ':'){
        return {
            length: 1,
            type: token_types.EOS,
            text: ':'
        }
    }
}


function KeywordScanner(text, last_token, statements) {
    var word = text.match(/^[a-z$('?]+/i);
    var keywords = statements.getKeywords();
    if (word && keywords.indexOf(word[0].toUpperCase()) > -1) {
        return {
            length: word[0].length,
            type: token_types.Keyword,
            text: word[0].toUpperCase()
        }
    }
}

function CommentScanner(text, last_token) {
    var offset = 0;
    if (last_token && (last_token.text == 'REM' || last_token.text == "'")) {

        // until EOL or EOF
        while (text[offset] && !text[offset].match(/^(\r\n|\r|\n)/)) {
            offset++;
        }

        return {
            length: offset,
            type: token_types.Comment,
            text: text.slice(0, offset)
        };
    }
}



function DecimalScanner(text) {
    var m = text.match(/^((\+|-)?[\d.]+((e|d)(\+|-)?(\d))?(#|!|%)?)/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.DeciamlNum,
            text: m[0]
        };
    }
}

function OctalScanner(text) {
    var m = text.match(/^&o?[0-7]*/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.OcatalNum,
            text: m[0]
        };
    }
}

function HexaScanner(text) {
    var m = text.match(/^&h[0-9a-f]*/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.HexaNum,
            text: m[0]
        };
    }
}

function OperatorScanner(text, last_token, statements, ops) {
    var m = text.slice(0, 3).match(/(MOD|AND|OR|XOR|EQV|IMP)/i) ||
        text.slice(0, 2).match(/(>=|<=|=>|=<|<>|==)/i) ||
        text.match(/^(\^|\*|\/|\\|\+|-|>|<)/i);
    if (m) {
        return {
            length: m[0].length,
            type: token_types.Operator,
            text: m[0]
        };
    }
}

function StringScanner(text) {
    var m = text.match(/^"([^"\r\n]*)"?/);
    if (m){
        return {
            length: m[0].length,
            type: token_types.String,
            text: m[0]
        };
    }
}

function IdentifierScanner(text){
    var m = text.match(/^([a-z]([a-z0-9.]+)?)(!|#|\$)?/i)
    if (m){
        return {
            length: m[0].length,
            type: token_types.Identifier,
            text: m[0]
        };
    }
}

function UnknownScanner(text){
    return {
        length: 1,
        type: token_types.Unknown,
        text: text[0]
    };
}
