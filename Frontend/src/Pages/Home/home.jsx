import { useEffect } from "react";
import Acompanhantes from "../../Components/Acompanhantes/acompanhantes";
import Checkins from "../../Components/Checkins/checkins";
import Convidados from "../../Components/Convidados/convidados";
import Dashboard from "../../Components/Dashboard/dashboard";
import Header from "../../Components/Header/header";
import Mesas from "../../Components/Mesas/mesas";
import { useNavigate } from "react-router";

const Home = ({ telaAtiva, setTelaAtiva }) => {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <Header telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
      <main>
        {telaAtiva === "convidados" ? <Convidados /> : ""}
        {telaAtiva === "acompanhantes" ? <Acompanhantes /> : ""}
        {telaAtiva === "mesas" ? <Mesas /> : ""}
        {telaAtiva === "dashboard" ? <Dashboard /> : ""}
        {telaAtiva === "checkins" ? <Checkins /> : ""}
      </main>
    </>
  );
};

export default Home;
