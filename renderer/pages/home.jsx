import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Movie from '../components/Movie';

import {mediaSync} from '../static/mediaSync';
// var timingsrc = require("../static/timingsrc-v2");
// var timingobject = require('timing-object');


const ipcRenderer = electron.ipcRenderer || false;

function Timer(callback, interval) {
  var self = this
  this.callback = callback;
  this.interval = interval;
  this.timeout = undefined;
  this.lastCall = 0;

  this.start = function() {
    this.lastCall = Date.now();
    this.timeout = setInterval(step, this.interval, callback);
  }

  this.stop = function() {
    clearInterval(this.timeout);
  }

  function step(callback) {
    let now = Date.now();
    let deltaTime = now - self.lastCall;
    self.lastCall = now;
    callback(deltaTime)
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    // this.to = new timingsrc.TimingObject();
    var self = this
    this.timer = new Timer((deltaTime) => self.setTime(deltaTime), 1000);
    this.time = 0;

    this.state = {
      active: false,
      dragType: undefined,
      dragLayer: -1,
      originalX: 0,
      originalY: 0,
      mouseX: 0,
      mouseY: 0,
      originalWidth: 0,
      originalHeight: 0,

      layers: [
        {
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          clip: "cuntphal",
          reference: React.createRef(),
          sync: undefined
        },
        {
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          clip: "24K",
          reference: React.createRef(),
          sync: undefined
        }
      ]
    }
  }

  componentDidMount() {
    let layers = this.state.layers;
    for(let i = 0; i < layers.length; i++) {
      layers[i].sync = mediaSync(layers[i].reference, {pos: 0.1});
    }
  }

  setTime(deltaTime) {
    this.time += deltaTime
    let layers = this.state.layers;
    for(let i = 0; i < layers.length; i++) {
      layers[i].reference.current.currentTime = this.time/1000
    }
  }

  dragStart(e) {
    e.preventDefault()
    if (e.button == 0 && e.target.getAttribute("draggable") == "true") {
      console.log("----- START DRAG -----");
      let dragType = e.target.getAttribute("dragtype");

      let layerNb = e.target.getAttribute("layernb");

      let layers = this.state.layers;
      let layer = layers[layerNb];

      let originalWidth = layer.width;
      let originalHeight = layer.height;
      let originalX = layer.x;
      let originalY = layer.y;
      let mouseX = e.pageX;
      let mouseY = e.pageY;

      this.setState({
        active: true,
        dragType: dragType,
        dragLayer: layerNb,
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        originalX: originalX,
        originalY: originalY,
        mouseX: mouseX,
        mouseY: mouseY
      })
    }
  }

  dragEnd(e) {
    this.setState({active: false, dragType: undefined})
  }

  drag(e) {
    console.log("MOUSE MOVING");
    if(this.state.active) {
      console.log("----- DRAGGING -----");
      switch (this.state.dragType) {
        case "top-left":
          this.resizeTopLeft(e)
          break;
        case "top-right":
          this.resizeTopRight(e)
          break;
        case "bottom-left":
          this.resizeBottomLeft(e)
          break;
        case "bottom-right":
          this.resizeBottomRight(e)
          break;
      }
    }
  }

  resizeTopLeft(e) {
    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth - (e.pageX - mouseX)
    let height = originalHeight - (e.pageY - mouseY)
    let left = originalX + (e.pageX - mouseX)
    let top = originalY + (e.pageY - mouseY)

    if(width < 20) {
      width = 20;
    }
    if(height < 20) {
      height = 20;
    }
    if(left < 0) {
      width += left;
      left = 0;
    } else if(left > 800 - 20) {
      left = 800 - 20;
    }
    if(top < 0) {
      height += top;
      top = 0;
    } else if(top > 600 - 20) {
      top = 600 - 20;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].x = left
    layers[dragLayer].y = top
    layers[dragLayer].width = width
    layers[dragLayer].height = height


    this.setState({layers: layers})
  }

  resizeTopRight(e) {
    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth + (e.pageX - mouseX)
    let height = originalHeight - (e.pageY - mouseY)
    let top = originalY + (e.pageY - mouseY)

    if(width < 20) {
      width = 20;
    } else if(width > 800) {
      width = 800;
    }
    if(height < 20) {
      height = 20;
    }
    if(top < 0) {
      height += top;
      top = 0;
    } else if(top > 600 - 20) {
      top = 600 - 20;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].y = top
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeBottomLeft(e) {
    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth - (e.pageX - mouseX)
    let height = originalHeight + (e.pageY - mouseY)
    let left = originalX + (e.pageX - mouseX)

    if(width < 20) {
      width = 20;
    }
    if(height < 20) {
      height = 20;
    } else if(height > 600) {
      height = 600;
    }
    if(left < 0) {
      width += left;
      left = 0;
    } else if(left > 800 - 20) {
      left = 800 - 20;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].x = left
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeBottomRight(e) {
    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth + (e.pageX - mouseX)
    let height = originalHeight + (e.pageY - mouseY)

    if(width < 20) {
      width = 20;
    } else if(width > 800) {
      width = 800;
    }
    if(height < 20) {
      height = 20;
    } else if(height > 600) {
      height = 600;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <div className="main">
          <div className="mainContainer">
            <div className="viewerContainer"
              onMouseDown={(e) => this.dragStart(e)}
              onMouseMove={(e) => this.drag(e)}
              onMouseUp={(e) => this.dragEnd(e)}
            >
              <div className="viewer">
                <div className="videosContainer">
                  {this.state.layers.map((layer, index) => (
                    <Movie
                      key={index}
                      reference={layer.reference}
                      layerNb={index}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      height={layer.height}
                      clip={layer.clip}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="timelineContainer"></div>
            <div className="commandsContainer">
              <button onClick={() => this.timer.start()}>Play</button>
              <button onClick={() => this.timer.stop()}>Pause</button>
            </div>
          </div>
          <div className="layersContainer">
            <h1>Video layers</h1>
          </div>
        </div>

        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          * {
            margin: 0;
          }
          p, h1, h2, h3, h4, h5, h6 {
            color: #ecf0f1;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          div {
            height: 100%;
            width: 100%;
          }
          #__next {
            display: flex;
            flex-direction: column;
          }
        `}</style>
        <style jsx>{`
          .main {
            display: flex;
            flex-direction: row;
            background: #2c3e50;
          }
          .mainContainer {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .viewerContainer {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .viewer {
            position: relative;
            display: flex;
            width: 800px;
            height: 600px;
            border: 3px solid #000;
          }
          .videosContainer {
            position: absolute;
            flex: 1;
            background: #fff;
          }

          .timelineContainer {
            height: 100px;
            background: #34495e;
          }
          .commandsContainer {
            height: 100px;
            background: #7f8c8d;
          }



          .layersContainer {
            width: 300px;
            background: #95a5a6;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
