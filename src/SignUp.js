import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        email: "",
        password: ""
      },
      finished: false
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputs(e) {
    const data = { ...this.state.data };
    data[e.target.id] = e.target.value;

    this.setState({ data: data });
  }

  onSubmit(e) {
    e.preventDefault();

    axios
      .post(`${API_ROOT}/register`, this.state.data)
      .then(() => this.setState({ finished: true }))
      .catch(thrown => console.log(thrown));
  }

  render() {
    const { data, finished, failed, status } = this.state;

    if (finished) {
      return <Redirect to="/sign-in" />;
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
            <div>
              <p>Email:</p>
              <input
                id="email"
                type="email"
                onChange={this.handleInputs}
                required
                value={data.email}
              />
            </div>
            <div>
              <p>Password:</p>
              <input
                id="password"
                type="password"
                onChange={this.handleInputs}
                required
                value={data.password}
              />
            </div>
            {failed ? <p>{status}</p> : null}
            <input type="submit" value="Sign up" />
          </form>
        </main>
      </>
    );
  }
}

export default SignUp;
