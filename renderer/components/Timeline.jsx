import React, { useState } from 'react';
import Slider from 'rc-slider';

const Timeline = ({ frame, setFrame }) => {

  const handleChange = index => {
    onChange(index);
  };

    return (
      <div className="timelineContainer">
        {/* <div className="time"></div> */}
        <Slider
          dots
          step={1}
          min={0}
          max={24}
          value={frame}
          onChange={(value) => setFrame(value)}
          marks={{ 20: 20, 40: 40, 100: 100 }}
        />

        <style jsx global>{`
          .timelineContainer .rc-slider {
            height: 50px;
            padding: 0;
          }
          .timelineContainer .rc-slider-rail {
            height: 100%;
            background-color: #1d1d1d;
          }
          .timelineContainer .rc-slider-track {
            height: 100%;
            background-color: #3a3a3a;
            // border-right: 3px solid #f00;
          }
          .timelineContainer .rc-slider-handle {
            width: 4px;
            height: 50px;
            margin-top: 0;
            margin-left: -2px;
            border-radius: 0;
            border: none;
          }
          .timelineContainer .rc-slider-handle:focus,
          .timelineContainer .rc-slider-handle:hover {
            box-shadow: none;
            background: #57c5f7;
          }
          .timelineContainer .rc-slider-mark {
            top: -18px;
          }
          .timelineContainer .rc-slider-dot {
            width: ${1}%;
            // max-width: 2px;
            height: 50px;
            background-color: #555;
            border: none;
            top: 0;
            border-radius: 0;
          }
        `}</style>
        <style jsx>{`
          .timelineContainer {
            height: 50px;
          }
          .time {
            background: #eee;
            width: ${frame}%;
          }
        `}</style>
      </div>
    );
};

export default Timeline;
