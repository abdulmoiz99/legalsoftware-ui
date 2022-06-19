
import React, { Component } from 'react'
import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Login } from './components/Login/Login'
import { Counter } from './components/Counter'

import 'bootstrap/dist/css/bootstrap.css';


export default class App extends Component {
  static displayName = App.name
  constructor(props) {
    super(props)
    console.log('Hello')
    this.state = { isLogIn: true }
  }

  render() {
    return (
      <Layout login={this.state.isLogIn}>
        <Routes>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Counter" element={<Counter />}></Route>

        </Routes>
      </Layout>
    )
  }
}
