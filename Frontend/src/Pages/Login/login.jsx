import { Button, Container, Form, InputGroup, Stack } from "react-bootstrap";
import imagem from "../../assets/Foto_casamento.jpg";
import logo from "../../assets/Logo_casamento.jpg";
import style from "./login.module.css";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { useEffect, useState } from "react";
import Api from "../../Service/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Login = () => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [formData, setFormData] = useState({ email: "", senha: "" });
const navigate = useNavigate();
  const handleChange = (e) => {
    const {name, value} = e.target  

    if(!name) return

    setFormData((prev) => ({...prev, [name]: value}))
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{

        const res = await Api.post('/usuario/login', formData)

        if(res.status === 200){
            toast.success('Login realizado com sucesso')
            localStorage.clear();
            localStorage.setItem('token', res.data.token)
            navigate('/')
        }
    }catch(err){
        const erros = err.response?.data?.erros;

        if(erros){
            Object.values(erros).forEach((msg) => {
                toast.error(msg)
            })
        }else{
            toast.error(err.response?.data?.mensagem || 'Erro ao enviar dados')
        }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')

    if(token){
      navigate('/')
    }
  }, [])

  return (
    <div className={style.loginContainer}>
      <div className={style.divFoto}>
        <img className={style.imagem} src={imagem} alt="Imagem casamento" />
      </div>
      <Stack gap={3} className={style.divForm}>
        <img src={logo} className={style.logo} alt="Logo casamento" />
        <h1>Senac Wedding</h1>
        <h5>Seu portal de casamentos</h5>
        <hr className="w-75" />
        <Form onSubmit={handleSubmit} className="w-75">
          <Stack gap={4}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <MdEmail />
                </InputGroup.Text>
                <Form.Control 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu melhor email"
                required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Senha</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <RiLockPasswordFill />
                </InputGroup.Text>
                <Form.Control 
                type={mostrarSenha ? 'text' : 'password'}
                value={formData.senha}
                name="senha"
                onChange={handleChange}
                placeholder="Sua senha"
                required
                />
                <Button
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="bg-transparent border "
                >
                  {mostrarSenha ? (
                    <FaEye color="gray" />
                  ) : (
                    <FaEyeSlash color="gray" />
                  )}
                </Button>
              </InputGroup>
            </Form.Group>
          </Stack>
          <hr className="mt-5" />
          <Stack>
            <Button className={style.btnSubmit} type="submit">
              Login
            </Button>
          </Stack>
        </Form>
      </Stack>
    </div>
  );
};

export default Login;
