import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        username: 'anonymous',
        email: 'anonymous@abc.com',
        password: 'Toicoyeu7@#%',
        userType: 'anonymous',
        accountStatus: 'active',
      },
    ])
  }
}
