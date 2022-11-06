import React, { Component } from 'react';
import UserService from '../services/UserService';

export class Signup extends Component {
  state = {
    name: '',
    email: '',
    role: '',
    restaurant: '',
    password: ''
  };


  changeInput = ev => {
    let field = ev.target.name;
    let value = ev.target.value;
    this.setState({ [field]: value });
  };

  onSignup = async () => {
    console.log('test')
    const user = this.state;
    if (user.name &&  user.email && user.role && user.password && user.restaurant) {
        try {
            await UserService.signup(user);
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
            <input type='text' className="form-input" placeholder='Name'
            onChange={this.changeInput} name='name'></input>
            <input type='password' className="form-input" placeholder='Password'
            onChange={this.changeInput} name='password'></input>
            <input type='text' className="form-input" placeholder='Role' 
            onChange={this.changeInput} name='role'></input>
            <input type='email' className="form-input" placeholder='Email' 
            onChange={this.changeInput} name='email'></input>
                  <input type='text' className="form-input" placeholder='Restaurant' 
            onChange={this.changeInput} name='restaurant'></input>
            <button className="app-button" onClick={this.onSignup}>Signup</button>
            </div>
        </div>
    );
  }
}

export default Signup;