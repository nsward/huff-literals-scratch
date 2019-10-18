const path = require('path');
const fs = require('fs');

const parser = require('./huff/src/parser');
const compiler = require('./huff/src/compiler');

const modulesPath = path.posix.resolve(__dirname, './huff_modules');

const literal_addition = parseContract('literal_addition.huff', modulesPath);
// const copy_constructor_args = parseContract('copy_constructor_args.huff', modulesPath);

const contracts = [
  {
    name: 'literal_addition',
    bytecode: `0x${literal_addition.bytecode}`,
    runtimeBytecode: `0x${literal_addition.runtime}`,
  },
  {
    name: 'copy_constructor_args',
    bytecode: `0x${copy_constructor_args.bytecode}`,
    runtimeBytecode: `0x${copy_constructor_args.runtime}`,
  },
];

fs.writeFileSync(
  path.posix.resolve(__dirname, './bytecode.json'),
  JSON.stringify(contracts, null, 2)
);

console.log('written bytecode to bytecode.json');

function parseContract(filename, pathToData) {
  const { inputMap, macros, jumptables } = parser.parseFile(filename, pathToData);
  runtime = parser.processMacro('RUNTIME', 0, [], macros, inputMap, jumptables).data.bytecode;
  constructor = parser.processMacro('CONSTRUCTOR', 0, [], macros, inputMap, jumptables).data.bytecode;
  bytecode = constructor + runtime;
  return { constructor, runtime, bytecode };
}
