// TODO new operations
/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import globalStyles from '../../styles'
import { Translate } from 'react-redux-i18n'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter
} from 'material-ui/Table'
import { RaisedButton, FloatingActionButton, FontIcon, Paper, Divider, CircularProgress } from 'material-ui'
import OperationModel from '../../models/OperationModel'
import { grey500 } from 'material-ui/styles/colors'
import { getEtherscanUrl } from '../../network/settings'
import withSpinner from '../../hoc/withSpinner'
import {
  listOperations,
  confirmOperation,
  revokeOperation,
  openOperationsSettings,
  loadMoreCompletedOperations
} from '../../redux/operations/actions'
import './OperationsPage.scss'

const styles = {
  actionButton: {
    fill: grey500,
    marginRight: 20
  },
  floatingActionButton: {
    marginTop: '-45px',
    right: '45px',
    position: 'absolute'
  },
  pending: {
    desc: {
      width: '55%'
    },
    signs: {
      width: '25%',
      textAlign: 'center'
    },
    actions: {}
  },
  completed: {
    desc: {
      width: '74%'
    },
    actions: {
      width: '26%'
    }
  }
}

const mapStateToProps = (state) => {
  const operations = state.get('operations')
  return {
    list: operations.list,
    isFetched: operations.isFetched,
    isFetching: operations.isFetching && !operations.isFetched,
    completedFetching: operations.isFetching,
    completedEndOfList: operations.completedEndOfList,
    required: operations.required,
    selectedNetworkId: state.get('network').selectedNetworkId,
    selectedProviderId: state.get('network').selectedProviderId
  }
}

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listOperations()),
  confirm: (operation: OperationModel) => dispatch(confirmOperation(operation)),
  revoke: (operation: OperationModel) => dispatch(revokeOperation(operation)),
  openSettings: () => dispatch(openOperationsSettings()),
  handleLoadMore: () => dispatch(loadMoreCompletedOperations())
})

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class OperationsPage extends Component {
  componentWillMount () {
    if (!this.props.isFetched && !this.props.isFetching) {
      this.props.getList()
    }
  }

  render () {
    const list = this.props.list.valueSeq().sortBy(o => o.tx().time()).reverse()
    const etherscanHref = (txHash) => getEtherscanUrl(this.props.selectedNetworkId, this.props.selectedProviderId, txHash)
    return (
      <div>
        <span style={globalStyles.navigation}>
          <Translate value='nav.project'/> / <Translate value='nav.operations'/>
        </span>

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='terms.pending'/></h3>
          <Divider />

          <FloatingActionButton style={styles.floatingActionButton} onTouchTap={this.props.openSettings.bind(null)}>
            <FontIcon className='material-icons'>settings</FontIcon>
          </FloatingActionButton>

          {this.props.list.filter(o => !o.isDone()).size > 0 ? <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={styles.pending.desc}>
                  <Translate value='operations.desc'/>
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.pending.signs}>
                  <Translate value='operations.signs'/>
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.pending.actions}>
                  <Translate value='nav.actions'/>
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {list.filter(o => !o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.pending.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.signs}>{item.remained()}</TableRowColumn>
                  <TableRowColumn style={styles.pending.actions}>
                    {item.isFetching()
                      ? <CircularProgress size={24} thickness={1.5} style={{float: 'right'}}/>
                      : <div>
                        {item.isConfirmed()
                          ? <RaisedButton label={<Translate value='operations.revoke'/>}
                                          style={styles.actionButton}
                                          onTouchTap={this.props.revoke.bind(null, item)}/>
                          : <RaisedButton label={<Translate value='operations.sign'/>}
                                          primary
                                          style={styles.actionButton}
                                          onTouchTap={this.props.confirm.bind(null, item)}/>}
                      </div>}
                  </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table> : <p styleName='label'><Translate value='operations.emptyPendingList'/></p>}
        </Paper>
        <div style={globalStyles.paperSpace}/>

        <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}><Translate value='operations.completed'/></h3>
          <Divider />
          {this.props.list.filter(o => o.isDone()).size > 0 ? <Table>
            <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={styles.completed.desc}>
                  <Translate value='operations.desc'/>
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.completed.actions}>
                  <Translate value='nav.actions'/>
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody className='xs-reset-table' displayRowCheckbox={false}>
              {list.filter(o => o.isDone()).map(item =>
                <TableRow key={item.id()}>
                  <TableRowColumn style={styles.completed.desc}>{item.tx().description()}</TableRowColumn>
                  <TableRowColumn style={styles.completed.actions}>
                    {etherscanHref(item.id()) ? <a href={etherscanHref(item.id())} target='_blank' rel='noopener noreferrer'>
                      <RaisedButton label={<Translate value='terms.view'/>} style={styles.actionButton}/>
                    </a> :
                      <RaisedButton label={<Translate value='terms.view'/>} style={styles.actionButton} disabled={true}/>}
                  </TableRowColumn>
                </TableRow>
              )}
              {this.props.completedFetching
                ? (<TableRow key='loader'>
                  <TableRowColumn style={{width: '100%', textAlign: 'center'}} colSpan={4}>
                    <CircularProgress style={{margin: '0 auto'}} size={24} thickness={1.5}/>
                  </TableRowColumn>
                </TableRow>) : null}
            </TableBody>
            {!this.props.completedFetching && !this.props.completedEndOfList ? <TableFooter adjustForCheckbox={false}>
              <TableRow>
                <TableRowColumn>
                  <RaisedButton
                    label={<Translate value='nav.loadMore'/>}
                    onTouchTap={() => this.props.handleLoadMore()} fullWidth primary/>
                </TableRowColumn>
              </TableRow>
            </TableFooter> : ''}
          </Table> : <p styleName='label'><Translate value='operations.emptyCompletedList'/></p>}
        </Paper>
      </div>
    )
  }
}

OperationsPage.propTypes = {
  isFetched: PropTypes.bool,
  isFetching: PropTypes.bool,
  getList: PropTypes.func,
  revoke: PropTypes.func,
  confirm: PropTypes.func,
  list: PropTypes.object
}

export default OperationsPage
