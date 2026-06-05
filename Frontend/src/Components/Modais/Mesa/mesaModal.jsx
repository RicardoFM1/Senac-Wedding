import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";

const MesaModal = ({ dados, show, handleClose, submit }) => {
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    capacidade: "",
    restricao: "",
  });

  useEffect(() => {
    if (dados) {
      setEditando(true);
      setFormData(dados);
    } else {
      setEditando(false);
      setFormData({ capacidade: "", restricao: "" });
    }
  });
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editando ? "Gerenciar mesa" : "Registrar nova mesa"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Capacidade</Form.Label>
            <Form.Control
              value={formData.capacidade}
              required={!editando}
              placeholder="Capacidade da mesa"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Restrição</Form.Label>
            <Form.Control
              value={formData.restricao}
              placeholder="Restricao da mesa"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={3}>
          {dados ? <Button variant="danger">Excluir</Button> : ""}
          <Button variant="success">
            {editando ? "Salvar alterações" : "Registrar"}
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default MesaModal;
