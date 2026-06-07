import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";

const AcompanhanteModal = ({ dados, show, handleClose, submit, convidados }) => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    idade: "",
    convidado_idconvidado: "",
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (dados) {
      setEditando(true);
      setFormData({
        ...dados,
        cpf: dados.cpf ?? "",
        idade: dados.idade?.toString() ?? "",
        convidado_idconvidado: dados.convidado_idconvidado?.toString() ?? "",
      });
    } else {
      setEditando(false);
      setFormData({
        nome: "",
        sobrenome: "",
        email: "",
        cpf: "",
        idade: "",
        convidado_idconvidado: "",
      });
    }
  }, [dados, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      idade: Number(formData.idade),
      convidado_idconvidado: Number(formData.convidado_idconvidado),
    };
    submit(payload);
  };

  const selectedConvidado = convidados?.find(
    (convidado) => Number(convidado.id_convidado) === Number(formData.convidado_idconvidado),
  );

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? "Editar acompanhante" : "Adicionar acompanhante"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome do acompanhante"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleChange}
                placeholder="Sobrenome do acompanhante"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email do acompanhante"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="CPF do acompanhante"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Idade</Form.Label>
              <Form.Control
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                placeholder="Idade do acompanhante"
                required
              />
            </Form.Group>
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
                <strong>Convidado selecionado:</strong>
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
            {editando ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AcompanhanteModal;
