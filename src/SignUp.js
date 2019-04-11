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
      finished: false,
      error: null
    };

    this.handleInputs = this.handleInputs.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }
  }

  handleInputs(e) {
    const data = { ...this.state.data };
    data[e.target.id] = e.target.value;

    this.setState({ data });
  }

  onSubmit(e) {
    e.preventDefault();

    this.source = axios.CancelToken.source();

    axios
      .post(`${API_ROOT}/register`, this.state.data, {
        cancelToken: this.source.token
      })
      .then(() => this.setState({ finished: true }))
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          // handle error
          this.setState({ error: err.response.data.message });
        }
      });
  }

  render() {
    const { data, finished, error } = this.state;

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
            {error ? <p style={{ color: "red" }}>{error}</p> : null}
            <br />
            <input type="submit" value="Sign up" />
          </form>
        </main>
      </>
    );
  }
}

export default SignUp;
