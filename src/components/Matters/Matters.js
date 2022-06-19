import React, { Component } from 'react';
import './Matter.css'
import AddMatter from './AddMatter'
import 'bootstrap/dist/css/bootstrap.min.css';

// get our fontawesome imports
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { isAuth } from '../../Shared/Helper'
import { Redirect } from 'react-router-dom';

export class Matters extends Component {

    static displayName = this.name;
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            editModal: false,
            editKey: '',
        }
        this.state = { open: false }

        this.state = { matterList: [], loading: true };
        this.state = { selectedId: 0 }
        this.deleteMatter = this.deleteMatter.bind(this);

    }

    componentDidMount() {
        this.populateMatterData();
        isAuth();
    }

    toggle = () => { this.setState({ modal: !this.state.modal }) };
    toggleAdd = () => { this.setState({ editModal: !this.state.editModal }) }

    async deleteMatter() {
        const response = await fetch('api/Matter/Delete/' + this.state.selectedId, { method: 'DELETE' });
        if (response.ok) {
            this.populateMatterData()
        }
        this.setState({ selectedId: '' })
        this.toggle()
    }

    handleEdit = (id) => {
        this.setState({ editModal: !this.state.editModal, editKey: id })
    }
    renderModal = () => {
        if (this.state.editModal) {
            return (
                <AddMatter
                    id={this.state.editKey}
                    modalState={this.state.editModal}
                    onSelect={this.handleEdit.bind(this)}
                    updateContent={this.populateMatterData.bind(this)} />
            );
        }
    }
    renderMatters(matterList) {

        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Matter</th>
                        <th>Client</th>
                        <th>Responsible Solicitor</th>
                        <th>Practice Area</th>
                        <th>Open Date</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {matterList?.map(matter =>
                        <tr key={matter.Id}>
                            <td><Link to={"/Accounts/" + matter.Id} >{matter.Name}</Link></td>
                            <td>{matter.Client}</td>
                            <td>{matter.ResponsibleSolicitor}</td>
                            <td>{matter.PracticeArea}</td>
                            <td>{matter.OpenDate}</td>
                            <td>
                                <button id={matter.id} type="button" onClick={() => this.handleEdit(matter.Id)} className="btn btn-primary" >
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                                {' '}
                                <button id={matter.id} type="button" onClick={() => this.setState({ selectedId: matter.Id }, this.toggle)} className="btn btn-danger">
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
                        Are you sure to delete this matter?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteMatter}>Detete</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    handleClose = () => {
        this.setState({ open: !this.state.open })

    }
    handleAdd = () => {
        this.setState({ editKey: '' })
        this.toggleAdd()
    }
    render() {
        if (!isAuth()) {
            return (
                <Redirect to="/login" />
            )
        }
        else {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : this.renderMatters(this.state.matterList);
            return (
                <div>
                    <h1>Matters</h1>
                    {contents}
                    {this.renderConfirmation()}
                    {/*<div>*/}
                    {/*    <AddMatter />*/}
                    {/*</div>*/}
                    {this.renderModal()}
                    <Button className="btn btn-primary float-right" onClick={this.handleAdd}>New Matter</Button>
                </div >
            );
        }
    }
    async populateMatterData() {
        const response = await fetch('api/Matter/GetAll');
        const data = await response.json();
        this.setState({ matterList: data, loading: false });
    }
}
