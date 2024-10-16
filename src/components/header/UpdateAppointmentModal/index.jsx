import { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { axios } from "@config/axios";
import { useApp } from "@contexts/AppContext";
import { formDataToJson } from "@verdantkit/utils";

export const UpdateAppointmentModal = ({ handleClose, ...props }) => {
  const [show, setShow] = useState(props.show);

  const { resolvePromise } = useApp();

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    await resolvePromise(async () => {
      try {
        const data = await formDataToJson(formData);

        const response = await axios.patch(
          `/appointments/${props.appointment.id}`,
          data
        );

        console.log(">>> typeof response.data", response.data);

        if (typeof response.data === "object" && response.data.id) {
          alert("Agendamento atualizado com sucesso");

          window.location.reload();
        } else {
          console.log("");
        }
      } catch (err) {
        return err;
      }
    });
  };

  return (
    <Fragment>
      <Modal className="py-5" show={show} onHide={handleClose}>
        <form
          method="post"
          action="/"
          onSubmit={(event) => formSubmitHandler(event)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Remarcar consulta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <div className="w-full flex flex-col gap-3">
                <Row>
                  <Col sm={6}>
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      name="appointment[date]"
                      type="date"
                      placeholder="exemplo@gmail.com"
                      defaultValue={props.appointment.date}
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      name="appointment[time]"
                      type="time"
                      placeholder="exemplo@gmail.com"
                      defaultValue={props.appointment.time}
                    />
                  </Col>
                </Row>
              </div>
            </Form.Group>
            <Form.Group
              className="my-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Assunto</Form.Label>
              <Form.Control
                name="appointment[description]"
                as="textarea"
                rows={3}
                defaultValue={props.appointment.description}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
};
