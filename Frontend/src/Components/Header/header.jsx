import { Button, Container, Dropdown, Navbar, Stack } from "react-bootstrap";
import logoCasamento from "../../assets/Logo_casamento.jpg";
import style from "./header.module.css";
import { IoIosMenu } from "react-icons/io";


const Header = () => {
  return (
    <Navbar fixed className="w-100 px-3 border-bottom ">
        <Stack direction="horizontal" className={style.stackHeader}>
      <Navbar.Brand>
          <Stack gap={3} direction="horizontal">
            <img
              src={logoCasamento}
              alt="Logo casamento"
              className={style.Logo}
            />
            <h2 className="my-0">Senac Wedding</h2>
          </Stack>
      </Navbar.Brand>
      <Stack gap={4} direction="horizontal" className={style.botoesMeio}>

          <Button>Dashboard</Button>
          <Button>Convidados</Button>
          <Button>Acompanhantes</Button>
          <Button>Mesas</Button>
      </Stack>

    <Stack gap={4}  direction="horizontal" className={style.botoesFim}>
        <Button className={style.botaoCheckin}>CHECK-IN</Button>
        <Button className={style.botaoSair}>Sair</Button>
        

    </Stack>
        </Stack>
        <Dropdown drop="start" className="px-3 py-0 d-block d-xl-none">
            <Dropdown.Toggle className="bg-transparent text-black border" id="menu">
                <IoIosMenu size={25}/>
            </Dropdown.Toggle>
            <Dropdown.Menu className={style.dropdown}>
                <Dropdown.Item onClick={() => console.log('checkin')}>Dashboard</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('convidados')}>Convidados</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Acompanhantes')}>Acompanhantes</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Mesas')}>Mesas</Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Checkins')}>Checkins</Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={() => console.log('SAIR')}>SAIR</Dropdown.Item>


            </Dropdown.Menu>
        </Dropdown>
    </Navbar>
  );
};

export default Header;
