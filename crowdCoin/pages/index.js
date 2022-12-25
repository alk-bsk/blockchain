import React, { useEffect } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

function CampaignIndex({ campaigns }) {

    const renderCampaigns = () => {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link >
                ),
                fluid: true
            }
        })

        return <Card.Group items={items} />;
    }

    return <div>
        <Layout>
            <h3>Open Campaigns</h3>
            <Link route="/campaigns/new"><a>
                <Button
                    floated='right'
                    content="Create Campaign"
                    icon="add circle"
                    primary
                />
            </a></Link>
            {renderCampaigns()}
        </Layout>
    </div>
}

CampaignIndex.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
}

export default CampaignIndex;