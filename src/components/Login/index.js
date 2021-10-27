import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showPassword: false, errorMsg: ''}

  onClickCheckbox = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  render() {
    const {username, password, showPassword, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
            className="website-logo-image"
          />
          <label htmlFor="username" className="label">
            USERNAME
          </label>
          <input
            type="text"
            placeholder="Username"
            className="input"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
          />
          <label htmlFor="password" className="label">
            PASSWORD
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="input"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <div>
            <input
              type="checkbox"
              id="checkbox"
              onClick={this.onClickCheckbox}
            />
            <label htmlFor="checkbox">Show Password</label>
          </div>
          <button type="submit" className="button">
            Login
          </button>
          {errorMsg && <p className="errMsg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
