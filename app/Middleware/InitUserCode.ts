import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AvatarGenter from 'App/Services/AvatarGenter'
import { nanoid } from 'nanoid'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Avatar from 'App/Models/Avatar'

export default class InitUserCode {
  public async handle({ session }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!session.has('user_code')) {
      const code = nanoid(10)
      session.put('user_code', code)
      session.put('user_token', Encryption.encrypt(code))
      await Avatar.create({
        userCode: code,
        data: AvatarGenter.buildAvatar(),
      })
    }
    await next()
  }
}
