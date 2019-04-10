import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

import { updateToken } from "./store";

const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signed: false,
      data: {
        email: "",
        password: ""
      }
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputs(e) {
    const data = { ...this.state.data };
    data[e.target.id] = e.target.value;

    this.setState({ data });
  }

  onSubmit(e) {
    e.preventDefault();

    const data = { ...this.state.data };

    axios.post(`${API_ROOT}/auth`, data).then(response => {
      updateToken(response.data.token);
      this.setState({ signed: true });
    });
  }

  render() {
    const { signed, data } = this.state;

    if (signed) {
      return <Redirect to="/my-todos" />;
    }

    return (
      <>
        <nav>
          <ul>
            <li>
              <Link to="/sign-up">Sign Up</Link>
            </li>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          </ul>
        </nav>
        <main>
          <form onSubmit={this.onSubmit}>
            <p>Email:</p>
            <input
              id="email"
              type="email"
              onChange={this.handleInputs}
              required
              value={data.email}
            />
            <p>Password:</p>
            <input
              id="password"
              type="password"
              onChange={this.handleInputs}
              required
              value={data.password}
            />
            <br />
            <input type="submit" value="Sign in" />
          </form>
        </main>
      </>
    );
  }
}

export default SignIn;
