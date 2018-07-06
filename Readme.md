# EasyBasic Interpreter

A modern BASIC interpreter that runs right inside our browser.

## Getting Started

```bash
# Clone this repo
git clone https://github.com/nmanumr/easybasic-interpreter.git

# Install dependencies
yarn
# OR
npm Install

# Compiling project
npm run watch
```

## Progress

* [x] Stream Scanning
* [x] Expression Parsing
* [x] Top level program parsing
* [x] Statements Parsing
* [x] Plugable operators support
* [x] Expression evaluator
* [x] Plugable functions support in expression parsing
* [x] Statement Execution
* [x] Complete Runtime
* [x] Add GUI

## Runing

There is no GUI provided yet but project can be test by opening `dist/test.html` in browser and using following commands

```js
var basic = new BASIC();
basic.execute(`
10 x = 10+30/5*43-cos(30)
20 print x
`)
```

## Related Projects

* PcBASIC https://github.com/robhagemans/pcbasic
* IronBASIC https://github.com/uadnan/IronBasic
* qb.js https://github.com/th0r/qb.js


## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nmanumr/easybasic-interpreter/blob/master/LICENSE) file for details
