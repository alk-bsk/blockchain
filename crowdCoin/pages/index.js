import React, { useEffect } from 'react';
import factory from '../ethereum/factory';

export default () => {
    useEffect(() => {
        async function fetchdata() {
            const campaigns = await factory.methods.getDeployedCampaigns().call();
            console.log(campaigns);
        }
        fetchdata();
    }, [])
    return <h1>This is index page</h1>
}