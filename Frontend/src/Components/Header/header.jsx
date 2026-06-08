import { Button, Dropdown, Navbar, Stack } from "react-bootstrap";
import logo from "../../assets/Logo_casamento.jpg";
import style from "./header.module.css";
import { useNavigate } from "react-router";
import { IoMdMenu } from "react-icons/io";
import Api from "../../Service/api";
import { useEffect, useState } from "react";

const Header = ({ telaAtiva, setTelaAtiva }) => {
  const navigate = useNavigate();
  const handleSair = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [retrieve, setRetrieve] = useState([]);
  

  const buscarRetrieve = async () => {
    try {
      const res = await Api.get("/retrieve");

      if (res.status === 200) {
        setRetrieve(res.data.dados);
        console.log(res.data.dados);
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarRetrieve();
  }, []);
  return (
    <Navbar className="w-100 px-3 border-bottom" fixed>
      <Stack className={style.stackGeral} direction="horizontal">
        <Navbar.Brand>
          <Stack direction="horizontal" className="mx-2" gap={3}>
            <img src={logo} className={style.logo} alt="Logo casamento" />
            <h2 className="my-0">Senac Wedding</h2>
          </Stack>
        </Navbar.Brand>
        <Stack gap={3} direction="horizontal" className={style.botoesMeio}>
          
            <Button
              onClick={() => setTelaAtiva("dashboard")}
              className={telaAtiva === "dashboard" ? style.botaoAtivo : ""}
            >
              Dashboard
            </Button>
       
          <Button
            onClick={() => setTelaAtiva("convidados")}
            className={telaAtiva === "convidados" ? style.botaoAtivo : ""}
          >
            Convidados
          </Button>
          <Button
            onClick={() => setTelaAtiva("acompanhantes")}
            className={telaAtiva === "acompanhantes" ? style.botaoAtivo : ""}
          >
            Acompanhantes
          </Button>
          <Button
            onClick={() => setTelaAtiva("mesas")}
            className={telaAtiva === "mesas" ? style.botaoAtivo : ""}
          >
            Mesas
          </Button>
        </Stack>

        <Stack gap={3} direction="horizontal" className={style.botoesFim}>
          <Button
            onClick={() => setTelaAtiva("checkins")}
            className={style.botaoCheckin}
          >
            Checkin
          </Button>
          <Button onClick={handleSair} className={style.botaoSair}>
            Sair
          </Button>
        </Stack>
        <Dropdown className="px-3 py-0 d-block d-xl-none" drop="start">
        <Dropdown.Toggle className="bg-transparent text-black border" id="menu">
          <IoMdMenu size={25} />
        </Dropdown.Toggle>
        <Dropdown.Menu className={style.dropdownMenu}>
          <Dropdown.Item>
           
              <Button onClick={() => setTelaAtiva("dashboard")}>
                Dashboard
              </Button>
           
          </Dropdown.Item>
          <Dropdown.Item>
            <Button onClick={() => setTelaAtiva("convidados")}>
              Convidados
            </Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button onClick={() => setTelaAtiva("acompanhantes")}>
              Acompanhantes
            </Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button onClick={() => setTelaAtiva("mesas")}>Mesas</Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button onClick={() => setTelaAtiva("checkins")}>Checkins</Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button onClick={handleSair} className="text-danger">
              Sair
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </Stack>
      
    </Navbar>
  );
};

export default Header;
