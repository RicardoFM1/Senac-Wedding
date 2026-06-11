import { useEffect, useState } from "react";
import Api from "../../Service/api";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [retrieve, setRetrieve] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboard, setDashboard] = useState([]);
  const navigate = useNavigate();

  const buscarRetrieve = async () => {
    try {
      const res = await Api.get("/retrieve");

      if (res.status === 200) {
        setRetrieve(res.data.dados);
        console.log(res.data.dados);
        setIsAdmin(res.data.dados.cargo_usuario === "administrador");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buscarDashboard = async () => {
    try {
      const res = await Api.get("/dashboard");

      if (res.status === 200) {
        setDashboard(res.data.dados.convidados);
        console.log(res.data.dados.convidados, "dashbord");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarRetrieve();
    if (!isAdmin) {
      navigate("/");
    }
    buscarDashboard();
  }, []);

  const handleExportar = () => {
    const doc = new jsPDF();

    doc.text("Relatório de convidados", 10, 10);
    doc.text(`Gerado em ${new Date().toLocaleDateString}`, 14, 30);

    const colunas = [
      { header: "Confirmado", dataKey: "confirmados" },
      { header: "Pendente", dataKey: "pendentes" },
      { header: "Cancelado", dataKey: "cancelados" },
      { header: "Total", dataKey: "total" }

    ];

    console.log(dashboard, "dashboard2");

    const linhas = [
      {
        confirmados: dashboard?.convidados?.confirmados || 0,
        pendentes: dashboard?.convidados?.pendentes || 0,
        cancelados: dashboard?.convidados?.cancelados || 0,
        total: dashboard?.convidados?.total || 0,
      },
    ];

    autoTable(doc, {
      columns: colunas,
      body: linhas,
      startY: 35,
      theme: "striped",
    });

    doc.save("Relatório.pdf");
  };

  const percentualConfirmado = Math.round(
    dashboard?.convidados?.confirmados / dashboard?.convidados?.total ||
      0 * 100,
  );
  const percentualCancelado = Math.round(
    dashboard?.convidados?.recusados / dashboard?.convidados?.total || 0 * 100,
  );

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Visualize e monitore o sistema</p>
      </div>
      <div>
        <Button onClick={handleExportar}>Exportar PDF</Button>{" "}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Convidados</div>
          <div className={styles.statValue}>{dashboard?.convidados?.total}</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelConfirmado}`}>
            Confirmados
          </div>
          <div className={styles.statValue}>
            {dashboard.convidados?.confirmados}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelPendente}`}>
            Pendentes
          </div>
          <div className={styles.statValue}>
            {dashboard.convidados?.pendentes}
          </div>
          <div className={styles.statSubtext}>Aguardando resposta</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelRecusado}`}>
            Cancelados
          </div>
          <div className={styles.statValue}>
            {dashboard.convidados?.cancelados}
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Progresso das confirmações</h3>
          <span className={styles.progressCounter}>
            {dashboard.convidados?.confirmados} de {dashboard.convidados?.total}
          </span>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${(dashboard.convidados?.confirmados / dashboard.convidados?.total) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
