const path = require('path')
const fs = require('fs')
const solc = require('solc')
require('dotenv').config()

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')
const source = fs.readFileSync(lotteryPath, 'utf-8')

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
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

var output = JSON.parse(solc.compile(JSON.stringify(input)))
// console.log(JSON.parse(solc.compile(JSON.stringify(input))))
module.exports = {
  abi: output.contracts['Lottery.sol'].Lottery.abi,
  bytecode: output.contracts['Lottery.sol'].Lottery.evm.bytecode.object,
}
