import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';

function RequestNew({ address }) {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipint] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [load, setLoad] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        setErrMsg('');
        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });
            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setErrMsg(err.message);
        }
        setLoad(false);
    }

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>
                    Back
                </a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label htmlFor='description'>Description</label>
                    <Input
                        id='description'
                        type='text'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor='ether'>Value for Ether</label>
                    <Input
                        id='ether'
                        type='text'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor='recipient'>Recipient</label>
                    <Input
                        id='recipient'
                        type='text'
                        value={recipient}
                        onChange={(e) => setRecipint(e.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errMsg} />
                <Button loading={load} primary>Create!</Button>
            </Form>
        </Layout>
    )
}

RequestNew.getInitialProps = async (props) => {
    const { address } = props.query;
    return { address };
}

export default RequestNew;
