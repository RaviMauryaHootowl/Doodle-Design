import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Sketch from 'react-p5';
import './App.css';
import io from "socket.io-client";
import Home from './components/Home/Home';
import Draw from './components/Draw/Draw';
const ENDPOINT = "/";

let socket;

function App() {

  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/draw" component={Draw}/>
    </Router>
  );
}

export default App;
