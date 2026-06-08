import { Button, Modal } from "react-bootstrap";

const ConfirmacaoDeleteModal = ({ show, handleClose, onConfirm, itemType, itemName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tem certeza que deseja deletar este {itemType}?</p>
        {itemName ? <p className="mb-0"><strong>{itemName}</strong></p> : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmacaoDeleteModal;
