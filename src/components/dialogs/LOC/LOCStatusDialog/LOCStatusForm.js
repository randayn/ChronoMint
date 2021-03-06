import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form/immutable'
import { SelectField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { MenuItem, RaisedButton } from 'material-ui'
import './LOCStatusForm.scss'

const onSubmit = (values) => {
  return +values.get('status')
}

@reduxForm({form: 'LOCStatusForm', onSubmit})
class LOCStatusForm extends Component {
  static propTypes = {
    pristine: PropTypes.bool,
    handleSubmit: PropTypes.func
  }

  render () {
    const {pristine, handleSubmit} = this.props
    return (
      <form name='LOCStatusFormName' onSubmit={handleSubmit}>
        <p styleName='subHeader'><Translate value='forms.mustBeCoSigned' /></p>

        <Field
          component={SelectField}
          name='status'
          fullWidth
          floatingLabelText={<Translate value='terms.status' />}
        >
          <MenuItem value={0} primaryText={<Translate value='locs.status.maintenance' />} />
          <MenuItem value={1} primaryText={<Translate value='locs.status.active' />} />
          <MenuItem value={2} primaryText={<Translate value='locs.status.suspended' />} />
          <MenuItem value={3} primaryText={<Translate value='locs.status.bankrupt' />} />
        </Field>

        <div styleName='footer'>
          <RaisedButton
            label={<Translate value='locs.updateStatus' />}
            primary
            onTouchTap={handleSubmit}
            disabled={pristine}
          />
        </div>

      </form>
    )
  }
}

export default LOCStatusForm
