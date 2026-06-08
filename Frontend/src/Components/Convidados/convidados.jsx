import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import style from "./convidados.module.css";
import { FaSearch } from "react-icons/fa";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import Api from "../../Service/api";
import ConvidadoModal from "../Modais/Convidado/convidadoModal";
import { toast } from "react-toastify";

const Convidados = () => {
  const [search, setSearch] = useState("");
  const [convidados, setConvidados] = useState([]);
  const [convidadosFiltrados, setConvidadosFiltrados] = useState();
  const [convidadoSelecionado, setConvidadoSelecionado] = useState([]);
  const [show, setShow] = useState(false);

  const buscarConvidados = async () => {
    try {
      const res = await Api.get("/convidado");

      if (res.status === 200) {
        setConvidados(res.data.dados);
        setConvidadosFiltrados(res.data.dados);

        console.log(res.data.dados);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarConvidados();
  }, []);

  useEffect(() => {
    setConvidadosFiltrados(
      convidados.filter((c) =>
        (c.nome + " " + c.confirmacao + " " + c.cpf)
          .toLowerCase()
          .includes(search?.toLowerCase()),
      ),
    );
  }, [search]);

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

  const handleNovo = () => {
    setShow(!show);
    setConvidadoSelecionado(null);
  };

  const handleSelected = (row) => {
    setShow(!show);
    setConvidadoSelecionado(row);
  };

  const handleFechar = () => {
    setShow(false);
    setConvidadoSelecionado(null);
    buscarConvidados()
  };

  const enviarDados = async (dados) => {
    try {
      let res;

      if (convidadoSelecionado) {
        res = await Api.put(
          `/convidado?email_convidado=${convidadoSelecionado.email}`,
          dados,
        );

        if (res.status === 200) {
          toast.success(res.data.mensagem || "Sucesso ao atualizar convidado");
          handleFechar();
          return;
        }
      } else {
        res = await Api.post("/convidado", dados);

        if (res.status === 201) {
          toast.success(res.data.mensagem || "Sucesso ao registrar convidado");
          handleFechar();
          return;
        }
      }
    } catch (err) {
      const erros = err.response?.data?.erros;

      if (erros) {
        Object.values(erros).forEach((msg) => {
          toast.error(msg);
        });
      } else {
        toast.error(err.response?.data?.mensagem || "Erro ao enviar dados");
      }
    }
  };

  const deletarConvidado = async () => {
    if (!convidadoSelecionado) return;

    try {
      const res = await Api.delete("/convidado", {
        params: { email_convidado: convidadoSelecionado.email },
      });

      if (res.status === 200) {
        toast.success(res.data.mensagem || "Convidado deletado com sucesso");
        handleFechar();
        buscarConvidados();
      }
    } catch (err) {
      toast.error(err.response?.data?.mensagem || "Erro ao deletar convidado");
    }
  };

  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Lista de convidados</h1>
          <p className="text-muted">
            {convidadosFiltrados?.length} Convidado(s) no total
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
              
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar um convidado"
            />
          </InputGroup>

          <Stack className={style.stackButtons} gap={3} direction="horizontal">
            <Button onClick={() => setSearch("")}>Todos</Button>
            <Button onClick={() => setSearch("confirmado")}>Confirmados</Button>
            <Button onClick={() => setSearch("pendente")}>Pendentes</Button>
            <Button onClick={() => setSearch("cancelado")}>Cancelados</Button>
          </Stack>
        </Stack>
      </Stack>
      <Button onClick={handleNovo} className={style.botaoAdicionar}>
        Adicionar registro
      </Button>
      <Tabela
        columns={columns}
        rows={convidadosFiltrados}
        keyField={"id_convidado"}
        handleSelected={handleSelected}
      />
      <ConvidadoModal
        dados={convidadoSelecionado}
        show={show}
        handleClose={handleFechar}
        submit={enviarDados}
        onDelete={deletarConvidado}
      />
    </>
  );
};

export default Convidados;
