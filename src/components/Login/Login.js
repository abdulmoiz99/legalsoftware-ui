import React, { Component } from 'react';
import './Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { setStorage, clearStorage } from "../../Shared/LocalStorage"



export class Login extends Component {

    static displayName = Login.name;
    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };
        this.state = { showing: false, isProcessing: false };

        this.handleSubmission = this.handleSubmission.bind(this);
        this.handleChange = this.handleChange.bind(this)
        console.log("Reached login")
        //clear local storage
        clearStorage();

    }
    async handleSubmission(event) {
        this.setState({ isProcessing: true })
        const { username, password } = this.state
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        const response = await fetch('api/user/login', requestOptions);
        const data = await response.json();
        // when response is sucess
        if (response.status === 200) { 
            setStorage('token', data.RoleId); // save value in local storage
            window.location.href = '/Matter'
        }
        else if (response.status === 401) {
            this.setState({ showing: true });
        }
        this.setState({ isProcessing: false })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    render() {
        return (
            <div>
                <div class="login-form">
                    <form onSubmit={this.handleSubmission}>
                        {this.state.showing ?
                            <div class="alert alert-danger">
                                Invalid username or password.
                              </div>
                            : null
                        }
                        <h2 class="text-center">Log in</h2>
                        <div class="form-group">
                            <input name="username" value={this.state.username} type="text" class="form-control" placeholder="Username" onChange={this.handleChange} required />
                        </div>
                        <div class="form-group">
                            <input name="password" value={this.state.password} type="password" class="form-control" placeholder="Password" onChange={this.handleChange} required />
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary btn-block">
                                {this.state.isProcessing ? <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : null}
                                 Log in
                            </button>
                        </div>

                        <div>
                        </div>
                        <div class="clearfix">
                            <a href="#" class="pull-right">Forgot Password?</a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
