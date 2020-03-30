import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { Link } from 'react-router-dom'
import Join from './Components/Join/Join'
import axios from 'axios'

function App() {
  const [user, setUser] = useState('')

  useEffect(() => {

  })

  return (
    <div className="App">

      <Route path="/" component={Join} />

    </div>
  );
}

export default App;
