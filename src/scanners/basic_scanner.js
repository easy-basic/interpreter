import { build_scanners } from './scanners.js';

export default class BasicScanner {
    
    constructor(statements, operators) {
        this.statements = statements;
        this.operators = operators;

        this.source = '';
        this.pos = 0;
        this.last_token = null;
        this.token = null;
        this.scanners = build_scanners();
        this.states = [];
    }

    setSource(text) {
        this.source = text;
        this.pos = 0;
        this.last_token = null;
        this.token = null;
    }

    skipBlank() {
        var m = this.source.slice(this.pos).match(/^[ \t\f]+/);
        if (m) this.pos += m[0].length;
    }

    peekState(){
        this.states.push({
            'last_token': this.last_token,
            'pos': this.pos,
            'token': this.token
        })
    }

    seekState(){
        var state = this.states.pop();
        if(state){
            this.last_token = state.last_token;
            this.pos = state.pos;
            this.token = state.token;
        }
    }

    scan() {
        this.skipBlank();
        for (var x in this.scanners._dict) {
            var scanner = this.scanners._dict[x].value;
            this.token = scanner(
                this.source.slice(this.pos),
                this.last_token,
                this.statements,
                this.operators
            );
            
            if (this.token) {
                this.last_token = this.token;
                this.pos += this.token.length;
                return this.token;
            }
        }
    }
}