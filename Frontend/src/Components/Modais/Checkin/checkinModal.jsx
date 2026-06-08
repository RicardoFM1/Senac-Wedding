import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";

const CheckinModal = ({ show, handleClose, submit, convidados }) => {
  const [formData, setFormData] = useState({
    convidado_idconvidado: "",
  });

  useEffect(() => {
    if (show) {
      setFormData({ convidado_idconvidado: "" });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedConvidado = convidados?.find(
    (convidado) => Number(convidado.id_convidado) === Number(formData.convidado_idconvidado),
  );


  const handleSubmit = (e) => {
    e.preventDefault();
    submit({ convidado_idconvidado: Number(formData.convidado_idconvidado) });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Criar checkin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Convidado</Form.Label>
              <Form.Select
                name="convidado_idconvidado"
                value={formData.convidado_idconvidado}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um convidado</option>
                {convidados?.map((convidado) => (
                  <option key={convidado.id_convidado} value={convidado.id_convidado}>
                    {`${convidado.nome} ${convidado.sobrenome} - ${convidado.cpf}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedConvidado ? (
              <div>
                <strong>Convidado selecionado</strong>
                <p className="mb-0">{selectedConvidado.nome} {selectedConvidado.sobrenome}</p>
                <p className="mb-0">CPF: {selectedConvidado.cpf}</p>
                
              </div>
            ) : null}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="success">
            Confirmar checkin
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CheckinModal;
