import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Tabela from "../Tabela/tabela";

const checkins = [
  {
    id: 1,
    numero: 1,
    usuario: "Admin",
    convidado: "Mariana Gomes",
    dataHora: "05/06/2026 18:30",
  },
  {
    id: 2,
    numero: 2,
    usuario: "Recepção",
    convidado: "Lucas Fernandes",
    dataHora: "05/06/2026 19:05",
  },
  {
    id: 3,
    numero: 3,
    usuario: "Recepção",
    convidado: "Camila Souza",
    dataHora: "05/06/2026 19:20",
  },
];

const Checkins = () => {
  const [search, setSearch] = useState("");
  const [rowFiltrada, setRowFiltrada] = useState(checkins);

  const handleFiltragem = () => {
    const termo = search?.toLowerCase() || "";
    setRowFiltrada(
      checkins.filter((item) =>
        `${item.numero} ${item.usuario} ${item.convidado} ${item.dataHora}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  };

  useEffect(() => {
    handleFiltragem();
  }, [search]);

  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Checkins</h1>
          <p className="text-muted">Confirme o checkin de algum convidado</p>
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
                placeholder="Buscar checkin"
              />
            </InputGroup>
          </Form>
        </Stack>
      </Stack>
      <Tabela
        columns={[
          { header: "nº", accessor: "numero" },
          { header: "Usuário", accessor: "usuario" },
          { header: "Convidado", accessor: "convidado" },
          { header: "Data e hora", accessor: "dataHora" },
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
        ]}
        rows={rowFiltrada}
        keyField="id_checkin"
      />
    </>
  );
};

export default Checkins;
