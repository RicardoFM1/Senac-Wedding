import { Container, Table } from "react-bootstrap";
import style from "./tabela.module.css";
const Tabela = ({ columns, rows, keyField, handleSelected }) => {
  const temDados = rows && rows.length > 0
  return (
    <Container fluid className="mt-4">
      <Table className={style.tabela} responsive hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th className={style.tabelaHeader} key={column.accessor}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {temDados ? (

            rows?.map((row) => (
              <tr
              className={style.linha}
              onClick={() => handleSelected(row)}
              key={row[keyField]}
              >
              {columns?.map((column) => (
                <td className="px-3" key={column.accessor}>
                  {column.render ? (
                    column.render(row)
                  ) : row[column.accessor] === "confirmado" ? (
                    <span className={style.spanConfirmacao}>
                      {row[column.accessor]}
                    </span>
                  ) : row[column.accessor] === "pendente" ? (
                    <span className={style.spanPendente}>
                      {row[column.accessor]}
                    </span>
                  ) : row[column.accessor] === "cancelado" ? ( <span className={style.spanCancelado}>
                      {row[column.accessor]}
                    </span>) : (
                      row[column.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))
          
        ) : (
          <td colSpan={columns.length} className="text-center text-muted py-3">Sem dados</td>
        )}
          </tbody>
      </Table>
    </Container>
  );
};

export default Tabela;
