import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

function ContributeForm({ address }) {
    const [value, setValue] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [load, setLoad] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        setErrMsg('');
        const campaign = Campaign(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            setValue('');
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            setErrMsg(err.message);
        }
        setLoad(false);
    }


    return (
        <Form onSubmit={onSubmit} error={!!errMsg}>
            <Form.Field>
                <label htmlFor='contribute'>Amount to contribute</label>
                <Input
                    id='contribute'
                    type='text'
                    label='ether'
                    labelPosition='right'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Form.Field>
            <Message error header="Oops!" content={errMsg} />
            <Button loading={load} primary>Contribute!</Button>
        </Form>
    );
}

export default ContributeForm;