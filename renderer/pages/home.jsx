import electron, { desktopCapturer, remote } from 'electron';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import fs from 'fs';
import Jimp from 'jimp';

import Movie from '../components/Movie';
import Sortable from '../components/Sortable';
import Timeline from '../components/Timeline';

const ipcRenderer = electron.ipcRenderer || false;

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef()

    this.videosContainer = React.createRef()

    this.state = {
      playing: false,
      position: 0.0,
      frame: 0,

      drawing: false,
      strokeWidth: 2,
      strokeColor: "#1abc9c",

      active: false,
      dragType: undefined,
      dragLayer: -1,
      originalX: 0,
      originalY: 0,
      mouseX: 0,
      mouseY: 0,
      originalWidth: 0,
      originalHeight: 0,

      minSize: 30,

      layers: [
        {
          id: "afzdqsf",
          x: 0,
          y: 0,
          width: 800,
          height: 450,
          clip: "24K.mp4",
          opacity: 1,
          volume: 1,
          reference: React.createRef(),
          layerReference: React.createRef(),
          sync: undefined,
          layerSync: undefined
        },
        {
          id: "fghsghgdfsg",
          x: 0,
          y: 0,
          width: 800,
          height: 450,
          clip: "test.mov",
          opacity: 1,
          volume: 1,
          reference: React.createRef(),
          layerReference: React.createRef(),
          sync: undefined,
          layerSync: undefined
        },
        {
          id: "kfujkghkgik",
          x: 0,
          y: 0,
          width: 800,
          height: 450,
          clip: "lightgrid.mp4",
          opacity: 1,
          volume: 1,
          reference: React.createRef(),
          layerReference: React.createRef(),
          sync: undefined,
          layerSync: undefined
        }
      ]
    }
  }

  componentDidMount() {
    this.MCorp = window.MCorp
    this.TIMINGSRC = window.TIMINGSRC
    this.to = new this.TIMINGSRC.TimingObject({provider:undefined, range:[0,100]});
    this.setState({frame: new this.TIMINGSRC.ScaleConverter(this.to, 1/24)});
    let layers = this.state.layers;
    for(let i = 0; i < layers.length; i++) {
      layers[i].sync = MCorp.mediaSync(layers[i].reference.current, this.to);
      layers[i].layerSync = MCorp.mediaSync(layers[i].layerReference.current, this.to);
    }

    let canvas = this.canvas.current;
    this.ctx = canvas.getContext("2d");

    this.to.on("timeupdate", function () {
      this.setState({frame: Math.round(to.pos*24)});
    });
  }

  play(e) {
    let v = this.to.query();
    if (v.position === 100 && v.velocity === 0) {
      this.to.update({position: 0.0, velocity: 1.0});
    } else {
      this.to.update({velocity: 1.0});
    }
    this.setState({playing: true})

    this.playTimeout = setInterval((self) => {
      self.setState({frame: Math.round(self.to.pos*24)});
    }, 0, this);
  }

  pause(e) {
    this.to.update({velocity: 0.0});
    // clearInterval(this.playTimeout);
    this.setState({playing: false})
  }

  nextFrame(e) {
    this.to.update({position: this.to.query().position + 1/24});
    // this.setState({frame: Math.round(this.to.pos*24)})
  }

  previousFrame(e) {
    this.to.update({position: this.to.query().position - 1/24});
    // this.setState({frame: Math.round(this.to.pos*24)})
  }

  firstFrame(e) {
    this.to.update({position: 0, velocity: 0.0});
    clearInterval(this.playTimeout);
    this.setState({playing: false})
  }

  lastFrame(e) {
    this.to.update({position: 100, velocity: 0.0});
    // clearInterval(this.playTimeout);
    this.setState({playing: false})
  }

  setFrame(frame) {
    this.to.update({position: frame/24});
    // this.setState({frame: frame})
  }

  dragStart(e) {
    e.preventDefault()
    if(this.state.drawing) {
      this.setState({
        active: true
      })
      if(this.state.strokeColor == "transparent") {
        this.erase(e)
      } else {
        this.ctx.strokeStyle = this.state.strokeColor;
        this.ctx.lineJoin = "round";
        this.ctx.lineWidth = this.state.strokeWidth;
        this.ctx.beginPath();
        this.draw(e);
      }
    } else if (e.button == 0 && e.target.getAttribute("draggable") == "true") {
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
    if(this.state.drawing) {
      this.ctx.closePath();
    }
  }

  drag(e) {
    if(this.state.active) {
      if(this.state.drawing) {
        if(this.state.strokeColor == "transparent") {
          this.erase(e)
        } else {
          this.draw(e)
        }
      } else {
        switch (this.state.dragType) {
          case "move":
          this.move(e)
          break;
          case "top":
          this.resizeTop(e)
          break;
          case "bottom":
          this.resizeBottom(e)
          break;
          case "left":
          this.resizeLeft(e)
          break;
          case "right":
          this.resizeRight(e)
          break;
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
  }

  draw(e) {
    let radius = 3;
    let start = 0;
    let end = Math.PI * 2;
    let canvas = this.canvas;
    let bbox = canvas.current.getBoundingClientRect();
    let x = e.pageX - bbox.left;
    let y = e.pageY - bbox.top;
    this.ctx.lineTo(x, y);
		this.ctx.stroke();
  }

  erase(e) {
    let canvas = this.canvas;
    let bbox = canvas.current.getBoundingClientRect();
    let x = e.pageX - bbox.left;
    let y = e.pageY - bbox.top;
    let size = this.state.strokeWidth;
    this.ctx.clearRect(x - (size/2), y - (size/2), size, size);
  }

  move(e) {
    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let left = originalX + (e.pageX - mouseX)
    let top = originalY + (e.pageY - mouseY)
    if(left < 0) {
      left = 0;
    } else if(left > 800 - originalWidth) {
      left = 800 - originalWidth;
    }
    if(top < 0) {
      top = 0;
    } else if(top > 450 - originalHeight) {
      top = 450 - originalHeight;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].x = left
    layers[dragLayer].y = top

    this.setState({layers: layers})
  }

  resizeTop(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalHeight = this.state.originalHeight;
    const originalY = this.state.originalY;

    let height = originalHeight - (e.pageY - mouseY)
    let top = originalY + (e.pageY - mouseY)

    if(height < minSize) {
      height = minSize;
    }
    if(top < 0) {
      height += top;
      top = 0;
    } else if(top > 450 - minSize) {
      top = 450 - minSize;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].y = top
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeBottom(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalHeight = this.state.originalHeight;

    let height = originalHeight + (e.pageY - mouseY)

    if(height < minSize) {
      height = minSize;
    } else if(height > 450) {
      height = 450;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeLeft(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const originalWidth = this.state.originalWidth;
    const originalX = this.state.originalX;

    let width = originalWidth - (e.pageX - mouseX)
    let left = originalX + (e.pageX - mouseX)

    if(width < minSize) {
      width = minSize;
    }
    if(left < 0) {
      width += left;
      left = 0;
    } else if(left > 800 - minSize) {
      left = 800 - minSize;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].x = left
    layers[dragLayer].width = width

    this.setState({layers: layers})
  }

  resizeRight(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const originalWidth = this.state.originalWidth;
    const originalX = this.state.originalX;

    let width = originalWidth + (e.pageX - mouseX)

    if(width < minSize) {
      width = minSize;
    } else if(width > 800) {
      width = 800;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].width = width

    this.setState({layers: layers})
  }

  resizeTopLeft(e) {
    const minSize = this.state.minSize

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

    if(width < minSize) {
      width = minSize;
    }
    if(height < minSize) {
      height = minSize;
    }
    if(left < 0) {
      width += left;
      left = 0;
    } else if(left > 800 - minSize) {
      left = 800 - minSize;
    }
    if(top < 0) {
      height += top;
      top = 0;
    } else if(top > 450 - minSize) {
      top = 450 - minSize;
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
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth + (e.pageX - mouseX)
    let height = originalHeight - (e.pageY - mouseY)
    let top = originalY + (e.pageY - mouseY)

    if(width < minSize) {
      width = minSize;
    } else if(width > 800) {
      width = 800;
    }
    if(height < minSize) {
      height = minSize;
    }
    if(top < 0) {
      height += top;
      top = 0;
    } else if(top > 450 - minSize) {
      top = 450 - minSize;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].y = top
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeBottomLeft(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth - (e.pageX - mouseX)
    let height = originalHeight + (e.pageY - mouseY)
    let left = originalX + (e.pageX - mouseX)

    if(width < minSize) {
      width = minSize;
    }
    if(height < minSize) {
      height = minSize;
    } else if(height > 450) {
      height = 450;
    }
    if(left < 0) {
      width += left;
      left = 0;
    } else if(left > 800 - minSize) {
      left = 800 - minSize;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].x = left
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  resizeBottomRight(e) {
    const minSize = this.state.minSize

    const mouseX = this.state.mouseX;
    const mouseY = this.state.mouseY;
    const originalWidth = this.state.originalWidth;
    const originalHeight = this.state.originalHeight;
    const originalX = this.state.originalX;
    const originalY = this.state.originalY;

    let width = originalWidth + (e.pageX - mouseX)
    let height = originalHeight + (e.pageY - mouseY)

    if(width < minSize) {
      width = minSize;
    } else if(width > 800) {
      width = 800;
    }
    if(height < minSize) {
      height = minSize;
    } else if(height > 450) {
      height = 450;
    }

    let layers = this.state.layers
    let dragLayer = this.state.dragLayer
    layers[dragLayer].width = width
    layers[dragLayer].height = height

    this.setState({layers: layers})
  }

  rearrangeLayers(layers) {
    const oldLayers = this.state.layers;
    let newLayers = []
    for(let i = 0; i < layers.length; i++) {
      if(true) {
        const layer = {
          id: layers[i].id,
          x: oldLayers[i].x,
          y: oldLayers[i].y,
          width: oldLayers[i].width,
          height: oldLayers[i].height,
          clip: layers[i].clip,
          opacity: layers[i].opacity,
          volume: layers[i].volume,
          reference: layers[i].reference,
          layerReference: layers[i].layerReference,
          sync: layers[i].sync,
          layerSync: layers[i].layerSync
        }
        newLayers.push(layer);
      } else {
        const layer = layers[i]
        newLayers.push(layer);
      }
    }
    this.setState({layers: newLayers});
  }


  setLayerOpacity(index, value) {
    let layers = this.state.layers;
    layers[index].opacity = value;
    this.setState({layers: layers});
  }

  setLayerVolume(index, value) {
    let layers = this.state.layers;
    layers[index].volume = value;
    layers[index].reference.current.volume = value;
    this.setState({layers: layers});
  }

  exportFrame() {
    const drawing = this.state.drawing
    this.setState({drawing: true})

    let self = this
    const bounds = remote.getCurrentWindow().webContents.getOwnerBrowserWindow().getBounds()
    const options = {
      types: ['window'],
      thumbnailSize: {
        width: bounds.width,
        height: bounds.height
      }
    }
    desktopCapturer.getSources(options).then(async sources => {
      console.log(sources);


      sources.forEach((source) => {
        if (source.name === "Vyewer") {
          const rect = self.videosContainer.current.getBoundingClientRect();

          fs.writeFile('screenshotFS.png', source.thumbnail.toPNG(), (err) => {
            if (err) throw err;
          })

          Jimp.read(source.thumbnail.toPNG(), (err, img) => {
            if(err) throw err;
            console.log(rect);
            console.log(img);
            img
              .crop(rect.left+5, rect.top+25, rect.width, rect.height)
              .write('screenshot.png');
          })

          this.setState({drawing: drawing})
        }
      });


      // for (const source of sources) {
      //   // Filter: main screen
      //   if (source.name === document.title) {
      //     try{
      //       const stream = await navigator.mediaDevices.getUserMedia({
      //         audio: false,
      //         video: {
      //           mandatory: {
      //             chromeMediaSource: 'desktop',
      //             chromeMediaSourceId: source.id,
      //             minWidth: 1280,
      //             maxWidth: 4000,
      //             minHeight: 720,
      //             maxHeight: 4000
      //           }
      //         }
      //       });
      //
      //       self.handleStream(stream);
      //     } catch (e) {
      //       // _this.handleError(e);
      //       console.error(e)
      //     }
      //   }
      // }
    })
  }

  handleStream(stream) {

  }

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>Vyewer</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
          <link href="./static/slider.css" rel="stylesheet"/>
        </Head>

        <div className="main">
          <script text="javascript" src="https://webtiming.github.io/timingsrc/lib/timingsrc-v2.js"></script>


          <script text="javascript" src="https://mcorp.no/lib/mediasync.js"></script>

          <div className="mainContainer">
            <div className="viewerContainer"
              onMouseDown={(e) => this.dragStart(e)}
              onMouseMove={(e) => this.drag(e)}
              onMouseUp={(e) => this.dragEnd(e)}
            >
              <div className="viewer">
                <div ref={this.videosContainer} className="videosContainer">
                  {this.state.layers.map((layer, index) => (
                    <Movie
                      key={layer.id}
                      resizeable={!this.state.drawing}
                      reference={layer.reference}
                      layerNb={index}
                      x={layer.x}
                      y={layer.y}
                      width={layer.width}
                      height={layer.height}
                      clip={layer.clip}
                      opacity={layer.opacity}
                      volume={layer.volume}
                    />
                  ))}
                </div>
                <div className="drawContainer">
                  <canvas ref={this.canvas} width="800" height="450" className="drawCanvas"></canvas>
                </div>
              </div>
            </div>
            <div className="timelineContainer">
              {this.to ?
                <Timeline
                  frame={this.state.frame}
                  setFrame={(frame) => this.setFrame(frame)}
                />
                : ""
              }
            </div>
            <div className="commandsContainer">
              <div className="commandBtn" onClick={(e) => this.firstFrame()}><i className="fas fa-fast-backward"></i></div>
              <div className="commandBtn" onClick={(e) => this.previousFrame()}><i className="fas fa-step-backward"></i></div>
              {this.state.playing ?
                <div className="commandBtn" onClick={(e) => this.pause()}><i className="fas fa-pause"></i></div>
                :
                <div className="commandBtn" onClick={(e) => this.play()}><i className="fas fa-play"></i></div>
              }
              <div className="commandBtn" onClick={(e) => this.nextFrame()}><i className="fas fa-step-forward"></i></div>
              <div className="commandBtn" onClick={(e) => this.lastFrame()}><i className="fas fa-fast-forward"></i></div>
            </div>
          </div>
          <div className="layersContainer">
            <div className="layersTitle">
              <h1>Video layers</h1>
            </div>
            <Sortable
              items={this.state.layers}
              updateList={(layers) => this.rearrangeLayers(layers)}
              setOpacity={(index, value) => this.setLayerOpacity(index, value)}
              setVolume={(index, value) => this.setLayerVolume(index, value)}
            />
          </div>
        </div>

        <div className="drawSettings">
          <div className={this.state.drawing ? "colorBullet editing" : "colorBullet editing selected"} onClick={() => this.setState({drawing: false})}>
            <i className="fas fa-crop-alt"></i>
          </div>
          <div className={this.state.drawing ? "colorBullet drawing selected" : "colorBullet drawing"} onClick={() => this.setState({drawing: true})}>
            <i className="fas fa-palette"></i>
          </div>
          <div className="colorBullet capture" onClick={() => this.exportFrame()}>
            <i className="fas fa-camera-retro"></i>
          </div>
          {this.state.drawing ?
            <div className="drawSettingsInner">
              <input type="number" value={this.state.strokeWidth} onChange={(e) => this.setState({strokeWidth: e.target.value})}/>
              <div className="colorBullet turquoise" onClick={() => this.setState({strokeColor: "#1abc9c"})}>
                {this.state.strokeColor == "#1abc9c" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet emerald" onClick={() => this.setState({strokeColor: "#2ecc71"})}>
                {this.state.strokeColor == "#2ecc71" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet peterRiver" onClick={() => this.setState({strokeColor: "#3498db"})}>
                {this.state.strokeColor == "#3498db" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet amethyst" onClick={() => this.setState({strokeColor: "#9b59b6"})}>
                {this.state.strokeColor == "#9b59b6" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet sunFlower" onClick={() => this.setState({strokeColor: "#f1c40f"})}>
                {this.state.strokeColor == "#f1c40f" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet carrot" onClick={() => this.setState({strokeColor: "#e67e22"})}>
                {this.state.strokeColor == "#e67e22" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet alizarin" onClick={() => this.setState({strokeColor: "#e74c3c"})}>
                {this.state.strokeColor == "#e74c3c" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet clouds" onClick={() => this.setState({strokeColor: "#ecf0f1"})}>
                {this.state.strokeColor == "#ecf0f1" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className="colorBullet wetAsphalt" onClick={() => this.setState({strokeColor: "#34495e"})}>
                {this.state.strokeColor == "#34495e" ? <i className="fas fa-pencil-alt"></i> : ""}
              </div>
              <div className={this.state.strokeColor == "transparent" ? "colorBullet eraser selected" : "colorBullet eraser"} onClick={() => this.setState({strokeColor: "transparent"})}>
                <i className="fas fa-eraser"></i>
              </div>
            </div>
            : ""
          }
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
            background: #3d3d3d;
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
            height: 450px;
            background: #000;
          }
          .videosContainer,
          .drawContainer {
            position: absolute;
            flex: 1;
          }
          .drawContainer .drawCanvas {
            position: relative;
            z-index: 2;
            // z-index: ${(this.state.layers.length + 1) * 10};
            width: 100%;
            height: 100%;
          }

          .timelineContainer {
            height: 50px;
            background: #4b4b4b;
          }
          .commandsContainer {
            height: 50px;
            background: #2d2d2d;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .commandBtn {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #4b4b4b;
            color: #fff;
            border-radius: 3px;
            margin: 2px;
          }



          .layersContainer {
            width: 400px;
            background: #242424;
          }
          .layersTitle {
            height: auto;
            margin: 5px 0;
            margin-left: 10px;
          }


          .drawSettings {
            position: fixed;
            width: 100px;
            height: auto;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 5px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .drawSettingsInner {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .drawSettings input {
            width: 90%;
            margin: 5px 0;
          }
          .colorBullet {
            display: inline-block;
            width: 40px;
            height: 40px;
            margin-top: 5px;
            border-radius: 50%;
            border: 3px solid #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .colorBullet:hover {
            border: 3px solid #e84393;
          }

          .editing.selected,
          .drawing.selected {
            background: #fff;
          }

          .turquoise {
            background: #1abc9c;
            border-color: #1abc9c;
          }
          .emerald {
            background: #2ecc71;
            border-color: #2ecc71;
          }
          .peterRiver {
            background: #3498db;
            border-color: #3498db;
          }
          .amethyst {
            background: #9b59b6;
            border-color: #9b59b6;
          }
          .sunFlower {
            background: #f1c40f;
            border-color: #f1c40f;
          }
          .carrot {
            background: #e67e22;
            border-color: #e67e22;
          }
          .alizarin {
            background: #e74c3c;
            border-color: #e74c3c;
          }
          .clouds {
            background: #ecf0f1;
            border-color: #ecf0f1;
          }
          .wetAsphalt {
            background: #34495e;
            border-color: #34495e;
          }
          .eraser {
            background: #95a5a6;
            border-color: #95a5a6;
          }
          .eraser.selected {
            border-color: #7f8c8d;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
