import { Card, CardActions, CardHeader } from 'material-ui/Card'
import { connect } from 'react-redux'
import { cyan500, pinkA200, greenA700, white, teal400} from 'material-ui/styles/colors'
import { propTypes, reduxForm, Field } from 'redux-form'
import { userLogin as userLoginAction } from 'admin-on-rest/lib/actions/authActions'
import CircularProgress from 'material-ui/CircularProgress'
import compose from 'recompose/compose'
import defaultTheme from 'admin-on-rest/lib/mui/defaultTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Notification from 'admin-on-rest/lib/mui/layout/Notification'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import translate from 'admin-on-rest/lib/i18n/translate'

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: 300,
  },
  title: {
    textAlign: 'center',
  },
  avatar: {
    margin: '1em',
    textAlign: 'center ',
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    display: 'flex',
  },
}

function getColorsFromTheme(theme) {
  if (!theme) return { primary1Color: cyan500, accent1Color: pinkA200 }
  const { palette: { primary1Color, accent1Color } } = theme
  return { primary1Color, accent1Color }
}

const renderInput = ({
  meta: { touched, error } = {},
  input: { ...inputProps },
  ...props
}) => (
  <TextField
    errorText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
)

class Login extends Component {
  loginOrSignup = auth =>
    this.props.userLogin(
      auth,
      this.props.location.state
        ? this.props.location.state.nextPathname
        : '/'
    )

  login = auth => this.loginOrSignup(auth)
  
  signup = auth => this.loginOrSignup({ ...auth, signup: true })

  render() {
    const { handleSubmit, isLoading, theme, translate } = this.props
    const muiTheme = getMuiTheme(theme)
    const { primary1Color } = getColorsFromTheme(muiTheme)
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{ ...styles.main, backgroundColor: primary1Color }}>
          <Card style={styles.card}>
            <CardHeader
              title="Travelly ®"
              subtitle="your friendly travel planner"
              avatar="T.png"
            />
            <form>
              <div style={styles.form}>
                <div style={styles.input}>
                  <Field
                    name="username"
                    component={renderInput}
                    floatingLabelText={translate(
                      'aor.auth.username'
                    )}
                    disabled={isLoading}
                  />
                </div>
                <div style={styles.input}>
                  <Field
                    name="password"
                    component={renderInput}
                    floatingLabelText={translate(
                      'aor.auth.password'
                    )}
                    type="password"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <CardActions>
                <RaisedButton
                  type="submit"
                  backgroundColor={teal400}
                  labelColor={white}
                  disabled={isLoading}
                  onClick={handleSubmit(this.login)}
                  icon={
                    isLoading && (
                      <CircularProgress
                        size={25}
                        thickness={2}
                      />
                    )
                  }
                  fullWidth
                  label='Log In'
                />
                <hr />
                <RaisedButton
                  backgroundColor={greenA700}
                  labelColor={white}
                  disabled={isLoading}
                  onClick={handleSubmit(this.signup)}
                  icon={
                    isLoading && (
                      <CircularProgress
                        size={25}
                        thickness={2}
                      />
                    )
                  }
                  fullWidth
                  label='Sign Up!'
                />          
              </CardActions>
            </form>
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    )
  }
}

Login.propTypes = {
  ...propTypes,
  authClient: PropTypes.func,
  previousRoute: PropTypes.string,
  theme: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  userLogin: PropTypes.func.isRequired,
}

Login.defaultProps = {
  theme: defaultTheme,
}

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 })

const enhance = compose(
  translate,
  reduxForm({
    form: 'signIn',
    validate: (values, props) => {
      const errors = {}
      const { translate } = props
      if (!values.username)
        errors.username = translate('aor.validation.required')
      if (!values.password)
        errors.password = translate('aor.validation.required')
      return errors
    },
  }),
  connect(mapStateToProps, { userLogin: userLoginAction })
)

export default enhance(Login)
