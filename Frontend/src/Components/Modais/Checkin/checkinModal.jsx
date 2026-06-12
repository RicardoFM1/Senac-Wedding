import { Modal, Stack } from "react-bootstrap";

const CheckinModal = ({ show, handleClose, checkin, onConfirm, onCancel }) => {
  const convidado = checkin?.convidado;
  const usuario = checkin?.usuario;

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do checkin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          <div>
            <strong>Usuário</strong>
            <p className="mb-0">{usuario?.nome || "-"}</p>
            <p className="mb-0">CPF: {usuario?.cpf || "-"}</p>
          </div>
          <div>
            <strong>Convidado</strong>
            <p className="mb-0">{convidado?.nome || "-"} {convidado?.sobrenome || ""}</p>
            <p className="mb-0">CPF: {convidado?.cpf || "-"}</p>
          </div>
          <div>
            <strong>Data e hora</strong>
            <p className="mb-0">{checkin?.data_e_hora || "-"}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p className="mb-0">{checkin?.status || "-"}</p>
          </div>
          <div>
            <strong>Confirmação</strong>
            <p className="mb-0">{convidado?.confirmacao || "-"}</p>
          </div>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          Cancelar checkin
        </button>
        <button type="button" className="btn btn-success" onClick={onConfirm}>
          Confirmar checkin
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckinModal;
