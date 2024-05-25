import React, { useState, useEffect, useRef } from 'react';
import { BasicNodeWidget } from './nodes/basic_node/BasicNodeWidget.tsx';

import { Saturation, Hue, ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

import './EditActionModal.css';
import Modal from '../Modal/Modal';
import { OutputPortModel } from './nodes/basic_node/ports/output_port/OutputPortModel';
import { InputPortModel } from './nodes/basic_node/ports/input_port/InputPortModel';

const initialEditActionModalData = {
  newInputName: '',
  newOutputName: '',
};

const EditActionModal = ({ isOpen, onClose, currentActionNode, setColorActionNode, addInputPort, addOutputPort, deleteInputPort, deleteOutputPort}) => {
  // const [color, setColor] = useColor(currentActionNode ? currentActionNode.getColor().replaceAll(",", " ") : "rgb(128 0 128)");
  const focusInputRef = useRef(null);
  const [color, setColor] = useColor("rgb(128 0 128)");
  const [inputName, setInputName] = React.useState(false);
  const [outputName, setOutputName] = React.useState(false);
  const [formState, setFormState] = useState(initialEditActionModalData);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setInputName(false)
    setOutputName(false)
    setFormState(initialEditActionModalData);
  }, [isOpen]);

  useEffect(() => {
    if (currentActionNode) {
      setColorActionNode(color.rgb['r'], color.rgb['g'], color.rgb['b']);
    }
  }, [color]);

  const isBackgroundDark = () => {
    return ((color.rgb['r'] + color.rgb['g'] + color.rgb['b']) / 3) < 123
  }

  const reRender = () => {
    forceUpdate();
    document.getElementById('node-editor-modal').focus();
  }

  const horizontalScrolling = (e) => {
    e.preventDefault()
    var containerScrollPosition = e.target.scrollLeft
    e.target.scrollBy({
        top: 0,
        left: e.deltaY,
        behaviour: 'smooth'
    })
  }

  const openInputCreation = () => {
    if (!outputName) {
      setInputName(true)
    }
  }

  const openOutputCreation = () => {
    if (!inputName) {
      setOutputName(true)
    }
  }

  const addInput = () => {
    //TODO: Check if the name is valid
    addInputPort(formState['newInputName']);
    setInputName(false);
    reRender();
  }

  const addOutput = () => {
    //TODO: Check if the name is valid
    addOutputPort(formState['newOutputName']);
    setOutputName(false);
    reRender();
  }

  const cancelCreation = () => {
    setInputName(false)
    setOutputName(false)
    reRender();
  }

  return (
    <Modal id="node-editor-modal" hasCloseBtn={true} isOpen={isOpen} onClose={onClose} >
      <div className="node-editor-row">
        <label className="node-editor-title" htmlFor="actionNameEditor">Action Editor</label>
      </div>
      <div className="node-editor-row">
        {currentActionNode &&
          <div className="node-editor" style={{backgroundColor: currentActionNode.getColor()}}>
            <label className="node-editor-name" style={{color: isBackgroundDark() ? 'white' : 'black'}}>{currentActionNode.getName()}</label>
            <div className="node-editor-io">
              <div className="node-editor-inputs">
                {Object.entries(currentActionNode.getPorts()).map((port, index) => {
                  if (port[1] instanceof InputPortModel) {
                    return (
                      <div key={index} className="node-editor-input node-editor-io-entry">
                        <label
                          id={port[0]}
                          className="node-editor-io-name"
                          onWheel={horizontalScrolling}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}>{port[0]}</label>
                        <button
                          className={"node-editor-io-delete"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Delete'
                          onClick={() => {deleteInputPort(port[1], port[0]); reRender()}}>-</button>
                      </div>
                    );
                  }
                })}
                {inputName ? (
                  <div className="node-editor-io-name-entry-container">
                      <input
                        ref={focusInputRef}
                        type="text"
                        id="node-editor-io-name-entry"
                        name="newInputName"
                        className='node-editor-io-name-entry'
                        autoComplete='off'
                        onChange={handleInputChange}
                        required
                        style={{color: isBackgroundDark() ? 'white' : 'black'}}
                      />
                      <button
                          className={"node-editor-io-delete"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Cancel'
                          onClick={() => cancelCreation()}>x</button>
                      <button
                          className={"node-editor-io-accept"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Create'
                          onClick={() => addInput()}>/</button>
                  </div>
                    )
                    : (
                  <button
                    className="node-editor-button"
                    style={{color: isBackgroundDark() ? 'white' : 'black'}}
                    onClick={() => {openInputCreation()}}
                    title='Add input'>
                    +
                  </button>
                    )
                  }
              </div>
              <div className="node-editor-outputs">
                {Object.entries(currentActionNode.getPorts()).map((port, index) => {
                  if (port[1] instanceof OutputPortModel) {
                    return (
                      <div key={index} className="node-editor-output node-editor-io-entry" >
                        <button
                          className={"node-editor-io-delete"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Delete'
                          onClick={() => {deleteOutputPort(port[1], port[0]); reRender()}}>-</button>
                        <label
                          className="node-editor-io-name"
                          onWheel={horizontalScrolling}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}>{port[0]}</label>
                      </div>
                    );
                  }
                })}
                {outputName ? (
                  <div className="node-editor-io-name-entry-container">
                      <input
                        ref={focusInputRef}
                        type="text"
                        id="node-editor-io-name-entry"
                        name="newOutputName"
                        className='node-editor-io-name-entry'
                        autoComplete='off'
                        onChange={handleInputChange}
                        required
                        style={{color: isBackgroundDark() ? 'white' : 'black'}}
                      />
                      <button
                          className={"node-editor-io-delete"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Cancel'
                          onClick={() => cancelCreation()}>x</button>
                      <button
                          className={"node-editor-io-accept"}
                          style={{color: isBackgroundDark() ? 'white' : 'black'}}
                          title='Create'
                          onClick={() => addOutput()}>/</button>
                  </div>
                    )
                    : (
                  <button
                    className="node-editor-button"
                    style={{color: isBackgroundDark() ? 'white' : 'black'}}
                    onClick={() => {openOutputCreation()}}
                    title='Add output'>
                    +
                  </button>
                    )
                  }
              </div>
            </div>
          </div>
        }
      </div>
      <div className="node-editor-row">
        <label className="node-editor-title" for="favcolor">Color:</label>
        <Saturation height={50} width={300} color={color} onChange={setColor} />
        <Hue color={color} onChange={setColor} />
      </div>
    </Modal>
  );
};

export default EditActionModal;