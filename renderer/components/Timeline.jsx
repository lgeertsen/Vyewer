import React, { useState, useRef } from 'react';
// import Slider from 'rc-slider';

const maxFrames = 240

const Timeline = ({ frame, setFrame }) => {
  const timeline = useRef(null);

  const handleChange = index => {
    onChange(index);
  };

  const renderFrames = () => {
    let frames = [];
    for(let i = 0; i < maxFrames; i++) {
      frames.push(
        <div className="timeline-frame" onClick={() => setFrame(i)}>
          <div className="timeline-frame-title">{i}</div>
        </div>
      );
    }
    return frames
  }

  const jumpToFrame = e => {
    console.log(e.nativeEvent.offsetX);
    let w = timeline.current.offsetWidth
    let f = Math.floor((e.nativeEvent.offsetX/w) * 240)
    console.log(f)
    setFrame(f)
  }

    return (
      <div className="timelineContainer">
        <div ref={timeline} className="timeline" onClick={e => jumpToFrame(e)}>
          <div className="frameNb">{frame}</div>
          <div className="progress"></div>
          {/* {renderFrames()} */}
        </div>
        {/* <div className="time"></div> */}
        {/* <Slider
          dots
          step={1}
          min={0}
          max={50}
          value={frame}
          onChange={(value) => setFrame(value)}
          marks={{ 20: 20, 40: 40, 100: 100 }}
        /> */}

        <style jsx global>{`

          // .timelineContainer .rc-slider {
          //   height: 50px;
          //   padding: 0;
          // }
          // .timelineContainer .rc-slider-rail {
          //   height: 100%;
          //   background-color: #1d1d1d;
          // }
          // .timelineContainer .rc-slider-track {
          //   height: 100%;
          //   background-color: rgba(150, 150, 150, 0.5);
          //   // border-right: 3px solid #f00;
          // }
          // .timelineContainer .rc-slider-handle {
          //   width: 4px;
          //   height: 50px;
          //   margin-top: 0;
          //   margin-left: -2px;
          //   border-radius: 0;
          //   border: none;
          // }
          // .timelineContainer .rc-slider-handle:focus,
          // .timelineContainer .rc-slider-handle:hover {
          //   box-shadow: none;
          //   background: #57c5f7;
          // }
          // .timelineContainer .rc-slider-mark {
          //   top: -18px;
          // }
          // .timelineContainer .rc-slider-dot {
          //   width: 2px;
          //   // max-width: 2px;
          //   height: 50px;
          //   background-color: rgba(100, 100, 100, 0.5);
          //   border: none;
          //   top: 0;
          //   border-radius: 0;
          // }
          .timeline {
            position: relative;
            height: 100%;
            width: 100%;
            // display: flex;
            // flex-direction: row;
            // justify-content: space-between;
            // overflow-x: hidden
          }
          .frameNb {
            height: 20px;
            width: 50px;
            position: absolute;
            top: -20px;
            left: calc(${Math.max(5, Math.min((frame/240) *100, 95))}% - 20px);
            // padding: 5px 20px;
            background: #222;
            color: #fff;
            border-radius: 3px;
          }
          .progress {
            height: 100%;
            width: ${Math.min((frame/240) * 100, 100)}%;
            background: #777;
          }
          .timeline-frame {
            width: 10px;
            background-color: red;
            height: 50px;
            position: relative;
          }
          .timeline-frame-title {
            position: absolute;
            top: -20px;
            overflow: visible;
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
