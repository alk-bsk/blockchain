import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

export default function ReaquestRow({ id, request, address, approversCount }) {
    const { Row, Cell } = Table;
    const [approveLoad, setApproveLoad] = useState(false);
    const [finalizeLoad, setFinalizeLoad] = useState(false);
    const [approveFail, setApproveFail] = useState(false);
    const [finalizeFail, setFinalizeFail] = useState(false);
    const readyToFinalize = request.approvalCount > approversCount / 2;

    const onApprove = async () => {
        setApproveLoad(true);
        setApproveFail(false);
        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(id).send({ from: accounts[0] });
            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setApproveFail(true);
        }
        setApproveLoad(false);
    }

    const onFinalize = async () => {
        setFinalizeLoad(true);
        setFinalizeFail(false);

        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setFinalizeFail(true);
        }
        setFinalizeLoad(false);
    }

    return (
        <Row disabled={request.complete}
            positive={readyToFinalize && !request.complete}
            negative={finalizeFail || approveFail}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value)}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>{request.approvalCount + '/' + approversCount}</Cell>
            <Cell>
                {
                    !request.complete && <Button color='green' loading={approveLoad} basic onClick={onApprove}>Approve</Button>
                }
            </Cell>
            <Cell>
                {
                    !request.complete && <Button color='teal' loading={finalizeLoad} basic onClick={onFinalize}>Finalize</Button>
                }
            </Cell>
        </Row>
    )
}
