import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SendToExchangeForm from './SendToExchangeForm'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import TokenModel from 'models/TokenModel'
import { modalsClose } from 'redux/modals/actions'
import { sendAsset } from 'redux/locs/actions'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import lhtDAO from 'dao/LHTDAO'

const mapDispatchToProps = (dispatch) => ({
  send: async (value) => {
    const exchangeDAO = await contractsManagerDAO.getDemoExchange()
    dispatch(sendAsset(
      new TokenModel({dao: lhtDAO}),
      exchangeDAO.getInitAddress(),
      value
    ))
  },
  closeModal: () => dispatch(modalsClose())
})

@connect(null, mapDispatchToProps)
class SendToExchangeModal extends Component {

  static propTypes = {
    send: PropTypes.func,
    closeModal: PropTypes.func,
    allowed: PropTypes.object
  }

  handleSubmitSuccess = (value) => {
    this.props.closeModal()
    this.props.send(value)
  }

  render () {
    return (
      <ModalDialogBase title='locs.sendLHToExchange'>
        <SendToExchangeForm
          onSubmitSuccess={this.handleSubmitSuccess}
          allowed={this.props.allowed}
        />
      </ModalDialogBase>
    )
  }
}

export default SendToExchangeModal
