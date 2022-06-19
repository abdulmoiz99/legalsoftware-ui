import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// get our fontawesome imports
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddAccounts from './AddAccounts';

export class Accounts extends Component {
    static displayName = this.name;
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            editModal: false,
            editKey: '',
            selectedId: 0,

            accountsList: [], loading: true
        }
    }

    componentDidMount() {
        this.populateAccountsData();
    }

    toggle = () => { this.setState({ modal: !this.state.modal }) }
    toggleAdd = () => { this.setState({ editModal: !this.state.editModal }) }

    deleteTransaction = async () => {
        const response = await fetch('api/Accounts/Delete/' + this.state.selectedId, { method: 'DELETE' });
        if (response.ok) {
            this.populateAccountsData()
        }
        this.setState({ selectedId: '' })
        this.toggle()
    }
    handleEdit = (id) => {
        this.setState({ editModal: !this.state.editModal, editKey: id })
    }
    renderAccounts(accountsList) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th style={{ width: "30%" }}>Details</th>
                        <th>Office Credit</th>
                        <th>Office Debit</th>
                        <th>Office Balance</th>
                        <th>Client Credit</th>
                        <th>Client Debit</th>
                        <th>Client Balance</th>
                        <th style={{ width: "10%" }}>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {accountsList?.map(account =>
                        <tr key={account.Id}>
                            <td>{account.Date}</td>
                            <td>{account.Details}</td>
                            <td>{account.OfficeDebit}</td>
                            <td>{account.OfficeCredit}</td>
                            <td>{account.OfficeBalance}</td>
                            <td>{account.ClientDebit}</td>
                            <td>{account.ClientCredit}</td>
                            <td>{account.ClientBalance}</td>
                            <td>
                                <button id={account.id} type="button" onClick={() => this.handleEdit(account.Id)} className="btn btn-primary" >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                {' '}
                                <button id={account.Id} type="button" onClick={() => this.setState({ selectedId: account.Id }, this.toggle)} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    renderConfirmation() {
        return (
            <div>

                <Modal isOpen={this.state.modal} backdropTransition={{ timeout: 200 }}
                    toggle={this.toggle} className={this.props.className} >
                    <ModalHeader toggle={this.toggle}>Confirmation</ModalHeader>
                    <ModalBody>
                        Are you sure to delete this transaction?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteTransaction}>Detete</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    renderModal = () => {
        if (this.state.editModal) {
            return (
                <AddAccounts id={this.state.editKey} matterId={this.props.match.params.id} modalState={this.state.editModal} onSelect={this.handleEdit.bind(this)} updateContent={this.populateAccountsData.bind(this)} />
            );
        }
    }
    handleAdd = () => {
        this.setState({ editKey: '' })
        this.toggleAdd()
    }
    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderAccounts(this.state.accountsList);
        return (
            <div>
                <h1>Accounts</h1>
                {contents}
                {this.renderConfirmation()}
                {/*<div>*/}
                {/*    <AddAccounts matterId={this.props.match.params.id} />*/}
                {/*</div>*/}
                {this.renderModal()}
                <Button className="btn btn-primary float-right" onClick={this.handleAdd}>New Transaction</Button>

            </div >
        );
    }
    async populateAccountsData() {
        let url = `api/accounts/getAccounts/?matterId=${this.props.match.params.id}`
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ accountsList: data, loading: false });
    }
}
