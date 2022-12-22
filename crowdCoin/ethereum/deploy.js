const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compileFactory = require('./build/CampaignFactory.json');
require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');

const factoryAddressPath = path.resolve(__dirname, 'build', 'factoryAddress.txt');
fs.removeSync(factoryAddressPath);

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.GOERLI_INFURA,
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(compileFactory.abi)
        .deploy({ data: compileFactory.evm.bytecode.object })
        .send({ gas: '2000000', from: accounts[0] })

    console.log('Contract deployed to', result.options.address);
    fs.outputFileSync(factoryAddressPath, result.options.address);
    provider.engine.stop();
}

deploy();
