import React from 'react'
import Layout from '../../../components/Layout'
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import ReaquestRow from '../../../components/ReaquestRow';

function RequestsIndex({ address, requests, requestCount, approversCount }) {
    const { Header, Row, HeaderCell, Body } = Table;

    const renderRows = () => {
        return requests.map((request, index) => {
            return <ReaquestRow key={index} id={index} approversCount={approversCount} request={request} address={address} />
        })
    }

    return (
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated='right' style={{ marginBottom: 10 }}>Add Request</Button>
                </a>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>Id</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows()}
                </Body>
            </Table>
            <div>Found {requestCount} requests.</div>
        </Layout>
    )
}

RequestsIndex.getInitialProps = async (props) => {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call();
        })
    )
    return { address, requests, requestCount, approversCount };
}

export default RequestsIndex;
