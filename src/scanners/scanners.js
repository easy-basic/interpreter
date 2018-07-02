import orderedDict from 'ordered-dict';
import { token_types, keywords } from "../token.js";

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
    scanners.append('decimal_scanner', DecimalScanner);
    scanners.append('hexa_scanner', HexaScanner);
    scanners.append('octal_scanner', OctalScanner);
    scanners.append('identifier_scanner', IdentifierScanner);
    scanners.append("unkown_scanner", UnknownScanner)

    return scanners;
}


function EOFScanner(text, last_token){
    if (!text[0]){
        return {
            length: 0,
            type: token_types.EOF,
            text: text[0]
        }
    }
}

function EOLScanner(text, last_token) {
    if (text.match(/^(\r\n|\r|\n)/)) {
        return {
            length: 1,
            type: token_types.EOL,
            text: text.slice(0, 1)
        };
    }
}

function EOSScanner(text, last_token){
    if(text[0] == ':'){
        return {
            length: 1,
            type: token_types.EOS,
            text: ':'
        }
    }
}

function LineNumberScanner(text, last_token) {
    var m = text.match(/^\d+/)
    if ((!last_token || last_token.type == token_types.EOL) && m){
        return {
            length: m[0].length,
            type: token_types.LineNumber,
            text: m[0]
        }
    }
}


function KeywordScanner(text, last_token) {
    var word = text.match(/^[a-z$(']+/i);
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



function DecimalScanner(text, last_token) {
    var m = text.match(/^((\+|-)?[\d.]+((e|d)(\+|-)?(\d))?(#|!|%)?)/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.DeciamlNum,
            text: m[0]
        };
    }
}

function OctalScanner(text, last_token) {
    var m = text.match(/^&o?[0-7]*/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.DeciamlNum,
            text: m[0]
        };
    }
}

function HexaScanner(text, last_token) {
    var m = text.match(/^&h[0-9a-f]*/i)
    if (m) {
        return {
            length: m[0].length,
            type: token_types.DeciamlNum,
            text: m[0]
        };
    }
}

function OperatorScanner(text, last_token) {
    var m = text.slice(0, 3).match(/(MOD|AND|OR|XOR|EQV|IMP)/i) ||
        text.slice(0, 2).match(/(>=|<=|=>|=<|<>|=)/i) ||
        text.match(/^(\^|\*|\/|\\|\+|-|>|<|\(|\))/i);
    if (m) {
        return {
            length: m[0].length,
            type: token_types.Operator,
            text: m[0]
        };
    }
}

function StringScanner(text, last_token) {
    var m = text.match(/^"([^"\r\n]*)"?/);
    if (m){
        return {
            length: m[0].length,
            type: token_types.String,
            text: m[0]
        };
    }
}

function IdentifierScanner(text, last_token){
    var m = text.match(/^([a-z]([a-z0-9.]+)?)(!|#|\$)?/i)
    if (m){
        return {
            length: m[0].length,
            type: token_types.Identifier,
            text: m[0]
        };
    }
}

function UnknownScanner(text, last_token){
    return {
        length: 1,
        type: token_types.Unknown,
        text: text[0]
    };
}
