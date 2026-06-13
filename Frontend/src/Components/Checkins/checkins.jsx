import { useEffect, useState } from "react";
import { Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Tabela from "../Tabela/tabela";
import style from "./checkins.module.css";
import Api from "../../Service/api";
import CheckinModal from "../Modais/Checkin/checkinModal";

const Checkins = () => {
  const [search, setSearch] = useState("");
  const [checkins, setCheckins] = useState([]);
  const [checkinsFiltrados, setCheckinsFiltrados] = useState([]);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
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

  useEffect(() => {
    buscarCheckins();
  }, []);

  const handleFiltragem = () => {
    const termo = search?.toLowerCase() || "";
    setCheckinsFiltrados(
      checkins?.filter((item) => (item.id_checkin + " " + item.convidado.nome + " " + item.usuario.nome)
          .toLowerCase()
          .includes(termo)
      ),
    );
  };

  useEffect(() => {
    handleFiltragem();
  }, [search]);

  const handleSelected = (checkin) => {
    setSelectedCheckin(checkin);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCheckin(null);
    buscarCheckins();
  };

  const handleConfirmarCheckin = async() => {
    try{
      if (!selectedCheckin) return;
      console.log(selectedCheckin)
      
      const res = await Api.post('/checkin', {convidado_idconvidado: selectedCheckin.id_convidado})
      if(res.status === 201){
        toast.success("Checkin confirmado");
        handleClose();
      }

    }catch(err){
      toast.error(err.response?.data?.mensagem)
    }
  };

  const handleCancelarCheckin = async () => {
    try{
      const res = await Api.put(`/checkin?email_convidado=${selectedCheckin?.convidado?.email}&id_checkin=${selectedCheckin?.id_checkin}`)
      if(res.status === 200){
        toast.success('Checkin cancelado com sucesso')
        handleClose()
      }
    }catch(err){
      toast.error(err.response?.data?.mensagem)
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

      <Tabela
        columns={[
          {
            header: "Usuário",
            accessor: "usuario",
            render: (row) => (row.usuario ? `${row.usuario.nome || ''} - ${row.usuario.cpf || ''}` : "-")
          },
          {
            header: "Convidado",
            accessor: "convidado",
            render: (row) => (row.convidado ? `${row.convidado.nome} ${row.convidado.sobrenome}  - ${row.convidado.cpf}` : "")
          },
          { header: "Data e hora", accessor: "data_e_hora", render: (row) => (row.data_e_hora ? `${row.data_e_hora} ` : "-") },
          { header: "Status", accessor: "status", render: (row) => (row.status ? `${row.status} ` : "-") },
          { header: "Confirmação", accessor: "convidado.confirmacao", render: (row) => {
            if (row.convidado.confirmacao === "confirmado") {
              return <span className={style.spanConfirmacao}>Confirmado</span>;
            }

            if (row.convidado.confirmacao === "pendente") {
              return <span className={style.spanPendente}>Pendente</span>;
            }

            if (row.convidado.confirmacao === "cancelado") {
              return <span className={style.spanCancelado}>Cancelado</span>;
            }

            return "-";
          } },
        ]}
        rows={checkinsFiltrados}
        keyField="id_convidado"
        handleSelected={handleSelected}
      />
      <CheckinModal
        show={show}
        handleClose={handleClose}
        checkin={selectedCheckin}
        onConfirm={handleConfirmarCheckin}
        onCancel={handleCancelarCheckin}
      />
    </>
  );
};

export default Checkins;
