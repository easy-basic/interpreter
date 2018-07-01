import orderedDict from 'ordered-dict';


export function build_satements () {
    var statements = new orderedDict();

    statements['BEEP'] = BeepParser;

    return statements;
}

function testCharAt(args, pos, char){
    if(args[pos].text == char) return true;

    throw `Invalid token ${args[pos].text}`;
}


function BeepParser(args){
    testCharAt(args, 1, ',');
    return {
        statement: 'BEEP',
        freq: args[0] || 800,
        duration: args[2] || 250,
    }
}


function CircleParser(args){
    testCharAt(args, 0, '(');
    testCharAt(args, 2, ',');
    testCharAt(args, 4, ')');
    return {
        statement: 'CIRCLE',
        center : {
            x: args[1],
            y: args[3],
        },
        radius: args[6],
        color: args[8],
        start: args[10],
        end: args[12],
        aspect: args[14]
    }
}