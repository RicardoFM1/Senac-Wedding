import { useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";

const ConvidadoModal = ({ dados, show, handleClose, submit }) => {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    telefone: "",
    categoria: "",
    confirmacao: "",
    mesa_idmesa: null,
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
      setFormData({ ...dados, confirmacao: "" });
    } else {
      setEditando(false);
      setFormData({
        nome: "",
        sobrenome: "",
        email: "",
        cpf: "",
        telefone: "",
        categoria: "",
        confirmacao: "",
        mesa_idmesa: null,
      });
    }
  }, [dados, show]);

  const handleSubmit = (e) => {
    e.preventDefault();


    submit(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? "Gerenciar convidado" : "Registrar novo convidado"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                value={formData?.nome}
                name="nome"
                required={!editando}
                placeholder="Nome do convidado"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control
                value={formData?.sobrenome}
                name="sobrenome"
                required={!editando}
                placeholder="Sobrenome do convidado"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={formData?.email}
                name="email"
                required={!editando}
                placeholder="Email do convidado"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cpf</Form.Label>
              <Form.Control
                value={formData?.cpf}
                name="cpf"
                required={!editando}
                placeholder="Cpf do convidado"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                value={formData?.telefone}
                name="telefone"
                required={!editando}
                placeholder="Telefone do convidado"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                value={formData?.categoria}
                name="categoria"
                required={!editando}
                placeholder="Categoria do convidado (parente, convidado, etc...)"
                onChange={handleChange}
              />
            </Form.Group>
            {editando ? (
              <Form.Group>
                <Form.Label>Confirmação</Form.Label>
                <Form.Select
                  value={formData.confirmacao}
                  name="confirmacao"
                  required={!editando}
                  placeholder="Confirmação do convidado"
                  onChange={handleChange}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>
            ) : (
              ""
            )}
            <Form.Group>
              <Form.Label>Nº da mesa (Opcional)</Form.Label>
              <Form.Control
                type="number"
                value={formData?.mesa_idmesa}
                name="mesa_idmesa"
                required={!editando}
                placeholder="Nº da mesa do convidado"
                onChange={handleChange}
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="horizontal" gap={3}>
            {dados ? (
              <Button type="button" variant="danger">
                Excluir
              </Button>
            ) : (
              ""
            )}
            <Button type="submit" variant="success">
              {editando ? "Salvar alterações" : "Registrar"}
            </Button>
          </Stack>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConvidadoModal;
