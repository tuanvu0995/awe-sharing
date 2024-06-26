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

Route.get('/', 'HomeController.index').as('home')

Route.get('login', ({ view }) => view.render('login')).as('login')

Route.group(() => {
  Route.get(':provider/redirect', 'AuthController.redirect').as('redirect')
  Route.get(':provider/callback', 'AuthController.callback').as('callback')
  Route.get('logout', 'AuthController.logout').as('logout')
})
  .as('auth')
  .prefix('auth')
