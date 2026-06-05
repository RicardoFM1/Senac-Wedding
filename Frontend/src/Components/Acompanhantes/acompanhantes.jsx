import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import style from "./acompanhantes.module.css"

const Acompanhantes = () => {
return (
    <>
    <Stack direction="horizontal"> 

    <Stack className="fw-bold mx-5 my-5">

    <h1>Lista de acompanhantes</h1>
    <p className="text-muted">15 Acompanhantes no total</p>
    </Stack>
    <Stack className="px-5" direction="horizontal" gap={3}>
          <Form>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch color="gray"/>
              </InputGroup.Text>
              <Form.Control placeholder="Buscar um acompanhante" />
            </InputGroup>
          </Form>
         
        </Stack>
    </Stack>
    </>
)
}

export default Acompanhantes;