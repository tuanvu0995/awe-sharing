import React from 'react'
import _ from 'lodash'
import { ToastContainer } from 'react-toastify'

import Peer from './Peer'

import { withAppContext } from '../context/AppContext'

const App = ({ clients, user }) => {
  return (
    <div className="app-container" id="drop-area">
      <ToastContainer />
      <div className="client-list__container">
        <div className="columns is-multiline">
          {clients.map((client, index) => (
            <div key={index + client.userCode} className="column is-flex is-justify-content-center">
              <Peer client={client} />
            </div>
          ))}
        </div>
      </div>
      <div className="personal-peer__container">
        <Peer client={user} />
        <p>Drop file to this windows or click here to select a file</p>
        <h3 className="title is-5">Sharing for someone</h3>
      </div>
    </div>
  )
}

const mapContextToProps = (state) => ({
  clients: state.clients,
  user: state.user,
})

export default withAppContext(App, mapContextToProps)
