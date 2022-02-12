import React from 'react'
import pt from 'prop-types'
import Peer from './Peer'

const ClientList = ({ clients, requests }) => {
  return (
    <div className="client-list__container">
      <div className="columns is-multiline">
        {clients.map((client, index) => (
          <div key={index+client.userCode} className="column is-flex is-justify-content-center">
            <Peer client={client} requests={requests}/>
          </div>
        ))}
      </div>
    </div>
  )
}

ClientList.propTypes = {
  clients: pt.array,
  requests: pt.object
}

export default ClientList
