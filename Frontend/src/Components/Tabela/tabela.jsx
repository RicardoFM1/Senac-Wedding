import { Container, Table } from "react-bootstrap";
import style from "./tabela.module.css";
const Tabela = ({ columns, rows, keyField }) => {
  return (
    <Container fluid className="mt-4">
      <Table className={style.tabela} responsive  hover>
        <thead>
          <tr>
            {columns.map((column) => (

                <th className={style.tabelaHeader} key={column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody >
            {rows.map((row) => (
                <tr onClick={() => console.log('Apertou na linha')} key={row[keyField]}>
                    {columns.map((column) => (
                        <td className="px-3" key={column.accessor}>{column.render ? column.render(row) : row[column.accessor]}</td>
                    ))}
                </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Tabela;
