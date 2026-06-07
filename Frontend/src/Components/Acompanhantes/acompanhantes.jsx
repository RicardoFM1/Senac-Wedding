import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import style from "./acompanhantes.module.css";
import { IoIosArrowForward } from "react-icons/io";
import Tabela from "../Tabela/tabela";
import Api from "../../Service/api";

const Acompanhantes = () => {
  const [search, setSearch] = useState("");
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [acompanhantesFiltrados, setAcompanhantesFiltrados] = useState();

  const buscarAcompanhantes = async () => {
    try {
      const res = await Api.get("/acompanhante");

      if (res.status === 200) {
        setAcompanhantes(res.data.dados);
        setAcompanhantesFiltrados(res.data.dados);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarAcompanhantes();
  }, []);

  useEffect(() => {
    const termo = search?.toLowerCase() || "";
    setAcompanhantesFiltrados(
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
            {acompanhantesFiltrados?.length} Acompanhante(s) no total
          </p>
          <p className="text-muted">
            Clique na linha da tabela para acessar mais informações
          </p>
        </Stack>
        <Stack
          className="px-5 flex-column flex-md-row"
          direction="horizontal"
          gap={3}
        >
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
        </Stack>
      </Stack>
      <Tabela
        columns={columns}
        rows={acompanhantesFiltrados}
        keyField="id_acompanhante"
      />
    </>
  );
};

export default Acompanhantes;
