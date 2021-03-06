import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { List, ListItem, IconButton, FontIcon } from 'material-ui'
import styles from './styles'
import { logout } from 'redux/session/actions'
import { drawerToggle } from 'redux/drawer/actions'
import { Link } from 'react-router'
import { Translate } from 'react-redux-i18n'
import './DrawerPartial.scss'
import menu from 'menu'

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerPartial extends React.Component {

  static propTypes = {
    isDrawerOpen: PropTypes.bool,
    isCBE: PropTypes.bool,
    handleDrawerToggle: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpened: false
    }
  }

  render () {

    return (
      <div styleName='root' className={classnames(this.props.isCBE ? 'root-cbe' : null, this.props.isDrawerOpen ? 'root-open' : null)}>
        <div
          styleName='backdrop'
          onTouchTap={this.props.handleDrawerToggle}
        />
        <div styleName='content'>
          <div styleName='menu'>
            <IconButton onTouchTap={this.props.handleDrawerToggle}>
              <FontIcon className='material-icons'>menu</FontIcon>
            </IconButton>
          </div>
          {!menu.user ? null : (
            <List styleName='menu-user'>
              {menu.user.map(item => this.renderItem(item))}
            </List>
          )}
          {!this.props.isCBE ? null : (
            <List styleName='menu-cbe'>
              {menu.cbe.map(item => this.renderItem(item))}
            </List>
          )}
        </div>
      </div>
    )
  }

  renderItem (item) {
    return (
      <ListItem
        key={item.key}
        style={item.disabled ? styles.drawer.item.styleDisabled : styles.drawer.item.style}
        innerDivStyle={styles.drawer.item.innerDivStyle}
        disabled={item.disabled}
        primaryText={<Translate value={item.title} />}
        leftIcon={
          <FontIcon
            style={item.disabled ? styles.drawer.item.iconStyleDisabled : styles.drawer.item.iconStyle}
            className='material-icons'>{item.icon}</FontIcon>
        }
        containerElement={
          <Link styleName='item' activeClassName={'drawer-item-active'} to={{pathname: item.path}} />
        }
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    isCBE: state.get('session').isCBE,
    isDrawerOpen: state.get('drawer').isOpen
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleLogout: () => dispatch(logout())
  }
}
