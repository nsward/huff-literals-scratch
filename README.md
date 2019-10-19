# A sandbox for literal addition in Huff
Currently, it is not possible to add two literals in a huff macro if one or both of these literals includes a `__codesize`, even if the codesize is constant.
This is needed for working with constructor arguments, because the offset for constructor args is determined at compile time by `__codesize(CONSTRUCTOR_SHALLOW) + __codesize(RUNTIME)` and the length of the constructor args is determined at runtime (deployment time) by `CODESIZE - constructor_args_offset` (where CODESIZE refers to the EVM opcode).

This is repo is to illustrate the issue and test the fix. Just replace the huff/ directory to test with a different version.

# Usage
`git clone --recursive`  
`npm run compile` -- compiles the huff macros into bytecode in `bytecode.json`


To see the issue and what literal addition works / doesn't work, uncomment lines in `huff_modules/literal_addition.huff` (or grep for the `TODO:@here`) and compile again.


# Relevant section quoted from Huff documentation

In addition, when supplying templated arguments to a macro, `+`, `-` and `*` operators can be used if the operands are literals that are known at compile time. For example:

```
template<p1>
#define macro FOO = takes(0) returns(0) {
    <p1> swap pop 0x01 mulmod
}

#define macro FOO_SIZE = takes(0) returns(0) {
    __codesize(FOO<0x01>)
}

#define macro P = takes(0) returns(0) {
    0x20
}

#define macro BAR = takes(0) returns(0) {
    FOO<FOO_SIZE+P>()     // valid Huff code
    FOO<0x10*FOO_SIZE>()  // valid Huff code
    FOO<FOO+0x10>()       // invalid Huff code
}
```

Literals can be expressed in either decimal form or hexadecimal form (prepended by `0x`).
`push` opcodes are not used in Huff - literals used directly inside Huff code will be replaced with the smallest suitable `push` instruction by the compiler.
