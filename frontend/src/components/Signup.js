import React, { Component } from 'react';
import UserService from '../services/UserService';

export class Signup extends Component {
  state = {
    fullName: '',
    password: '',
    email: '',
    phone: '',
  };

  changeInput = ev => {
    let field = ev.target.name;
    let value = ev.target.value;
    this.setState({ [field]: value });
  };

  onSignup = async () => {
    const user = this.state;
    if (user.fullName &&  user.password && user.email && user.phone) {
        try {
            await UserService.signup(user);
            this.props.history.push('/management');
        }
        catch(e) {
            console.error(e);
        }
    }
  };

  onCheckForm = (ev) => {
    if (ev.key === 'Enter') this.onSignup()
  }

  render() {
    return (
        <div className="container" onKeyUp={(ev) => this.onCheckForm(ev)}>
          <div className="inputs-wrapper">
            <input type='text' className="form-input" placeholder='Full Name'
            onChange={this.changeInput} name='fullName'></input>
            <input type='password' className="form-input" placeholder='Password'
            onChange={this.changeInput} name='password'></input>
            <input type='phone' className="form-input" placeholder='Phone' 
            onChange={this.changeInput} name='phone'></input>
            <input type='email' className="form-input" placeholder='email' 
            onChange={this.changeInput} name='email'></input>
            <button className="app-button" onClick={this.onSignup}>Signup</button>
            </div>
        </div>
    );
  }
}

export default Signup;