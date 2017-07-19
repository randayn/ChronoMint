import React from 'react'
import { Translate } from 'react-redux-i18n'
import { abstractNoticeModel } from './AbstractNoticeModel'
import type TokenModel from 'models/TokenModel'

export const IS_ADDED = 'isAdded'
export const IS_MODIFIED = 'isModified'
export const IS_REMOVED = 'isRemoved'

export default class TokenNoticeModel extends abstractNoticeModel({
  token: null,
  status: null
}) {
  constructor (token: TokenModel, time, isRemoved = false, isAdded = true) {
    super({
      token,
      time,
      status: isRemoved ? IS_REMOVED : (isAdded ? IS_ADDED : IS_MODIFIED)
    })
  }

  token (): TokenModel {
    return this.get('token')
  }

  isRemoved () {
    return this.get('status') === IS_REMOVED
  }

  message () {
    return <Translate value={'notices.settings.erc20.tokens.' + this.get('status')}
                      symbol={this.token().symbol()} name={this.token().name()} />
  }
}