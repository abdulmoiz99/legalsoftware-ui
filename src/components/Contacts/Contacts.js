import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// // get our fontawesome imports
// import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { isAuth } from '../../Shared/Helper'
// import { Redirect } from 'react-router-dom';
import AddContacts from './AddContacts';

export class Contacts extends Component {
    static displayName = this.name;
    constructor(props) {
        super(props);
        this.state = { modal: false }
        this.state = { editKey: '' }

        this.state = { editModal: false }
        this.state = { contactList: [], loading: true };
        this.deleteContact = this.deleteContact.bind(this);
    }

    componentDidMount() {
        this.populateContactsData();
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal })
    };
    toggleAdd = () => {
        this.setState({ editModal: !this.state.editModal })
    };
    async deleteContact() {
        const response = await fetch('api/Contacts/Delete/' + this.state.selectedId, { method: 'DELETE' });
        if (response.ok) {
            this.populateContactsData()
        }
        this.setState({ selectedId: '' })
        this.toggle()
    }
    handleEdit = (id) => {
        this.setState({ editModal: !this.state.editModal, editKey: id })
    }

    renderContacts(contactList) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th style={{ width: "5%" }}>Prefix</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contactList?.map(contact =>
                        <tr key={contact.Id}>
                            <td>{contact.Prefix}</td>
                            <td>{contact.FirstName}</td>
                            <td>{contact.LastName}</td>
                            <td>{contact.Email}</td>
                            <td>{contact.ContactNumber}</td>
                            <td>
                                <button id={contact.id} type="button" onClick={() => this.handleEdit(contact.Id)} className="btn btn-primary" >
                                    {/* <FontAwesomeIcon icon={faPencilAlt} /> */}
                                </button>
                                {' '}
                                <button id={contact.Id} type="button" onClick={() => this.setState({ selectedId: contact.Id }, this.toggle)} className="btn btn-danger">
                                    {/* <FontAwesomeIcon icon={faTrash} /> */}
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
                        Are you sure to delete this contact?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteContact}>Detete</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    renderModal = () => {
        if (this.state.editModal) {
            return (
                <AddContacts id={this.state.editKey} modalState={this.state.editModal} onSelect={this.handleEdit.bind(this)} updateContent={this.populateContactsData.bind(this)} />
            );
        }
    }
    handleAdd = () => {
        this.setState({ editKey: '' })
        this.toggleAdd()

    }
    render() {
        if (!isAuth()) {
            // return (
            //     <Redirect to="/login" />
            // )
        }
        else {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : this.renderContacts(this.state.contactList);
            return (
                <div>
                    <h1>Contacts</h1>
                    {contents}
                    {this.renderConfirmation()}
                    {this.renderModal()}
                    <Button className="btn btn-primary float-right" onClick={this.handleAdd}>New Contact</Button>
                </div >
            );
        }
    }
    populateContactsData = async () => {
        const response = await fetch('api/contacts/GetAll'); // should be update later on...
        const data = await response.json();
        this.setState({ contactList: data, loading: false });
    }
}
