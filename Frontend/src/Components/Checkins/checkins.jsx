import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Tabela from "../Tabela/tabela";
import Api from "../../Service/api";

const Checkins = () => {
  const [search, setSearch] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [checkinsFiltrados, setCheckinsFiltrados] = useState();

  const buscarCheckins = async () => {
    try {
      const res = await Api.get("/checkin");

      if (res.status === 200) {
        setCheckins(res.data.dados);
        setCheckinsFiltrados(res.data.dados)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFiltragem = () => {
    const termo = search?.toLowerCase() || "";
    setCheckinsFiltrados(
      checkins.filter((item) =>
        `${item.numero} ${item.usuario} ${item.convidado} ${item.dataHora}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  };

  useEffect(() => {
    buscarCheckins();
  }, []);

  useEffect(() => {
    handleFiltragem();
  }, [search]);

  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Checkins</h1>
          <p className="text-muted">Confirme o checkin de algum convidado</p>
          <p className="text-muted">
            {checkinsFiltrados?.length} checkin(s) no total
          </p>
          <p className="text-muted">Clique na linha da tabela para acessar mais informações</p>

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
              placeholder="Buscar checkin"
            />
          </InputGroup>
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
        rows={checkinsFiltrados}
        keyField="id_checkin"
      />
    </>
  );
};

export default Checkins;
