import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer || false;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      dragType: undefined,
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
          height: 600
        }
      ]
    }
  }

  componentDidMount() {

  }

  dragStart(e, layerNb) {
    e.preventDefault()
    if (e.button == 0 && e.target.getAttribute("draggable") == "true") {
      console.log("----- START DRAG -----");
      let dragType = e.target.getAttribute("dragtype");

      let layers = this.state.layers;
      let layer = layers[0];

      let originalWidth = layer.width;
      let originalHeight = layer.height;
      let originalX = layer.x;
      let originalY = layer.y;
      let mouseX = e.pageX;
      let mouseY = e.pageY;

      this.setState({
        active: true,
        dragType: dragType,
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

    let layer = {
      x: left,
      y: top,
      width: width,
      height: height
    }
    let layers = this.state.layers
    layers[0] = layer

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
    layers[0].y = top
    layers[0].width = width
    layers[0].height = height

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
    layers[0].x = left
    layers[0].width = width
    layers[0].height = height

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
    layers[0].width = width
    layers[0].height = height

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
                  <div className="videoContainer" ref={this.videoContainer} layernb={0}>
                    <div className="video">
                      <video>
                        <source src="./static/24K.mp4" type="video/mp4"/>
                      </video>
                    </div>
                    <div className="resizer top-left" draggable="true" dragtype="top-left"></div>
                    <div className="resizer top-right" draggable="true" dragtype="top-right"></div>
                    <div className="resizer bottom-left" draggable="true" dragtype="bottom-left"></div>
                    <div className="resizer bottom-right" draggable="true" dragtype="bottom-right"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="timelineContainer"></div>
            <div className="commandsContainer"></div>
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
          .videoContainer {
            position: absolute;
            left: ${this.state.layers[0].x}px;
            top: ${this.state.layers[0].y}px;
            display: flex;
            width: ${this.state.layers[0].width}px;
            height: ${this.state.layers[0].height}px;
          }
          .video {
            position: relative;
            flex: 1;
            // width: 100%;
            overflow: hidden;
          }
          .video video {
            position: absolute;
            left: -${this.state.layers[0].x}px;
            top: -${this.state.layers[0].y}px;
            width: 800px;
          }
          .videoContainer .resizer {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #c0392b;
          }
          .resizer.top-left {
            left: -4px;
            top: -4px;
            cursor: nwse-resize;
          }
          .resizer.top-right {
            right: -4px;
            top: -4px;
            cursor: nesw-resize;
          }
          .resizer.bottom-left {
            left: -4px;
            bottom: -4px;
            cursor: nesw-resize;
          }
          .resizer.bottom-right {
            right: -4px;
            bottom: -4px;
            cursor: nwse-resize;
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
