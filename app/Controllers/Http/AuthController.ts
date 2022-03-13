import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AvatarGenter from 'App/Services/AvatarGenter'

export default class AuthController {
  /**
   * Redirect
   * @param param: HttpContextContract
   * @returns
   */
  public async redirect({ ally, request }: HttpContextContract) {
    const provider = request.param('provider')
    const providers = ['github', 'google']
    if (!providers.includes(provider)) {
      return `Provider "${provider}" is not valid`
    }
    return ally.use('github').redirect()
  }

  /**
   * Callback
   * @param param: HttpContextContract
   * @returns
   */
  public async callback({ ally, request, response, auth }: HttpContextContract) {
    const provider = request.param('provider')
    const providers = ['github', 'google']
    if (!providers.includes(provider)) {
      throw new Error(`Provider "${provider}" is not valid`)
    }

    const allProvider = ally.use(provider)

    if (allProvider.accessDenied()) {
      return 'Access was denied'
    }

    if (allProvider.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (allProvider.hasError()) {
      return allProvider.getError()
    }

    const socialUser = await allProvider.user()
    const avatar = AvatarGenter.buildAvatar()

    const user = await User.firstOrCreate(
      {
        email: socialUser.email,
      },
      {
        name: socialUser.name || socialUser.original.login,
        avatar,
        accessToken: socialUser.token.token,
        accountStatus: socialUser.emailVerificationState === 'verified' ? 'verified' : 'pending',
      }
    )
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  /**
   * Logout
   * @param param HttpContextContract
   */
  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
