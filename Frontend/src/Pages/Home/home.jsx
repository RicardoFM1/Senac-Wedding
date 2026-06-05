import Acompanhantes from "../../Components/Acompanhantes/acompanhantes";
import Checkins from "../../Components/Checkins/checkins";
import Convidados from "../../Components/Convidados/convidados";
import Dashboard from "../../Components/Dashboard/dashboard";
import Header from "../../Components/Header/header";
import Mesas from "../../Components/Mesas/mesas";

const Home = ({ telaAtiva, setTelaAtiva }) => {
 
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
