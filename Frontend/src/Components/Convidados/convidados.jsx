import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import style from "./convidados.module.css";
import { FaSearch } from "react-icons/fa";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";

const Convidados = () => {
  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Sobrenome", accessor: "sobrenome" },
    { header: "Email", accessor: "email" },
    { header: "Cpf", accessor: "cpf" },
    { header: "Telefone", accessor: "telefone" },
    { header: "Categoria", accessor: "categoria" },
    { header: "Confirmação", accessor: "confirmacao" },
    { header: "Nº Mesa", accessor: "mesa_idmesa" },
    {
      header: "",
      accessor: "",
      render: (row) => (
        <Stack direction="horizontal">
          <p>
            <IoIosArrowForward />
          </p>
        </Stack>
      ),
    },
  ];

  const rows = [
    {
      nome: "Ricardo",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmação",
      mesa_idmesa: 1,
    },
     {
      nome: "Ricardo",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmação",
      mesa_idmesa: 1,
    }, {
      nome: "Ricardo",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmação",
      mesa_idmesa: 1,
    }, {
      nome: "Ricardo",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmação",
      mesa_idmesa: 1,
    },
  ];
  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Lista de convidados</h1>
          <p className="text-muted">15 Convidados no total</p>
        </Stack>
        <Stack
          className="px-5 flex-column flex-md-row"
          direction="horizontal"
          gap={3}
        >
          <Form>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch color="gray" />
              </InputGroup.Text>
              <Form.Control placeholder="Buscar um convidado" />
            </InputGroup>
          </Form>

          <Stack className={style.stackButtons} gap={3} direction="horizontal">
            <Button>Todos</Button>
            <Button>Confirmados</Button>
            <Button>Pendentes</Button>
            <Button>Cancelados</Button>
          </Stack>
        </Stack>
      </Stack>
      <Tabela columns={columns} rows={rows} keyField={"id_convidado"} />
    </>
  );
};

export default Convidados;
