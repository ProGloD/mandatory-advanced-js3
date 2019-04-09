import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { token$ } from "./store";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: token$.value,
      signed: false
    };

    this.SignIn = this.SignIn.bind(this);
  }

  componentDidMount() {
    const { token } = this.state;

    if (token) {
      this.SignIn();
    }
  }

  SignIn() {
    const { signed } = this.state;

    this.setState({ signed: !signed });
  }

  render() {
    const { signed } = this.state;

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
          <div>
            <p>Welcome to Better Than Trello</p>
          </div>
          <div>
            <Link to="/sign-up">
              <button>Sign Up</button>
            </Link>
            <Link to="/sign-in">
              <button>Sign In</button>
            </Link>
          </div>
        </main>
      </>
    );
  }
}

export default Home;
