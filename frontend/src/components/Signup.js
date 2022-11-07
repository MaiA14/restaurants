import React, { Component } from 'react';
import UserService from '../services/UserService';
import swal from 'sweetalert';
import RestaurantsSelect from './RestaurantSelect';

export class Signup extends Component {
  state = {
    name: '',
    email: '',
    role: '',
    restaurants: '',
    password: ''
  };

  changeInput = ev => {
    let field = ev.target.name;
    let value = ev.target.value;
    this.setState({ [field]: value });
  };

  onChangeRoleSelect = (ev) => {
    const role = ev.target.value;
    ev.target.value = role;
    this.setState({ role });
  };

  handleCallback = (restaurantsData) => {
    this.setState({ restaurants: restaurantsData })
  }


  onSignup = async () => {
    const user = this.state;
    console.log('res ', this.state.restaurants)

    if (user.name && user.email && user.role && user.password && user.restaurants) {
      try {
        await UserService.signup(user);
        swal("User is created successfully");
      }
      catch (e) {
        console.error(e);
        if (e.response.status === 409) {
          swal("There is already user with this mail");
        }
      }
    }
  };

  onCheckForm = (ev) => {
    if (ev.key === 'Enter') this.onSignup()
  }

  render() {
    const { restaurants } = this.state;
    return (
      <div className="container" onKeyUp={(ev) => this.onCheckForm(ev)}>
        <div className="inputs-wrapper">
          <input type='text' className="form-input" placeholder='Name'
            onChange={this.changeInput} name='name'></input>
          <input type='password' className="form-input" placeholder='Password'
            onChange={this.changeInput} name='password'></input>


          <select
            value={this.state.role}
            onChange={this.onChangeRoleSelect}
          >

            <option value="DEFAULT">Choose a role ...</option>
            <option value="manager">Manager</option>
            <option value="waiter">Waiter</option>
          </select>


          <input type='email' className="form-input" placeholder='Email'
            onChange={this.changeInput} name='email'></input>

          <RestaurantsSelect restaurantsCallback={this.handleCallback} />


          <button className="app-button" onClick={this.onSignup}>Signup</button>
        </div>
      </div>
    );
  }
}

export default Signup;