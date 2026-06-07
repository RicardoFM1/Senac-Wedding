import { useEffect, useState } from "react";
import Api from "../../Service/api";
import styles from "./dashboard.module.css";
import { useNavigate } from "react-router";

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
        setDashboard(res.data.dados?.convidados);
        console.log(res.data.dados)
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    buscarRetrieve();
    buscarDashboard();
    if (!isAdmin) {
      navigate("/");
    }
  }, []);

  const percentualConfirmado = Math.round(
    (dashboard?.confirmados / dashboard?.total) || 0 * 100 
  );
  const percentualCancelado = Math.round(
    (dashboard?.recusados / dashboard?.total) || 0 * 100,
  );

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Visualize e monitore o sistema</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Convidados</div>
          <div className={styles.statValue}>{dashboard?.total}</div>
          
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelConfirmado}`}>
            Confirmados
          </div>
          <div className={styles.statValue}>{dashboard.confirmados}</div>
          <div className={styles.statSubtext}>
            {percentualConfirmado}% do total
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelPendente}`}>
            Pendentes
          </div>
          <div className={styles.statValue}>{dashboard.pendentes}</div>
          <div className={styles.statSubtext}>aguardando resposta</div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelRecusado}`}>
            Cancelados
          </div>
          <div className={styles.statValue}>{dashboard.cancelados}</div>
          <div className={styles.statSubtext}>
            {percentualCancelado}% do total
          </div>
        </div>
      </div>

      
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Progresso das confirmações</h3>
          <span className={styles.progressCounter}>
            {dashboard.confirmados} de {dashboard.total}
          </span>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${(dashboard.confirmados / dashboard.total) * 100}%`,
            }}
          />
        </div>

        
        
      </div>
    </div>
  );
};

export default Dashboard;
