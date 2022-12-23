import Web3 from "web3";

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are in the browser and metamask is running
    window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://goerli.infura.io/v3/74658c067616470f8e093b19385f4400'
    );
    web3 = new Web3(provider);
}

export default web3;
