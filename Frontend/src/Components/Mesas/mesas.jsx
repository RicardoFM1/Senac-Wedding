import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import MesaModal from "../Modais/Mesa/mesaModal";
import style from "./mesas.module.css"

const Mesas = () => {
  const [search, setSearch] = useState("");
  const [mesaSelecionada, setMesaSelecionada] = useState([]);
  const [show, setShow] = useState(false)

  const mesas = [
    { id: 1, numero: 1, capacidade: 4, restricao: "Sem restrição" },
    { id: 2, numero: 2, capacidade: 6, restricao: "Vegetariano" },
    { id: 3, numero: 3, capacidade: 8, restricao: "Alergia a amendoim" },
   
  ];
  const [rowFiltrada, setRowFiltrada] = useState(mesas);
  useEffect(() => {
    const termo = search?.toLowerCase() || "";
    setRowFiltrada(
      mesas.filter((item) =>
        `${item.numero} ${item.capacidade} ${item.restricao}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  }, [search]);

  const columns = [
    { header: "nº", accessor: "numero" },
    { header: "Capacidade", accessor: "capacidade" },
    { header: "Restrição", accessor: "restricao" },
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

  const handleSelected = (row) => {
    console.log(row)
    setShow(true)
    console.log(show)
    setMesaSelecionada(row)
  };

  const handleNovo = () => {
    setShow(true)
    setMesaSelecionada(null)
  }

  return (
    <>
      <Stack className="d-flex flex-column flex-xl-row">
        <Stack className="fw-bold mx-5 my-5">
          <h1>Lista de mesas</h1>
          <p className="text-muted">{mesas.length} mesas no total</p>
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
                placeholder="Buscar mesa"
              />
            </InputGroup>
          </Form>
        </Stack>
      </Stack>
      <Button className={style.botaoRegistro} onClick={handleNovo}>Adicionar registro</Button>
      <Tabela columns={columns} rows={rowFiltrada} keyField="id_mesa" handleSelected={handleSelected}/>
      <MesaModal show={show} dados={mesaSelecionada} handleClose={() => setShow(!show)}/>
    </>
  );
};

export default Mesas;
