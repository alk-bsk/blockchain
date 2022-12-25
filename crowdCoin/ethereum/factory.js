import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x2F6CAEAF6CA6F51632f16ED0163f185b13E77185'
);

export default instance;