import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Redirect, useHistory, Switch } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import axios from 'axios'
import Header from './Components/MobileHeader/Header'
import Chat from './Components/Chat/Chat'

function App() {
  const [user, setUser] = useState('')
  const [err, setErr] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    getUserData()
  }, [])

  let history = useHistory();

  const getUserData = () => {
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
        Authorization: token
      }
    };
    axios
      .get('https://chat-backend-1.herokuapp.com/api/user/userData', options)
      .then(res => {
        setUser(res.data.data)
        checkAuthentication(res.data)
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  const checkAuthentication = (user) => {
    console.log(user)
    if (user.message) {
      history.push('/Login')
    }
    else {
      setAuthenticated(true)
    }
  }

  return (
    <div className="App">
      {
        authenticated ? (
          <div>
            <Header />
            <Switch>
              <Route
                exact
                path="/"
                render={props => <Chat {...props} getUserData={getUserData} user={user} />}
              />
              <Route render={() => (<Redirect to="/" />)} />
            </Switch>
          </div>
        ) : (
            <Switch>
              <Route path="/Register" component={Register} />
              <Route
                path="/Login"
                render={props => <Login {...props} getUserData={getUserData} />}
              />
              <Route render={() => (<Redirect to="/login" />)} />
            </Switch>

          )
      }
    </div>
  );
}

export default App;
