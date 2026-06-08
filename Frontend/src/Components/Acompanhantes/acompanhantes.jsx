import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import style from "./acompanhantes.module.css";
import Tabela from "../Tabela/tabela";
import Api from "../../Service/api";
import AcompanhanteModal from "../Modais/Acompanhante/acompanhanteModal";

const Acompanhantes = () => {
  const [search, setSearch] = useState("");
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [acompanhantesFiltrados, setAcompanhantesFiltrados] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [show, setShow] = useState(false);
  const [acompanhanteSelecionado, setAcompanhanteSelecionado] = useState(null);

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

  const buscarAcompanhantes = async () => {
    try {
      const res = await Api.get("/acompanhante");
      if (res.status === 200) {
        setAcompanhantes(res.data.dados);
        console.log(res.data.dados)
        setAcompanhantesFiltrados(res.data.dados);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarConvidados();
    buscarAcompanhantes();
  }, []);

  useEffect(() => {
    const termo = search?.toLowerCase() || "";
    
  
    setAcompanhantesFiltrados(
      acompanhantes?.filter((item) =>
        `${item.nome} ${item.sobrenome} ${item.idade}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  }, [search]);

  const handleNovo = () => {
    setShow(true);
    setAcompanhanteSelecionado(null);
  };

  const handleSelected = (row) => {
    setAcompanhanteSelecionado(row);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setAcompanhanteSelecionado(null);
  };

  const enviarDados = async (dados) => {
    try {
      let res;
      if (acompanhanteSelecionado) {
        res = await Api.put(
          `/acompanhante?email_acompanhante=${acompanhanteSelecionado.email}`,
          dados,
        );
      } else {
        res = await Api.post("/acompanhante", dados);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.mensagem || "Acompanhante salvo com sucesso");
        handleClose();
        buscarAcompanhantes();
      }
    } catch (err) {
      const erros = err.response?.data?.erros;
      if (erros) {
        Object.values(erros).forEach((msg) => toast.error(msg));
      } else {
        toast.error(
          err.response?.data?.mensagem || "Erro ao salvar acompanhante",
        );
      }
    }
  };

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Sobrenome", accessor: "sobrenome" },
    { header: "CPF", accessor: "cpf" },
    { header: "Email", accessor: "email" },
    { header: "Idade", accessor: "idade" },
    {
      header: "Convidado",
      accessor: "convidado",
      render: (row) => (row.convidado ? `${row.convidado.nome} - ${row.convidado.cpf}` : "")
    },
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
          <h1>Lista de acompanhantes</h1>
          <p className="text-muted">
            {acompanhantesFiltrados?.length} acompanhante(s) no total
          </p>
          <p className="text-muted">
            Clique na linha da tabela para editar ou ver detalhes
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
      <Button onClick={handleNovo} className={style.botaoAdicionar}>
        Adicionar registro
      </Button>

      <Tabela
        columns={columns}
        rows={acompanhantesFiltrados}
        keyField="id_acompanhante"
        handleSelected={handleSelected}
      />
      <AcompanhanteModal
        show={show}
        dados={acompanhanteSelecionado}
        handleClose={handleClose}
        submit={enviarDados}
        convidados={convidados}
      />
    </>
  );
};

export default Acompanhantes;
