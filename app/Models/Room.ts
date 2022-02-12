import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { nanoid } from 'nanoid'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rid: string

  @column()
  public maxConnect?: number

  @column()
  public expried?: boolean

  @column()
  public deleted?: boolean

  @column()
  public options?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @column()
  public userCode?: string

  @beforeCreate()
  public static async makeUid(room: Room) {
    room.rid = nanoid(7)
  }
}
