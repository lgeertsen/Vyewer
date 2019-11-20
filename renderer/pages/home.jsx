import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer || false;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.videoContainer = React.createRef();
  }

  componentDidMount() {

  }

  dragStart(e) {

  }

  dragEnd(e) {

  }

  drag(e) {
    
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
            <div className="viewerContainer">
              <div className="viewer">
                <div className="videosContainer">
                  <div className="videoContainer" ref={this.videoContainer}>
                    <div className="video">
                      <video>
                        <source src="./static/24K.mp4" type="video/mp4"/>
                      </video>
                    </div>
                    <div className="resizer top-left"
                      onMouseDown={(e) => this.dragStart(e)}
                      onMouseMove={(e) => this.drag(e)}
                      onMouseUp={(e) => this.dragEnd(e)}></div>
                    <div className="resizer top-right"
                      onMouseDown={(e) => this.dragStart(e)}
                      onMouseMove={(e) => this.drag(e)}
                      onMouseUp={(e) => this.dragEnd(e)}></div>
                    <div className="resizer bottom-left"
                      onMouseDown={(e) => this.dragStart(e)}
                      onMouseMove={(e) => this.drag(e)}
                      onMouseUp={(e) => this.dragEnd(e)}></div>
                    <div className="resizer bottom-right"
                      onMouseDown={(e) => this.dragStart(e)}
                      onMouseMove={(e) => this.drag(e)}
                      onMouseUp={(e) => this.dragEnd(e)}></div>
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
            height: 700px;
            border: 3px solid #000;
          }
          .videosContainer {
            position: absolute;
            flex: 1;
            background: #fff;
          }
          .videoContainer {
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            width: 400px;
          }
          .video {
            position: relative;
            flex: 1;
            // width: 100%;
            overflow: hidden;
            resize: both;
          }
          .video video {
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
            left: -3px;
            top: -3px;
            cursor: nwse-resize;
          }
          .resizer.top-right {
            right: -3px;
            top: -3px;
            cursor: nesw-resize;
          }
          .resizer.bottom-left {
            left: -3px;
            bottom: -3px;
            cursor: nesw-resize;
          }
          .resizer.bottom-right {
            right: -3px;
            bottom: -3px;
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
