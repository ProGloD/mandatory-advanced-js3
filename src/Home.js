import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { token$ } from "./store";

class Home extends Component {
  state = {
    token: token$.value
  }; 

  render() {

    if (this.state.token) {
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
