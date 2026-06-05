import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import style from "./convidados.module.css";
import { FaSearch } from "react-icons/fa";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";

const Convidados = () => {
  const [search, setSearch] = useState("");

  const rows = [
    {
      nome: "Ricardo5",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmação",
      mesa_idmesa: 1,
    },
    {
      nome: "Ricardo3",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "cpf",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "cancelado",
      mesa_idmesa: 1,
    },
    {
      nome: "Ricardo2",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "11111111111",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "pendente",
      mesa_idmesa: 1,
    },
    {
      nome: "Ricardo1",
      sobrenome: "Ricardo2",
      email: "email",
      cpf: "05380295010",
      telefone: "telefone",
      categoria: "categoria",
      confirmacao: "confirmado",
      mesa_idmesa: 1,
    },
  ];

  const [rowFiltrada, setRowFiltrada] = useState(rows);


useEffect(() => {
 setRowFiltrada(
      rows.filter((c) =>
        (c.nome + " " + c.confirmacao + " " + c.cpf)
      .toLowerCase()
      .includes(search?.toLowerCase()),
    )
  );
}, [search])

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



  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Lista de convidados</h1>
          <p className="text-muted">{rows.length} Convidados no total</p>
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
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar um convidado"
              />
            </InputGroup>
          </Form>

          <Stack className={style.stackButtons} gap={3} direction="horizontal">
            <Button onClick={() => setSearch("")}>Todos</Button>
            <Button onClick={() => setSearch("confirmado")}>Confirmados</Button>
            <Button onClick={() => setSearch("pendente")}>Pendentes</Button>
            <Button onClick={() => setSearch("cancelado")}>Cancelados</Button>
          </Stack>
        </Stack>
      </Stack>
      <Tabela
        columns={columns}
        rows={rowFiltrada}
        keyField={"id_convidado"}
      />
    </>
  );
};

export default Convidados;
