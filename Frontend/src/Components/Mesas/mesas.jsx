import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Tabela from "../Tabela/tabela";
import { IoIosArrowForward } from "react-icons/io";
import MesaModal from "../Modais/Mesa/mesaModal";
import style from "./mesas.module.css"
import Api from "../../Service/api";

const Mesas = () => {
  const [search, setSearch] = useState("");
  const [mesaSelecionada, setMesaSelecionada] = useState([]);
  const [show, setShow] = useState(false)
  const [mesas, setMesas] = useState([])
  const [mesaFiltrada, setMesaFiltrada] = useState();

  const buscarMesas = async() => {
  try{
  const res = await Api.get("/mesa")

  if(res.status === 200){
    setMesas(res.data.dados)
    setMesaFiltrada(res.data.dados)
  }
}catch(err){
  console.log(err)
}  
}

useEffect(() => {
  buscarMesas()
}, []) 
  console.log(mesas)


  useEffect(() => {
    const termo = search?.toLowerCase() || "";
    setMesaFiltrada(
      mesas.filter((item) =>
        `${item.numero} ${item.capacidade} ${item.restricao}`
          .toLowerCase()
          .includes(termo),
      ),
    );
  }, [search]);

  const columns = [
    { header: "nº", accessor: "id_mesa" },
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
          <p className="text-muted">{mesaFiltrada?.length} Mesa(s) no total</p>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar mesa"
              />
            </InputGroup>
          
        </Stack>
      </Stack>
      <Button className={style.botaoRegistro} onClick={handleNovo}>Adicionar registro</Button>
      <Tabela columns={columns} rows={mesaFiltrada} keyField="id_mesa" handleSelected={handleSelected}/>
      <MesaModal show={show} dados={mesaSelecionada} handleClose={() => setShow(!show)}/>
    </>
  );
};

export default Mesas;
