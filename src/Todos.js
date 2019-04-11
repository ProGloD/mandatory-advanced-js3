import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";

import { token$, updateToken } from "./store";

const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: token$.value,
      email: "",
      todos: [],
      todo: "",
      error: null
    };

    this.getTodos = this.getTodos.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  componentDidMount() {
    this.subscription = token$.subscribe(token => {
      this.setState({ token });
    });

    if (this.state.token) {
      this.getTodos();
    }
  }

  componentWillUnmount() {
    if (this.source) {
      this.source.cancel("Operation canceled by the user.");
    }

    this.subscription.unsubscribe();
  }

  getTodos() {
    this.source = axios.CancelToken.source();

    axios
      .get(`${API_ROOT}/todos`, {
        cancelToken: this.source.token,
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      .then(response => {
        this.setState({
          todos: response.data.todos,
          email: jwt.decode(this.state.token).email
        });
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        } else {
          // handle error
          updateToken(null);
        }
      });
  }

  logOut() {
    updateToken(null);
  }

  handleInput(e) {
    this.setState({ todo: e.target.value });
  }

  addTodo(e) {
    e.preventDefault();

    const content = {
      content: this.state.todo
    };

    axios
      .post(`${API_ROOT}/todos`, content, {
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      .then(response => {
        this.setState({
          todo: "",
          todos: [...this.state.todos, response.data.todo]
        });
      })
      .catch(err => {
        this.setState({ error: err.response.data.message });
      });
  }

  removeTodo(todo) {
    axios
      .delete(`${API_ROOT}/todos/${todo.id}`, {
        headers: { Authorization: `Bearer ${this.state.token}` }
      })
      .then(() => {
        const todos = [...this.state.todos];
        todos.splice(todos.indexOf(todo), 1);
        this.setState({ todos });
      });
  }

  render() {
    const { token, email, todos, todo, error } = this.state;

    if (!token) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <nav>
          <p>{email}</p>
          <ul>
            <li>
              <Link to="/" onClick={this.logOut}>
                Log out
              </Link>
            </li>
          </ul>
        </nav>

        <main>
          <div>
            <form onSubmit={this.addTodo}>
              <input onChange={this.handleInput} minLength={1} value={todo} />
              <input type="submit" value="Add" />
              {error ? <p style={{ color: "red" }}>{error}</p> : null}
            </form>
          </div>
          <div>
            <ul>
              {todos.map(todo => (
                <li key={todo.id}>
                  {todo.content}{" "}
                  <button onClick={() => this.removeTodo(todo)}>&times;</button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </>
    );
  }
}

export default Todos;
