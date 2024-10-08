import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import MinimalDiagramEditor from "../DiagramEditor";
import { ReactComponent as CloseIcon } from "../../Modal/img/close.svg";

const EditSubTreeModal = ({ isOpen, onClose, ...otherProps }) => {
  const [editorReady, setEditorReady] = useState(false);

  // Effect to set the editor ready when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setEditorReady(true);
    } else {
      setEditorReady(false); // Reset editorReady when the modal is closed
    }
  }, [isOpen]);

  return (
    <Modal
      id="subtree-editor-modal"
      hasCloseBtn={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="modal-titlebar">
        <label
          className="modal-titlebar-title"
          htmlFor="actionName"
          style={{ textAlign: "center" }}
        >
          Edit port value
        </label>
        <CloseIcon
          className="modal-titlebar-close icon"
          onClick={onClose}
          fill={"var(--icon)"}
        />
      </div>

      {/* Ensure sufficient space for the diagram */}
      <div style={{ width: "90vw", height: "90vh", overflow: "hidden" }}>
        <MinimalDiagramEditor />
      </div>
    </Modal>
  );
};

export default EditSubTreeModal;
