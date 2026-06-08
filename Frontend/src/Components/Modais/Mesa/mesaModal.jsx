import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";

const MesaModal = ({ dados, show, handleClose, submit }) => {
  const [formData, setFormData] = useState({
    capacidade: "",
    restricao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!name) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [editando, setEditando] = useState(false);
  useEffect(() => {
    if (dados) {
      setEditando(true);
      setFormData(dados);
    } else {
      setEditando(false);
      setFormData({ capacidade: "", restricao: "" });
    }
  }, [dados, show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editando ? "Gerenciar mesa" : "Registrar nova mesa"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={4}>

          <Form.Group>
            <Form.Label>Capacidade</Form.Label>
            <Form.Control
              value={formData.capacidade}
              name="capacidade"
              required={!editando}
              placeholder="Capacidade da mesa"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Restrição</Form.Label>
            <Form.Control
              value={formData.restricao}
              name="restricao"
              placeholder="Restricao da mesa"
              onChange={handleChange}
              />
          </Form.Group>
              </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={3}>
          {dados ? <Button variant="danger">Excluir</Button> : ""}
           <Button variant="secondary" type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success">
            
            {editando ? "Salvar alterações" : "Registrar"}
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
};

export default MesaModal;
