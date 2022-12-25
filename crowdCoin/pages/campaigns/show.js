import React from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

function show(props) {
    const renderCard = () => {

        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campign and can create request to withdrwal money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (wei)',
                description: 'You must contribute atleast this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend'
            }
        ]

        return <Card.Group items={items} />
    }

    return (
        <Layout>
            <h3>Campaign show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderCard()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={props.address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${props.address}/requests`}>
                            <a><Button primary>View Requests</Button></a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}

show.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
        address: props.query.address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
    };
}

export default show;
