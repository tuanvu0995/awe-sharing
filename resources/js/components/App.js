import React from 'react'
import _ from 'lodash'
import { ToastContainer } from 'react-toastify'

import Peer from './Peer'

import FileList from './FileList'
import { withAppContext } from '../context/AppContext'
import JoinRequestPopup from './JoinRequestPopup'

const App = ({ clients, userCode, avatar }) => {
  return (
    <div className="app-container" id="drop-area">
      <JoinRequestPopup />
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
        <Peer client={{ userCode, avatar: avatar }} />
        <p>Drop file to this windows or click here to select a file</p>
        <h3 className="title is-5">Sharing for someone</h3>
      </div>
    </div>
  )
}

const mapContextToProps = (state) => ({
  clients: state.clients,
  userCode: state.userCode,
  avatar: state.avatar,
})

export default withAppContext(App, mapContextToProps)
