import './App.css';
import { useEffect, useState } from 'react';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [ethValue, setEthValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    lottery.methods.manager().call().then(data => setManager(data));
    lottery.methods.getPlayers().call().then(data => setPlayers(data));
    web3.eth.getBalance(lottery.options.address).then(data => setBalance(data));
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(ethValue, 'ether')
      });
      setMessage('you have been entered!');
    } catch (err) {
      setMessage('Transaction have been rejected!');
    }

  }

  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage('A winner has been picked!');
  }

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players.length} people entered,
        compting to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>&nbsp;
          <input type='text' value={ethValue} onChange={e => setEthValue(e.target.value)} />
          &nbsp;
          <button type='submit'>Enter</button>
        </div>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
