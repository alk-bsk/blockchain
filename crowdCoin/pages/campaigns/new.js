import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

export default function () {
    const [minimumContribution, setMinimumContribution] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minimumContribution).send({
                from: accounts[0]
            })
            Router.pushRoute('/');
        } catch (err) {
            setErrorMsg(err.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label htmlFor="minimumContribution">Minimum Contribution</label>
                    <Input
                        id='minimumContribution'
                        type='text'
                        label="wei"
                        labelPosition='right'
                        value={minimumContribution}
                        onChange={(e) => setMinimumContribution(e.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errorMsg} />
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    )
}
