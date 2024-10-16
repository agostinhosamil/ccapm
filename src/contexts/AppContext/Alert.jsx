import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const Alert = ({ show, title, description, ...props }) => {
  const modalCloseHandler = () => {
    if (typeof props.onClose === "function") {
      props.onClose();
    }
  };

  return (
    <Modal show={show} onExit={modalCloseHandler} onHide={modalCloseHandler}>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>
        <p>{description}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={modalCloseHandler}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
