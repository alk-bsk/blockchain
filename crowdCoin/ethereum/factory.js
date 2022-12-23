import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x255D78446c17952C39e55A7b7F581AEEFEde11bb'
);

export default instance;