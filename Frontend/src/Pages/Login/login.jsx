import { useState } from "react";
import fotoCasamento from "../../assets/Foto_casamento.jpg";
import logoCasamento from "../../assets/Logo_casamento.jpg";

import style from "./login.module.css";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";


const Login = () => {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
  return (
    <div className={style.loginContainer}>
      <div className={style.fotoDiv}>
        <img
          className={style.foto}
          src={fotoCasamento}
          alt="Foto de casamento"
        ></img>
      </div>
      <Stack gap={2} className={style.formDiv}>
        <img
        className={style.Logo}
        src={logoCasamento}
        alt="Logo de casamento"
        >
        
        </img>
        <h1>Senac Wedding</h1>
        <h5>Seu portal de casamentos</h5>
        <hr className=" w-75" />
        <div className="w-75">
          <Form className="d-flex flex-column gap-4">
            <Form.Group>
              <Form.Label>EMAIL</Form.Label>
              <Form.Control
              type="email"
                className={style.input}
                placeholder="ricardo@gmail.com"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>SENHA</Form.Label>
              <InputGroup>
                <Form.Control
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="********"
                  className={style.inputSenha}
                />
                <Button onClick={() => setMostrarSenha(!mostrarSenha)} className={style.btnShowSenha}>
                  {mostrarSenha ? <FaEye color="gray" size={25}/> : <FaEyeSlash color="gray" size={25}/>}
                </Button>
              </InputGroup>
            </Form.Group>
            <p className="text-muted">Esqueceu a senha?</p>
            <Button onClick={() => navigate('/')} className={style.btnSubmit} type="button">LOGIN</Button>
          </Form>
        </div>
      </Stack>
    </div>
  );
};

export default Login;
