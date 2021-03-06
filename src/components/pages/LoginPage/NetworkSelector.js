import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MenuItem, SelectField } from 'material-ui'
import { clearErrors, selectNetwork } from '../../../redux/network/actions'
import styles from './styles'

const mapStateToProps = (state) => ({
  selectedNetworkId: state.get('network').selectedNetworkId,
  networks: state.get('network').networks
})

const mapDispatchToProps = (dispatch) => ({
  selectNetwork: (network) => dispatch(selectNetwork(network)),
  clearErrors: () => dispatch(clearErrors())
})

@connect(mapStateToProps, mapDispatchToProps)
export default class NetworkSelector extends Component {

  static propTypes = {
    clearErrors: PropTypes.func,
    selectNetwork: PropTypes.func,
    selectedNetworkId: PropTypes.number,
    networks: PropTypes.array,
    onSelect: PropTypes.func
  }

  handleChange = (event, index, value) => {
    this.props.clearErrors()
    this.props.selectNetwork(value)
    this.props.onSelect()
  }

  render () {
    const {selectedNetworkId, networks} = this.props
    return (
      <SelectField
        floatingLabelText='Network'
        onChange={this.handleChange}
        value={selectedNetworkId}
        fullWidth
        {...styles.selectField}>
        {networks && networks.map(n => <MenuItem key={n.id} value={n.id} primaryText={n.name} />)}
      </SelectField>
    )
  }
}
