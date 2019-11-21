import React, { useState } from 'react';

const Movie = ({ reference, layerNb, x, y, width, height, clip }) => {

  const handleChange = index => {
    onChange(index);
  };

    return (
      <div className="videoContainer" layernb={layerNb}>
        <div className="video">
          <video ref={reference} currentTime={7}>
            <source src={`./static/${clip}.mp4`} type="video/mp4"/>
          </video>
        </div>
        <div className="resizer top-left" layernb={layerNb} draggable="true" dragtype="top-left"></div>
        <div className="resizer top-right" layernb={layerNb} draggable="true" dragtype="top-right"></div>
        <div className="resizer bottom-left" layernb={layerNb} draggable="true" dragtype="bottom-left"></div>
        <div className="resizer bottom-right" layernb={layerNb} draggable="true" dragtype="bottom-right"></div>

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
            flex: 1;
            // width: 100%;
            overflow: hidden;
          }
          .video video {
            position: absolute;
            left: -${x}px;
            top: -${y}px;
            width: 800px;
          }
          .videoContainer .resizer {
            position: absolute;
            z-index: 10;
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
        `}</style>
      </div>
    );
};

export default Movie;
