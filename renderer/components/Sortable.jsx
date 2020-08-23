import React from 'react';
import {SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Slider from 'rc-slider';

const DragHandle = sortableHandle(() =>
  <div className="dragHandle">
    <i className="fas fa-grip-lines"></i>
    <style jsx>{`
      .dragHandle {
        color: #fff;
        margin-left: 10px;
        width: 30px;
        height: 30px;
        cursor: n-resize;
      }
      `}</style>
  </div>
);

const SortableLayer = SortableElement(({layer, setOpacity, setVolume}) => {
  return(
    <div className="layerContainer">
      <DragHandle />
      <div className="layerInner">
        <div className="layerTitle">
          <i className="fas fa-lock"></i>
          <h3>{layer.clip}</h3>
        </div>
        <div className="layerMain">
          <video ref={layer.layerReference} muted>
            <source src={`${layer.clip}`} type="video/mp4"/>
          </video>
          <div className="layerOptions">
            <div className="layerOption">
              <div className="optionTitle">
                <h4>Opacity:</h4>
                <input type="number" min={0} max={1} step={0.1} value={layer.opacity} onChange={(e) => setOpacity(e.target.value)}/>
              </div>
              <div className="optionSlider">
                <Slider min={0} max={1} step={0.01} value={layer.opacity} onChange={(value) => setOpacity(value)} />
              </div>
            </div>
            <div className="layerOption">
              <div className="optionTitle">
                <h4>Volume:</h4>
                <input type="number" min={0} max={1} step={0.1} value={layer.volume} onChange={(e) => setVolume(e.target.value)}/>
              </div>
              <div className="optionSlider">
                <Slider min={0} max={1} step={0.01} value={layer.volume} onChange={(value) => setVolume(value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .layerContainer {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: auto;
          background: #2d2d2d;
          border-bottom: 1px solid #444;
        }
        .layerInner {
          margin: 5px 0;
          display: flex;
          flex-direction: column;
        }
        .layerTitle {
          padding-top: 10px;
          height: auto;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .layerTitle i {
          color: #777;
          background: #eee;
          padding: 5px;
          border-radius: 50%;
          margin-right: 15px;
        }
        .layerTitle h3 {
          color: #fff;
        }
        .layerMain {
          display: flex;
          flex-direction: row;
        }
        .layerMain video {
          width: 150px;
        }
        .layerOptions {
          width: 180px;
          display: flex;
          flex-direction: column;
        }
        .layerOption {
          margin: 5px 10px;
        }
        .optionTitle {
          height: auto;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .optionTitle h4 {
          color: #fff;
        }
        .optionTitle input {
          width: 45px;
        }
        `}</style>
      </div>
  )
});

const SortableList = SortableContainer(({items, setOpacity, setVolume}) => {
  return (
    <div className="container">
      {items.map((value, index) => (
        <SortableLayer
          key={value.id}
          index={index}
          layer={value}
          setOpacity={(value) => setOpacity(index, value)}
          setVolume={(value) => setVolume(index, value)}
        />
      ))}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
});

export default class SortableComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  onSortEnd(indexes) {
    let items = this.props.items
    const newItems = arrayMove(items, indexes.oldIndex, indexes.newIndex)
    this.props.updateList(newItems)
  }

  render() {
    return <SortableList
      items={this.props.items}
      setOpacity={(index, value) => this.props.setOpacity(index, value)}
      setVolume={(index, value) => this.props.setVolume(index, value)}
      onSortEnd={(indexes, e) => this.onSortEnd(indexes)}
      useDragHandle={true}
      lockAxis="y" />;
  }
}
