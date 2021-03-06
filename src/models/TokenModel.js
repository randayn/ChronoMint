import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'
import type AbstractTokenDAO from 'dao/AbstractTokenDAO'
import type ERC20DAO from 'dao/ERC20DAO'

export default class TokenModel extends abstractFetchingModel({
  dao: null,
  address: null,
  decimals: null,
  name: null,
  symbol: null,
  balance: new BigNumber(0),
  allowance: new Immutable.Map(),
  url: null,
  icon: null
}) {
  dao (): AbstractTokenDAO | ERC20DAO {
    return this.get('dao')
  }

  symbol () {
    return this.dao() ? this.dao().getSymbol() : this.get('symbol')
  }

  setSymbol (v): TokenModel {
    return this.set('symbol', v)
  }

  id () {
    return this.symbol()
  }

  name () {
    return this.get('name')
  }

  address () {
    return this.dao() ? this.dao().getInitAddress() : this.get('address')
  }

  decimals () {
    return this.dao() ? this.dao().getDecimals() : this.get('decimals')
  }

  balance (): BigNumber {
    return isNaN(this.get('balance')) ? new BigNumber(0) : this.get('balance')
  }
  
  updateBalance (isCredited, amount: BigNumber): TokenModel {
    const newBalance = this.balance()[isCredited ? 'plus' : 'minus'](amount)
    return this.set('balance', newBalance)
  }

  setBalance (newBalance: BigNumber): TokenModel {
    return this.set('balance', newBalance)
  }
  
  allowance (spender): BigNumber {
    return this.get('allowance').get(spender) || new BigNumber(0)
  }
  
  setAllowance (spender, value): TokenModel {
    return this.set('allowance', this.get('allowance').set(spender, value))
  }

  url () {
    return this.get('url')
  }

  icon () {
    return this.get('icon')
  }

  // noinspection JSUnusedGlobalSymbols
  summary () {
    return {
      address: this.address(),
      decimals: this.decimals(),
      name: this.name(),
      symbol: this.symbol(),
      url: this.url(),
      icon: this.icon()
    }
  }
}

// TODO @bshevchenko: MINT-315 add max length for bytes32 variables
export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.decimals = ErrorList.toTranslate(validator.between(values.get('decimals'), 0, 18))
  errors.url = ErrorList.toTranslate(validator.url(values.get('url'), false))

  if (!/^[A-Z]{2,4}$/.test(values.get('symbol'))) {
    errors.symbol = ErrorList.toTranslate('settings.erc20.tokens.errors.invalidSymbol')
  }

  return errors
}
