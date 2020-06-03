import React, {useState, useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import Sketch from 'react-p5';
import queryString from 'query-string';
import io from "socket.io-client";
import { SketchPicker } from 'react-color';
import { FaEraser } from 'react-icons/fa';
import {MdClear, MdColorLens} from 'react-icons/md';
import './Draw.css';
const ENDPOINT = "/";

let socket;

function Draw() {
  const history = useHistory();
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#2c3e50');
  const [strokeWeight, setStrokeWeight] = useState(8);
  const [nUsers, setNUsers] = useState(1);
  const location = useLocation();
  

  useEffect(() => {
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, []);

  //const[data, setData] = useState({});
  //let mdata = {};
  const setup = (p5, canvasParentRef) => {

    socket = io(ENDPOINT);
    const {room, name} = queryString.parse(location.search);
    console.log(room + "  " + name);
    setRoomName(room);
    setUserName(name);

    p5.createCanvas(p5.displayWidth,p5.displayHeight).parent(canvasParentRef);
    p5.background(255);


    if(socket != null || socket != undefined){
      //console.log(roomName + "  " + userName);

      socket.on('errorConnection' , (data) => {
        alert(data);
        history.goBack();
      });

      socket.on('userChange' , (data) => {
        setNUsers(data);
      })

      socket.on('snackMessage', message => {
        document.querySelector(".snackbar").innerHTML = message;
        document.querySelector(".snackbar").className = "snackbar show";
        setTimeout(() => {
          document.querySelector(".snackbar").className = "snackbar";
        }, 3000)
      })

      socket.emit('newConnection', {'roomName' : room, 'userName' : name});
      socket.on('clearBoard', (data) => {
        console.log('clearRequest');
        p5.clear();
      })
  
      socket.on('draw', (data) => {
        //console.log(data);
        p5.stroke(p5.color(data.strokeColor));
        p5.strokeWeight(data.strokeWeight);
        if(data.eraseMode){
          p5.erase();
          p5.strokeWeight(data.strokeWeight);
        }
        p5.line(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY);
        p5.noErase();
      })
  
  
      socket.on('canvasData', (canvasData)=>{
        console.log(canvasData);
        for (let i=0;i<canvasData.length;i++) {
          //console.log(canvasData[i].strokeColor);
          p5.stroke(p5.color(canvasData[i].strokeColor));
          p5.strokeWeight(canvasData[i].strokeWeight);
          if(canvasData[i].eraseMode){
            p5.erase();
            p5.strokeWeight(strokeWeight);
          }
          p5.line(canvasData[i].mouseX, canvasData[i].mouseY, canvasData[i].pmouseX, canvasData[i].pmouseY);
          p5.noErase();
        }
      });
    }
  }

  const draw = (p5) => {
    if (!isMenuOpened && p5.mouseIsPressed === true) {
      if(eraserMode){
        p5.erase();
        p5.strokeWeight(strokeWeight);
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        p5.noErase();
        socket.emit('draw', {
          eraseMode : true,
          strokeColor : strokeColor,
          strokeWeight : strokeWeight,
          mouseX : p5.mouseX,
          mouseY : p5.mouseY,
          pmouseX : p5.pmouseX,
          pmouseY : p5.pmouseY,
        });
      }else{
        p5.strokeWeight(strokeWeight);
        p5.stroke(p5.color(strokeColor));
        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        socket.emit('draw', {
          eraseMode : false,
          strokeColor : strokeColor,
          strokeWeight : strokeWeight,
          mouseX : p5.mouseX,
          mouseY : p5.mouseY,
          pmouseX : p5.pmouseX,
          pmouseY : p5.pmouseY,
        });
      }
    }
  }

  
  const clearBoard = () => {
    socket.emit('clearBoard', "clearBoard");
  }

  const toggleColorPicker = () => {
    document.querySelector('.colorPicker').style.display = (document.querySelector('.colorPicker').style.display == "none") ? "block" : "none";
    if(document.querySelector('.colorPicker').style.display == "block"){
      setIsMenuOpened(true);
    }else{
      setIsMenuOpened(false);
    }
  }

  const changeStrokeColor = (color) => {
    setStrokeColor(color.hex);
  }

  return (
    <div className="DrawPage">
      
      <div className="optionsBar">
        <div className="mainOptions">
          <div className="speedSliderContainer">
            <input className="speedSlider" min="2" max="50" value={strokeWeight} type="range" name="" id="" onChange={(e) => setStrokeWeight(e.target.value)}/>
          </div>

          <div className="colorPickerContainer">
            <button className="colorPickerBtn" onClick={toggleColorPicker}><MdColorLens size="25" color={strokeColor}/></button>
            <SketchPicker
              className="colorPicker"
              color={ strokeColor }
              onChangeComplete={ changeStrokeColor }
            />
          </div>
          
          <button className="eraser" onClick={() => {setEraserMode(!eraserMode);}}><FaEraser size="25" color={(eraserMode) ? "#3498db" : "#34495e"}/></button>
          <button className="clearAll" onClick={clearBoard}><MdClear size="25"/></button>
        </div>
        
        <div className="roomNameDetails">
          <span className="roomNameDetailsText">{`Room Name : ${roomName}`}</span>
          <span className="roomNameDetailsText">Ask you Friends to join in!</span>
          <span className="roomNameDetailsText">No. of Users : {nUsers}</span>
        </div>
      </div>
      {/* <h4>{message}</h4>
      <div>
        <input value={inputMessage} onChange={(e) => {setInputMessage(e.target.value);}} placeholder="Enter you message" type="text"/>
        <button onClick={sendBtnClick}>Send</button>
      </div> */}
      <Sketch className="sketchBoard" setup={setup} draw={draw} />

      <div className="snackbar">Someone cleared the board.</div>
    </div>
  );
}

export default Draw;
