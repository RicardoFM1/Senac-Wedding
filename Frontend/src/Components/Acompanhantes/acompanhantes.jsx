import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import style from "./acompanhantes.module.css";
import { IoIosArrowForward } from "react-icons/io";
import Tabela from "../Tabela/tabela";

const acompanhantes = [
  {
    id: 1,
    nome: "Ana",
    sobrenome: "Silva",
    email: "ana.silva@example.com",
    idade: 27,
    convidado: "Bruna Santos (CPF 123.456.789-00)",
  },
  {
    id: 2,
    nome: "Carlos",
    sobrenome: "Pereira",
    email: "carlos.pereira@example.com",
    idade: 34,
    convidado: "Marcos Costa (CPF 987.654.321-11)",
  },
  {
    id: 3,
    nome: "Juliana",
    sobrenome: "Oliveira",
    email: "juliana.oliveira@example.com",
    idade: 22,
    convidado: "Paula Rocha (CPF 456.789.123-22)",
  },
];

const Acompanhantes = () => {
  const [search, setSearch] = useState("");
  const [rowFiltrada, setRowFiltrada] = useState(acompanhantes);

  useEffect(() => {
    const termo = search?.toLowerCase() || "";
    setRowFiltrada(
      acompanhantes.filter((item) =>
        `${item.nome} ${item.sobrenome} ${item.email} ${item.idade} ${item.convidado}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  }, [search]);

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Sobrenome", accessor: "sobrenome" },
    { header: "Email", accessor: "email" },
    { header: "Idade", accessor: "idade" },
    { header: "Convidado", accessor: "convidado" },
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
      <Stack direction="horizontal">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Lista de acompanhantes</h1>
          <p className="text-muted">
            {acompanhantes.length} acompanhantes no total
          </p>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar um acompanhante"
              />
            </InputGroup>
          </Form>
        </Stack>
      </Stack>
      <Tabela columns={columns} rows={rowFiltrada} keyField="id_acompanhante" />
    </>
  );
};

export default Acompanhantes;
