exports.token_types = Object.freeze({
    Whitespace: 0,
    Comment: 1,
    EOL: 2,
    Keyword: 3,
    DeciamlNum: 4,
    OcatalNum: 5,
    HexaNum: 6,
    Operator: 7,
    UniaryOperator: 14,
    String: 8,
    Identifier: 9,
    Unknown: 10,
    EOF: 11,
    LineNumber: 12,
    EOS: 13,
    Array: 15,
    Function: 16,
});

exports.keywords = [
    'END', 'FOR', 'NEXT', 'DATA', 'INPUT', 'DIM', 'READ', 'LET', 'GOTO', 'RUN', 'IF',
    'RESTORE', 'GOSUB', 'RETURN', 'STOP', 'PRINT', 'CLEAR', 'LIST', 'NEW', 'ON',
    'WAIT', 'DEF', 'POKE', 'CONT', 'OUT', 'LPRINT', 'LLIST', 'WIDTH', 'ELSE', 'TRON',
    'TROFF', 'SWAP', 'ERASE', 'EDIT', 'ERROR', 'RESUME', 'DELETE', 'AUTO', 'RENUM',
    'DEFSTR', 'DEFINT', 'DEFSNG', 'DEFDBL', 'LINE', 'WHILE', 'WEND', 'CALL', 'WRITE',
    'OPTION', 'RANDOMIZE', 'OPEN', 'CLOSE', 'LOAD', 'MERGE', 'SAVE', 'COLOR', 'CLS',
    'MOTOR', 'BSAVE', 'BLOAD', 'SOUND', 'BEEP', 'PSET', 'PRESET', 'SCREEN', 'KEY',
    'LOCATE', 'TO', 'THEN', 'TAB(', 'STEP', 'USR', 'FN', 'SPC(', 'NOT', 'ERL', 'ERR',
    'STRING$', 'USING', 'INSTR', 'VARPTR', 'CSRLIN', 'POINT', 'OFF', 'INKEY$',
    'CVI', 'CVS', 'CVD', 'MKI$', 'MKS$', 'MKD$', 'EXTERR', 'FILES', 'FIELD', 'SYSTEM',
    'NAME', 'LSET', 'RSET', 'KILL', 'PUT', 'GET', 'RESET', 'COMMON', 'CHAIN', 'DATE$',
    'TIME$', 'PAINT', 'COM', 'CIRCLE', 'DRAW', 'PLAY', 'TIMER', 'ERDEV', 'IOCTL',
    'CHDIR', 'MKDIR', 'RMDIR', 'SHELL', 'ENVIRON', 'VIEW', 'WINDOW', 'PMAP', 'PALETTE',
    'LCOPY', 'CALLS', 'PCOPY', 'LOCK', 'UNLOCK', 'LEFT$', 'RIGHT$', 'MID$', 'SGN', 'INT',
    'ABS', 'SQR', 'RND', 'SIN', 'LOG', 'EXP', 'COS', 'TAN', 'ATN', 'FRE', 'INP', 'POS',
    'LEN', 'STR$', 'VAL', 'ASC', 'CHR$', 'PEEK', 'SPACE$', 'OCT$', 'HEX$', 'LPOS', 'CINT',
    'CSNG', 'CDBL', 'FIX', 'PEN', 'STICK', 'STRIG', 'EOF', 'LOC', 'LOF', 'NOISE', 'AS',
    'SHARED', 'ACCESS', 'RANDOM', 'OUTPUT', 'APPEND', 'BASE', 'SEG', 'ALL', 'REM', "'"
]

exports.binary_operators = {
    '^': 12,
    '*': 11, '/': 11,
    '\\': 10,
    'MOD': 9,
    '+': 8, '-': 8,
    '>': 7, '<': 7,
    '>=': 7, '<=': 7,
    '=>': 7, '=<': 7,
    '<>': 7, '><': 7, '=': 7,
    'AND': 5, 'OR': 4,
    'XOR': 3, 'EQV': 2,
    'IMP': 1
};

exports.unary_operators = [
    '-', '+', 'NOT'
];