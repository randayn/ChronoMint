import AbstractMultisigContractDAO from './AbstractMultisigContractDAO'
import EventEmitter from 'events'

export const walletsManagerFunctions = {
  GET_WALLETS: 'getWallets',
  CREATE_WALLET: 'createWallet'
}

export const walletsManagerEvents = {
  WALLET_CREATED: 'WalletCreated'
}

export const eventParams = {}
eventParams[walletsManagerEvents.WALLET_CREATED] = {
  SELF: 'self',
  WALLET: 'wallet'
}

export default class WalletsManagerDAO extends AbstractMultisigContractDAO {
  constructor (at) {
    super(
      require('chronobank-smart-contracts/build/contracts/WalletsManager.json'),
      at,
      require('chronobank-smart-contracts/build/contracts/MultiEventsHistory.json')
    )
    this._watchEvents()
  }

  async getWallets () {
    const wallets = await this._call(walletsManagerFunctions.GET_WALLETS)
    return wallets
  }

  _emitter = new EventEmitter()

  async _watchEvents () {
    return this._watch(walletsManagerEvents.WALLET_CREATED, async (result) => {
      this._emitter.emit(walletsManagerEvents.WALLET_CREATED, result)
    })
  }

  createWallet = async (walletOwners, requiredSignaturesNum, walletName) => {
    const created = await this._tx(
      walletsManagerFunctions.CREATE_WALLET, [
        walletOwners,
        requiredSignaturesNum,
        this._c.stringToBytes(walletName)
      ], {
        walletOwners,
        requiredSignaturesNum,
        walletName
      }
    )
    return new Promise((resolve, reject) => {
      const handler = result => {
        if (result.transactionHash === created.tx) {
          this._emitter.removeListener(walletsManagerEvents.WALLET_CREATED, handler)
          resolve({
            selfAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].SELF],
            walletAddress: result.args[eventParams[walletsManagerEvents.WALLET_CREATED].WALLET]
          })
        }
      }
      this._emitter.on(walletsManagerEvents.WALLET_CREATED, handler)
    })
  }
}