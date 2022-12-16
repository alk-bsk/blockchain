const Web3 = require('web3')
const ganache = require('ganache')
const assert = require('assert')
const { abi, bytecode } = require('../compiler')

const web3 = new Web3(ganache.provider())

let lottery
let accounts

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottert contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(players[0], accounts[0])
    assert.equal(players.length, 1)
  })

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(players[0], accounts[0])
    assert.equal(players[1], accounts[1])
    assert.equal(players[2], accounts[2])
    assert.equal(players.length, 3)
  })

  it('requires a minimum number of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('only manager can call pickwinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('sends money to the winner and reset the player array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    })

    const initialBalance = await web3.eth.getBalance(accounts[0])

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = finalBalance - initialBalance

    assert(difference > web3.utils.toWei('1.8', 'ether'))
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(players.length, 0)
    const contractBalance = await web3.eth.getBalance(lottery.options.address)
    assert.equal(contractBalance, 0)
  })
})
