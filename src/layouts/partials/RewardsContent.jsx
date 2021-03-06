import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { RaisedButton, FlatButton, Paper, CircularProgress } from 'material-ui'
import { RewardsPeriod } from 'components'

import type RewardsModel from 'models/RewardsModel'

import { getRewardsData, watchInitRewards, withdrawRevenue, closePeriod } from 'redux/rewards/rewards'

import styles from 'layouts/partials/styles'

import './RewardsContent.scss'

@connect(mapStateToProps, mapDispatchToProps)
export default class RewardsContent extends Component {

  static propTypes = {
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    isCBE: PropTypes.bool,

    rewardsData: PropTypes.object,
    timeDeposit: PropTypes.object,

    watchInitRewards: PropTypes.func,
    getRewardsData: PropTypes.func,
    handleWithdrawRevenue: PropTypes.func,
    handleClosePeriod: PropTypes.func
  }

  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.watchInitRewards()
      this.props.getRewardsData()
    }
  }

  render () {
    return !this.props.isFetched
      ? (<div styleName='progress'><CircularProgress size={24} thickness={1.5} /></div>)
      : (
        <div styleName='root'>
          <div styleName='content'>
            {this.renderHead()}
            {this.renderBody()}
          </div>
        </div>
      )
  }

  renderHead () {
    const rewardsData: RewardsModel = this.props.rewardsData
    return (
      <div styleName='head'>
        <h3>Rewards</h3>
        <div styleName='inner'>
          <div className='RewardsContent__grid'>
            <div className='row'>
              <div className='col-sm-1'>
                <div styleName='entry'>
                  <span styleName='entry1'>Rewards smart contract address:</span><br />
                  <span styleName='entry2'>{rewardsData.address()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'>Current rewards period:</span><br />
                  <span styleName='entry2'>{rewardsData.lastPeriodIndex()}</span>
                </div>
                <div styleName='entry'>
                  <span styleName='entry1'>Period length:</span><br />
                  <span styleName='entry2'>{rewardsData.periodLength()} days</span>
                </div>
              </div>
              <div className='col-sm-1'>
                <div styleName='alignRight'>
                  <div styleName='entries'>
                    {/*
                    <div styleName='entry'>
                      <span styleName='entry1'>Access of rewards contract to your account is:</span><br />
                      <span styleName='entry2'><a styleName='highlightGreen'>Enabled</a></span>
                    </div>
                    */}
                    {this.props.timeDeposit && this.props.timeDeposit.gt(0)
                      ? <div styleName='entry'>
                        <span styleName='entry1'>
                          <span>Rewards for your account is:</span>
                        </span><br />
                        <span styleName='entry2'>
                          <a styleName='highlightGreen'>Enabled</a>
                        </span>
                      </div>
                      : (
                        <div styleName='entry'>
                          <span styleName='entry1'>
                            <span>You have no TIME deposit.</span><br />
                            <span>Please deposit TIME tokens to unlock rewards page.</span>
                          </span><br />
                          <span styleName='entry2'>
                            <a styleName='highlightRed'>Disabled</a>
                          </span>
                        </div>
                      )
                    }
                  </div>
                  <div styleName='actions'>
                    <FlatButton
                      style={styles.content.header.link}
                      label='Deposit Or Withdraw Time'
                      styleName='action'
                      containerElement={
                        <Link activeClassName={'active'} to={{ pathname: '/new/wallet', hash: '#deposit-tokens' }} />
                      }
                    />
                    {rewardsData.accountRewards().gt(0)
                      ? (<RaisedButton
                        label='Withdraw Revenue'
                        styleName='action'
                        disabled={!rewardsData.accountRewards().gt(0)}
                        onTouchTap={() => this.props.handleWithdrawRevenue()}
                      />)
                      : null
                    }
                    {this.props.isCBE
                      ? (<RaisedButton
                        label='Close period'
                        styleName='action'
                        onTouchTap={() => this.props.handleClosePeriod()}
                      />)
                      : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBody () {
    return (
      <div styleName='body'>
        <div styleName='inner'>
          <div className='RewardsContent__grid'>
            {this.props.rewardsData.periods().valueSeq().map((item) => (
              <div className='row' key={item.index()}>
                <div className='col-xs-2'>
                  <Paper style={styles.content.paper.style}>
                    <RewardsPeriod period={item} rewardsData={this.props.rewardsData} />
                  </Paper>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const rewards = state.get('rewards')
  const session = state.get('session')
  const wallet = state.get('wallet')

  return {
    rewardsData: rewards.data,
    // just to subscribe RewardsContent on time deposit updates
    timeDeposit: wallet.timeDeposit,
    isFetching: rewards.isFetching,
    isFetched: rewards.isFetched,
    isCBE: session.isCBE
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getRewardsData: () => dispatch(getRewardsData()),
    watchInitRewards: () => dispatch(watchInitRewards()),
    handleClosePeriod: () => dispatch(closePeriod()),
    handleWithdrawRevenue: () => dispatch(withdrawRevenue())
  }
}
