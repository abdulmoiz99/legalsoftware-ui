import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


export class AddAccounts extends Component {
    static displayName = this.name;
    constructor(props) {
        super(props);
        // form input
        this.state = { modal: false }
        this.state = { _Date: '', _Account: '', _Amount: '', _Description: '' };
        this.state = { renderCurrentBank: false, renderNewBank: false }
        //_e == error
        this.state = { _eDate: false, _eAccount: false, _eAmount: false, _eDescription: false }

        this.FetchRecord()
    }
    componentDidMount() {
        
    }
    isEdit = () => {
        if (this.props.id == '' || this.props.id == undefined) {
            return false;
        }
        else {
            return true;
        }
    }
    FetchRecord = async () => {
        if (this.isEdit()) {
            let url = `api/accounts/getAccountById/?accountId=${this.props.id}`
            const response = await fetch(url);
            const data = await response.json();
            this.setState({ _Date: data.date, _Account: data.transactionTypeId, _Amount: data.amount, _Description: data.description });
        }
    }
    handleChange = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmission = (event) => {
        if (!this.validate()) {
            !this.isEdit() ? this.createTransaction(event) : this.updateTransaction(event)
        }
        event.preventDefault();
    }
    handlePracticeAreaChange = async (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    render() {
        return (
            <div>
                {/*<Button className="btn btn-primary float-right" onClick={this.toggle}>New Transaction</Button>*/}
                <Modal size="lg" isOpen={this.props.modalState} className={this.props.className}>
                    <Form onSubmit={this.handleSubmission}>
                        <ModalHeader toggle={(e) => this.props.onSelect(e)} >{!this.isEdit() ? 'New ' : 'Edit '}Transaction</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleDate">Date</Label>
                                <Input invalid={this.state._eDate} type="date" name="_Date" placeholder="date placeholder" value={this.state._Date} onChange={this.handleChange} />
                                <FormFeedback >Please enter date</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleSelect">Account</Label>
                                <Input invalid={this.state._eAccount} type="select" name="_Account" value={this.state._Account} onChange={this.handleChange}  >
                                    <option> Select Account Type</option>
                                    <option value="1"> Office In</option>
                                    <option value="2"> Office Out</option>
                                    <option value="3"> Client In</option>
                                    <option value="4"> Client Out</option>
                                </Input>
                                <FormFeedback >Please select account</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Amount</Label>
                                <Input invalid={this.state._eAmount} name="_Amount" value={this.state._Amount} onChange={this.handleChange} />
                                <FormFeedback >Please enter amount</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Description</Label>
                                <Input invalid={this.state._eDescription} type="textarea" name="_Description" value={this.state._Description} onChange={this.handleChange} />
                                <FormFeedback >Please enter description</FormFeedback>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" value="Submit" color="primary" >{!this.isEdit() ? 'Add' : 'Update'}</Button>{' '}
                            <Button color="secondary" onClick={(e) => this.props.onSelect(e)}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>

        );
    }

    validate = () => {

        let isError = false;
        !this.state._Date ? this.setState({ _eDate: true }) : this.setState({ _eDate: false })
        !this.state._Date ? isError = false : isError = false

        !this.state._Account ? this.setState({ _eAccount: true }) : this.setState({ _eAccount: false })
        !this.state._Account ? isError = true : isError = false

        !this.state._Amount ? this.setState({ _eAmount: true }) : this.setState({ _eAmount: false })
        !this.state._Amount ? isError = true : isError = false

        !this.state._Description ? this.setState({ _eDescription: true }) : this.setState({ _eDescription: false })
        !this.state._Description ? isError = true : isError = false

        return isError

    }

    createTransaction = async (e) => {
        const { _Date, _Account, _Amount, _Description } = this.state
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Date: _Date,
                Description: _Description,
                Amount: _Amount,
                transactionTypeId: _Account,
                matterId: this.props.matterId, // we are getting this from account.js
            })
        };
        const response = await fetch('api/Accounts/Add', request);
        if (response.status === 200) {
            this.props.onSelect(e)
            this.props.updateContent(e)
        }
        else if (response.status === 401) {
        }
        else {
            this.props.updateContent(e)
        }
    }
    updateTransaction = async (e) => {
        const { _Date, _Account, _Amount, _Description } = this.state
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Id: this.props.id,
                Date: _Date,
                Description: _Description,
                Amount: _Amount,
                transactionTypeId: _Account,
            })
        };
        const response = await fetch('api/Accounts/Update', request);
        if (response.status === 200) {
            this.props.onSelect(e)
            this.props.updateContent(e)

        }
        else if (response.status === 401) {
        }
        else {
            this.props.onSelect(e)
        }
    }
}
export default AddAccounts;