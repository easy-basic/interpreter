import scanner from '../scanners/basic_scanner.js';
import { token_types } from '../token.js';
import ExpressionParser from './expression';
import { build_satements } from './statements';


export default class BasicParser {

    constructor() {
        this.scanner = new scanner();
        this.expr_parser = new ExpressionParser();
        this.statement_parser = build_satements();
    }

    /** Return a fully parsed tree of given code */
    parse(code) {
        this.code = code.toUpperCase();
        this.scanner.setSource(code);
        this._nextToken();
        var lines = [];

        // Iterate until end of file reaches
        while (this.token.type != token_types.EOF) {
            lines.push(this._parseLine());
        }

        return lines;
    }


    /**
     * Parse a single line that may contains
     * multiple statements seperated by ':'
     */
    _parseLine() {
        var lineNum, statements = [];

        // if 1st token in decimal number its line number
        if (this.token.type == token_types.DeciamlNum) {
            lineNum = this.token.text;
            this._nextToken();
        }

        // Parse statements from line
        while (!this._isLineTerminator()) {
            statements.push(this._parseStatement());

            if(this.token.text == ':')
                this._nextToken();
        }

        this._nextToken();

        return {
            lineNum: lineNum,
            statements: statements
        }
    }

    /** Parse a single statment */
    _parseStatement() {
        var params = [], statement, parser;

        // if 1st token is keyword add it to statement text
        if (this.token.type == token_types.Keyword) {
            statement = this.token.text;
            parser = this.statement_parser[statement];
            if(parser){
              var params = parser(this.scanner, this.expr_parser);
              this.token = this.scanner.token;
            }
        }

        // Check if its direct assignment
        else if (this.token.type == token_types.Identifier) {
            var identifier = this.token;
            this._nextToken();

            // If identifier followed by an = its direct assignemnt
            if (this.token.text == '=') {
                statement = 'LET';
                parser = this.statement_parser['LET'];
                if(parser){
                  var params = parser(this.scanner, this.expr_parser, identifier.text);
                  this.token = this.scanner.token;
                }
            }

            // Else its unknown throw error
            else {
                this._throwError(`Invalid token ${this.token.text}`);
            }
        }

        // Else its unknown throw error
        else {
            this._throwError(`Invalid token ${this.token.text}`);
        }

        return {
            statement: statement,
            params: params
        }
    }

    /** Return if current token is StatementTerminator */
    _isStatementTerminator() {
        return this.token.type == token_types.EOS ||
            this.token.type == token_types.EOL ||
            this.token.type == token_types.EOF;
    }

    /** Return if current token is LineTerminator */
    _isLineTerminator() {
        return this.token.type == token_types.EOL ||
            this.token.type == token_types.EOF;
    }

    /** Scans next token */
    _nextToken() {
        this.token = this.scanner.scan();
    }

    /** Throws parsing error */
    _throwError(msg){
        // TODO: Implement error position
        throw msg;
    }
}
