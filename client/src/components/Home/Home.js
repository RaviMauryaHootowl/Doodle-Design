import React, {useState, useEffect} from 'react';
import './Home.css';
import {useHistory} from 'react-router-dom';
const ENDPOINT = "/";

let socket;

function Home() {
  const history = useHistory();
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');

  const joinRoom = () => {
    history.push(`/draw?room=${roomName}&name=${userName}`);
  }

  return (
    <div className="HomePage">
      <div className="appHeader">
        <span className="headerTitle">Doodle & Design</span>
      </div>
      <div className="joinCard">
        <input className="roomNameInput" placeholder="Enter a Room name" type="text" value={roomName} onChange={(e) => {setRoomName(e.target.value);}} name="" id=""/>
        <input className="userNameInput" placeholder="Enter a User name" type="text" value={userName} onChange={(e) => {setUserName(e.target.value);}} name="" id=""/>
        <button className="joinBtn" onClick={joinRoom}>Join</button>
      </div>
    </div>
  );
}

export default Home;
