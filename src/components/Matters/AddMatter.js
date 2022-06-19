import React, { Component } from 'react';
import './Matter.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, FormGroup, Label, Input, FormFeedback, FormText } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


export class AddMatter extends Component {
    static displayName = AddMatter.name;
    constructor(props) {
        super(props);
        // form input
        this.state = { modal: false }
        this.state = { _client: '', _matterDescription: '', _responsibleSolicitor: '', _practiceArea: '', _address: '', _currentBank: '', _newBank: '', _openDate: '' };
        this.state = { clientList: [], clientLoaded: false, solicitorsList: [], solicitorsLoaded: false, practiceAreasList: [], practiceAreasLoaded: false };
        this.state = { renderCurrentBank: false, renderNewBank: false }
        //_e == error
        this.state = { _eClient: false, _eMatterDescription: false, _eSolicitor: false, _ePracticeArea: false, _eAddress: false, _eCurrentBank: false, _eNewBank: false, _eDate: false }

        //const values 
        this.RemortageValue = "3"

        this.FetchRecord()

    }


    componentDidMount() {
        this.populateClients();
        this.populateSolicitors();
        this.populatePracticeAreas();
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
            let url = `api/matter/getMatterById/?matterId=${this.props.id}`
            const response = await fetch(url);
            const data = await response.json();
            this.setState({ _client: data.clientId, _matterDescription: data.description, _responsibleSolicitor: data.responsibleSolicitorId, _practiceArea: data.practiceAreaId, _address: data.address, _currentBank: data.currentBank, _newBank: data.newBank , _openDate: data.openDate});
        }
    }
    handleChange = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmission = (event) => {
        if (!this.validate()) {
            !this.isEdit() ? this.createMatter(event) : this.updateMatter(event)
        }
        event.preventDefault();
    }

    handlePracticeAreaChange = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value == this.RemortageValue) {
            this.setState({ renderCurrentBank: true, renderNewBank: true })
        }
        else {
            this.setState({ renderCurrentBank: false, renderNewBank: false })
        }
    }
    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modalState} className={this.props.className}>
                    <Form onSubmit={this.handleSubmission}>
                        <ModalHeader toggle={(e) => this.props.onSelect(e)} >{!this.isEdit() ? 'New ' : 'Edit '}Matter</ModalHeader>
                        <ModalBody>

                            <FormGroup>
                                <Label for="exampleSelect">Client</Label>
                                <Input invalid={this.state._eClient} type="select" name="_client" value={this.state._client} onChange={this.handleChange}  >
                                    <option>Select Client</option>
                                    {this.state.clientList?.map(client => (
                                        <option value={client.id}>
                                            {client.displayName}
                                        </option>
                                    ))}
                                </Input>
                                <FormFeedback >Please select client</FormFeedback>
                            </FormGroup>

                            <FormGroup>
                                <Label for="exampleText">Matter Description</Label>
                                <Input invalid={this.state._eMatterDescription} type="textarea" name="_matterDescription" value={this.state._matterDescription} onChange={this.handleChange} />
                                <FormFeedback >Please enter matter description</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleSelect">Responsible Solicitor</Label>
                                <Input invalid={this.state._eSolicitor} type="select" name="_responsibleSolicitor" value={this.state._responsibleSolicitor} onChange={this.handleChange} >
                                    <option>Select Responsible Solicitor</option>
                                    {this.state.solicitorsList?.map(solicitor => (
                                        <option value={solicitor.id}>
                                            {solicitor.displayName}
                                        </option>
                                    ))}
                                </Input>
                                <FormFeedback >Please select responsible solicitor</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleSelect">Practice Area</Label>
                                <Input invalid={this.state._ePracticeArea} type="select" name="_practiceArea" value={this.state._practiceArea} onChange={this.handlePracticeAreaChange}>
                                    <option>Select Practice Area</option>
                                    {this.state.practiceAreasList?.map(practiceArea => (
                                        <option value={practiceArea.id}>
                                            {practiceArea.displayName}
                                        </option>
                                    ))}
                                </Input>
                                <FormFeedback >Please select practice area</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Address</Label>
                                <Input invalid={this.state._eAddress} name="_address" value={this.state._address} onChange={this.handleChange} />
                                <FormFeedback >Please enter address</FormFeedback>
                            </FormGroup>

                            <FormGroup>
                                {this.state.renderCurrentBank == true ?
                                    <div>
                                        <Label for="exampleEmail">Current Bank</Label>
                                        <Input invalid={this.state._eCurrentBank} name="_currentBank" value={this.state._currentBank} onChange={this.handleChange} />
                                        <FormFeedback >Please enter current bank</FormFeedback>
                                    </div> : null}
                            </FormGroup>

                            <FormGroup>
                                {this.state.renderNewBank ?
                                    <div>
                                        <Label for="exampleEmail">New Bank</Label>
                                        <Input invalid={this.state._eNewBank} name="_newBank" value={this.state._newBank} onChange={this.handleChange} />
                                        <FormFeedback >Please enter new bank</FormFeedback>
                                    </div> : null}
                            </FormGroup>

                            <FormGroup>
                                <Label for="exampleDate">Date</Label>
                                <Input invalid={this.state._eDate} type="date" name="_openDate" placeholder="date placeholder" value={this.state._openDate} onChange={this.handleChange} />
                                <FormFeedback >Please enter date</FormFeedback>
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
    async populateClients() {
        const response = await fetch('api/GetClients');
        const data = await response.json();
        this.setState({ clientList: data, clientLoaded: true });
    }
    async populateSolicitors() {
        const response = await fetch('api/GetSolicitors');
        const data = await response.json();
        this.setState({ solicitorsList: data, solicitorsLoaded: true });
    }
    async populatePracticeAreas() {
        const response = await fetch('api/GetPracticeAreas');
        const data = await response.json();
        this.setState({ practiceAreasList: data, practiceAreasLoaded: true });
    }


    validate = () => {

        let isError = false;
        !this.state._client ? this.setState({ _eClient: true }) : this.setState({ _eClient: false })
        !this.state._client ? isError = false : isError = false

        !this.state._matterDescription ? this.setState({ _eMatterDescription: true }) : this.setState({ _eMatterDescription: false })
        !this.state._matterDescription ? isError = true : isError = false

        !this.state._responsibleSolicitor ? this.setState({ _eSolicitor: true }) : this.setState({ _eSolicitor: false })
        !this.state._responsibleSolicitor ? isError = true : isError = false

        !this.state._practiceArea ? this.setState({ _ePracticeArea: true }) : this.setState({ _ePracticeArea: false })
        !this.state._practiceArea ? isError = true : isError = false

        !this.state._address ? this.setState({ _eAddress: true }) : this.setState({ _eAddress: false })
        !this.state._address ? isError = true : isError = false

        if (this.state._practiceArea == this.RemortageValue) {
            !this.state._currentBank ? this.setState({ _eCurrentBank: true }) : this.setState({ _eCurrentBank: false })
            !this.state._currentBank ? isError = true : isError = false

            !this.state._newBank ? this.setState({ _eNewBank: true }) : this.setState({ _eNewBank: false })
            !this.state._newBank ? isError = true : isError = false
        }
        else {
            this.setState({ _currentBank: "", _eCurrentBank: "" })
            this.setState({ _eCurrentBank: false, _eNewBank: false })
        }
        !this.state._openDate ? this.setState({ _eDate: true }) : this.setState({ _eDate: false })
        !this.state._openDate ? isError = true : isError = false
        return isError

    }
    createMatter = async (e) => {

        const { _client, _matterDescription, _responsibleSolicitor, _practiceArea, _address, _currentBank, _newBank, _openDate } = this.state
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Client: _client,
                MatterDescription: _matterDescription,
                ResponsibleSolicitor: _responsibleSolicitor,
                PracticeArea: _practiceArea,
                Address: _address,
                CurrentBank: _currentBank,
                NewBank: _newBank,
                OpenDate: _openDate
            })
        };
        const response = await fetch('api/matter/Add', request);
        ////const data = await response.json();
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
    updateMatter = async (e) => {

        const { _client, _matterDescription, _responsibleSolicitor, _practiceArea, _address, _currentBank, _newBank, _openDate } = this.state
        console.log(this.state._client)
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Id: this.props.id,
                Client: _client,
                MatterDescription: _matterDescription,
                ResponsibleSolicitor: _responsibleSolicitor,
                PracticeArea: _practiceArea,
                Address: _address,
                CurrentBank: _currentBank,
                NewBank: _newBank,
                OpenDate: _openDate
            })
        };
        const response = await fetch('api/matter/Update', request);
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
}
export default AddMatter;