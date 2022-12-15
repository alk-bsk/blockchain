const path = require('path')
const fs = require('fs')
var solc = require('solc')
require('dotenv').config()

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
const source = fs.readFileSync(inboxPath, 'utf-8')

var input = {
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts["Inbox.sol"].Inbox);

var output = JSON.parse(solc.compile(JSON.stringify(input)))

module.exports = {
  abi: output.contracts['Inbox.sol'].Inbox.abi,
  bytecode: output.contracts['Inbox.sol'].Inbox.evm.bytecode.object,
}
