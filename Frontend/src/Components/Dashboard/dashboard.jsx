import styles from "./dashboard.module.css";

const Dashboard = () => {
  
  const stats = {
    totalConvidados: 12,
    acompanhantes: 10,
    confirmados: 7,
    pendentes: 3,
    recusados: 2,
  };

  const percentualConfirmado = Math.round((stats.confirmados / stats.totalConvidados) * 100);
  const percentualRecusado = Math.round((stats.recusados / stats.totalConvidados) * 100);

  return (
    <div className={styles.dashboardContainer}>
    
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Visualize e monitore o sistema</p>
      </div>

     
      <div className={styles.statsGrid}>
       
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Convidados</div>
          <div className={styles.statValue}>{stats.totalConvidados}</div>
          <div className={styles.statSubtext}>{stats.acompanhantes} com acompanhantes</div>
        </div>

      
        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelConfirmado}`}>Confirmados</div>
          <div className={styles.statValue}>{stats.confirmados}</div>
          <div className={styles.statSubtext}>{percentualConfirmado}% do total</div>
        </div>

       
        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelPendente}`}>Pendentes</div>
          <div className={styles.statValue}>{stats.pendentes}</div>
          <div className={styles.statSubtext}>aguardando resposta</div>
        </div>

        
        <div className={styles.statCard}>
          <div className={`${styles.statLabel} ${styles.labelRecusado}`}>Recusados</div>
          <div className={styles.statValue}>{stats.recusados}</div>
          <div className={styles.statSubtext}>{percentualRecusado}% do total</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>Progresso das confirmações</h3>
          <span className={styles.progressCounter}>
            {stats.confirmados} de {stats.totalConvidados}
          </span>
        </div>

      
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${(stats.confirmados / stats.totalConvidados) * 100}%`,
            }}
          />
        </div>

       
        <div className={styles.progressLegend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotConfirmado}`} />
            <span>Confirmados ({stats.confirmados})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotPendente}`} />
            <span>Pendentes ({stats.pendentes})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotRecusado}`} />
            <span>Recusados ({stats.recusados})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;