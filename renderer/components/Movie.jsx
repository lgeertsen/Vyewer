import React, { useState } from 'react';

const Movie = ({ resizeable, reference, layerNb, x, y, width, height, clip, opacity, volume }) => {

  const handleChange = index => {
    onChange(index);
  };

    return (
      <div className={layerNb == 0 ? "videoContainer main" : "videoContainer"} layernb={layerNb}>
        <div className="video">
          <video ref={reference}>
            <source src={`./static/${clip}`} type="video/mp4"/>
          </video>
        </div>

        {layerNb != 0 && resizeable ?
          <div className="resizersContainer">
            <div className="resizer mover" layernb={layerNb} draggable="true" dragtype="move"></div>

            <div className="resizer line top" layernb={layerNb} draggable="true" dragtype="top"></div>
            <div className="resizer line bottom" layernb={layerNb} draggable="true" dragtype="bottom"></div>
            <div className="resizer line left" layernb={layerNb} draggable="true" dragtype="left"></div>
            <div className="resizer line right" layernb={layerNb} draggable="true" dragtype="right"></div>

            <div className="resizer bullet top-left" layernb={layerNb} draggable="true" dragtype="top-left"></div>
            <div className="resizer bullet top-right" layernb={layerNb} draggable="true" dragtype="top-right"></div>
            <div className="resizer bullet bottom-left" layernb={layerNb} draggable="true" dragtype="bottom-left"></div>
            <div className="resizer bullet bottom-right" layernb={layerNb} draggable="true" dragtype="bottom-right"></div>
          </div>
          : ""
        }

        <style jsx>{`
          .videoContainer {
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            display: flex;
            width: ${width}px;
            height: ${height}px;
          }
          .video {
            position: relative;
            // z-index: ${layerNb*10};
            flex: 1;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
          }
          .video video {
            position: absolute;
            width: 800px;
            left: -${x}px;
            top: -${y}px;
            opacity: ${opacity};
          }
          .resizersContainer {
            position: absolute;
            top: 0;
            left: 0;
          }
          .videoContainer .mover {
            // display: none;
            position: absolute;
            z-index: ${layerNb*10 + 2};
            width: 100%;
            height: 100%;
            cursor: move;
          }
          .videoContainer .mover:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          .videoContainer .line {
            position: absolute;
            // display: none;
            z-index: ${layerNb*10 + 4};
          }
          .videoContainer .bullet {
            position: absolute;
            z-index: ${layerNb*10 + 4};
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #c0392b;
          }
          // .videoContainer:hover .resizer {
          //   display: block;
          // }
          .resizer.top {
            width: 20px;
            height: 2px;
            border-top: 2px solid #c0392b;
            border-bottom: 2px solid #c0392b;
            top: -2px;
            left: calc(${width/2}px - 10px);
            cursor: n-resize;
          }
          .resizer.bottom {
            width: 20px;
            height: 2px;
            border-top: 2px solid #c0392b;
            border-bottom: 2px solid #c0392b;
            bottom: -2px;
            left: calc(${width/2}px - 10px);
            cursor: s-resize;
          }
          .resizer.left {
            width: 2px;
            height: 20px;
            border-left: 2px solid #c0392b;
            border-right: 2px solid #c0392b;
            top: calc(${height/2}px - 10px);
            left: -2px;
            cursor: w-resize;
          }
          .resizer.right {
            width: 2px;
            height: 20px;
            border-left: 2px solid #c0392b;
            border-right: 2px solid #c0392b;
            top: calc(${height/2}px - 10px);
            right: -2px;
            cursor: e-resize;
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
        `}</style>
      </div>
    );
};

export default Movie;
