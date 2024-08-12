const esprima = require("esprima")
const fs = require("fs")

function JS2AST(program)
{
  const tokens = esprima.parseScript(program, {loc: true, comment: true, attachComment: true});
  return tokens;
}

module.exports = {JS2AST}