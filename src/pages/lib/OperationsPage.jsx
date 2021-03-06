import React, { Component } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Partials from 'layouts/partials'

import './OperationsPage.scss'

export default class OperationsPage extends Component {

  render () {
    return (
      <div styleName='root'>
        <Partials.BrandPartial />
        <CSSTransitionGroup
          transitionName='transition-opacity'
          transitionAppear
          transitionAppearTimeout={250}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}>
          <Partials.OperationsContent />
        </CSSTransitionGroup>
        <Partials.FooterPartial />
      </div>
    )
  }
}
