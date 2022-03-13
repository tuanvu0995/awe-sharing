/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Avatar from 'App/Models/Avatar'
import Room from 'App/Models/Room'
import User from 'App/Models/User'
import Ws from 'App/Services/Ws'
import WsRoom from 'App/Services/WsRoom'

Route.get('/', async ({ view, auth }) => {
  const state = {
    user: auth.user,
  }
  return view.render('home', state)
}).as('home')

Route.get('login', ({ view }) => {
  return view.render('login')
}).as('login')

Route.group(() => {
  Route.get(':provider/redirect', 'AuthController.redirect').as('redirect')
  Route.get(':provider/callback', 'AuthController.callback').as('callback')
  Route.get('logout', 'AuthController.logout').as('logout')
})
  .as('auth')
  .prefix('auth')

Route.post('room', async ({ response, session }) => {
  const user = await User.findBy('user_type', 'anonymous')
  const room = await user?.related('rooms').create({ userCode: session.get('user_code') })
  if (!room) {
    return response.status(403).json({ message: 'bad request' })
  }

  return response.redirect().toRoute('room.detail', { rid: room.rid })
}).as('room.create')

Route.get('r/:rid', async ({ request, view, response, session }) => {
  const rid = request.param('rid')
  if (!rid) {
    return response.status(403).json({ message: 'bad request' })
  }
  const room = await Room.findByOrFail('rid', rid)
  const userCode = session.get('user_code')
  const userToken = session.get('user_token')
  const isHost = room.userCode === userCode
  const avatar = await Avatar.findBy('user_code', userCode)
  const avatarData = avatar?.data || ''

  if (!Ws.isRoomExists(room.rid)) {
    const wsRoom = new WsRoom(room.rid)
    Ws.addRoom(wsRoom)
  }

  if (isHost) {
    const wsRoom = Ws.getRoom(room.rid)
    wsRoom.addClient({
      userCode,
      avatar: avatarData,
      isHost,
      connected: false,
    })
  }

  return view.render('room', {
    room: room.toJSON(),
    userCode,
    isHost,
    avatar: avatarData,
    token: userToken,
    title: userCode,
  })
}).as('room.detail')
