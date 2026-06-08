import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import Tabela from "../Tabela/tabela";
import style from "./checkins.module.css";
import Api from "../../Service/api";
import CheckinModal from "../Modais/Checkin/checkinModal";

const Checkins = () => {
  const [search, setSearch] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [checkinsFiltrados, setCheckinsFiltrados] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [show, setShow] = useState(false);

  const buscarCheckins = async () => {
    try {
      const res = await Api.get("/checkin");
      if (res.status === 200) {
        setCheckins(res.data.dados || []);
        setCheckinsFiltrados(res.data.dados);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buscarConvidados = async () => {
    try {
      const res = await Api.get("/convidado");
      if (res.status === 200) {
        setConvidados(res.data.dados || []);
      }
    } catch (err) {
      console.log(err);
    }
  };


  

  useEffect(() => {
    buscarCheckins();
    buscarConvidados();
  }, []);

  const handleFiltragem = () => {
    const termo = search?.toLowerCase() || "";
    setCheckinsFiltrados(
      checkins?.filter((item) =>
        `${item.numero}`
          .toLowerCase()
          .includes(termo)
      ),
    );
  };

  useEffect(() => {
    handleFiltragem();
  }, [search]);

  const handleNovo = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const enviarDados = async (dados) => {
    try {
      const res = await Api.post("/checkin", dados);
      if (res.status === 201) {
        toast.success(res.data.mensagem || "Checkin criado com sucesso");
        handleClose();
        buscarCheckins();
      }
    } catch (err) {
      toast.error(err.response?.data?.mensagem || "Erro ao criar checkin");
    }
  };

  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Checkins</h1>
          <p className="text-muted">Confirme o checkin de algum convidado</p>
          <p className="text-muted">{checkinsFiltrados?.length} checkin(s) no total</p>
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
          <Button onClick={handleNovo} className={style.botaoAdicionar}>Adicionar registro</Button>

      <Tabela
        columns={[
          { header: "nº", accessor: "id_checkin" },
          {
            header: "Usuário",
            accessor: "usuario",
            render: (row) => (row.usuario ? `${row.usuario.nome} - ${row.usuario.cpf}` : "")
          },
          {
            header: "Convidado",
            accessor: "convidado",
            render: (row) => (row.convidado ? `${row.convidado.nome} - ${row.convidado.cpf}` : "")
          },
          { header: "Data e hora", accessor: "data_e_hora" },
          
        ]}
        rows={checkinsFiltrados}
        keyField="id_checkin"
        handleSelected={() => {}}
      />
      <CheckinModal
        show={show}
        handleClose={handleClose}
        submit={enviarDados}
        convidados={convidados}
        acompanhantes={acompanhantes}
      />
    </>
  );
};

export default Checkins;
