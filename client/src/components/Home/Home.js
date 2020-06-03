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
        <span className="headerSubTitle">Draw and Collaborate on the same Canvas.</span>
      </div>
      <div className="joinCard">
        <input className="roomNameInput" placeholder="Enter a Room name" type="text" value={roomName} onChange={(e) => {setRoomName(e.target.value.toLowerCase());}} name="" id=""/>
        <input className="userNameInput" placeholder="Enter a User name" type="text" value={userName} onChange={(e) => {setUserName(e.target.value.toLowerCase());}} name="" id=""/>
        <button className="joinBtn" onClick={joinRoom}>Join</button>
      </div>
      <div className="noAllowedCard">
        <span>Not Recommended For Small Screens</span>
        <span>Use the website on PC, Laptop.</span>
      </div>
      <div className="credits">
        Made by <span className="myName">Ravi Maurya</span>
      </div>
    </div>
  );
}

export default Home;
