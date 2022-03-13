import Encryption from '@ioc:Adonis/Core/Encryption'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index(ctx: HttpContextContract) {
    if (ctx.auth.isGuest) {
      return this.renderHome(ctx)
    }

    return this.renderBoard(ctx)
  }

  /**
   * Render guest page
   */
  private async renderHome({ view }: HttpContextContract) {
    return view.render('home')
  }

  /**
   * Render user page
   */
  private async renderBoard({ view, auth }: HttpContextContract) {
    const user = auth.user
    const token = await Encryption.encrypt(user?.uid)
    const state = {
      user,
      token: token,
    }

    return view.render('board', state)
  }
}
