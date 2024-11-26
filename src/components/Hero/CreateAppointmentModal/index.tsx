import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { DateSelectField } from "client@components/DateSelectField";
import { axios } from "client@config/axios";
import { useApp } from "client@contexts/AppContext";
import { useAuth } from "client@contexts/AuthContext";
import { User } from "client@types/User";

type CreateAppointmentModalProps = {
  handleClose: () => void;
  show: boolean;
};

export const CreateAppointmentModal = ({
  handleClose,
  ...props
}: CreateAppointmentModalProps) => {
  const [show, setShow] = useState(props.show);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [userData, setUserData] = useState<User>();

  const { user } = useAuth();
  const { resolvePromise } = useApp();

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    await resolvePromise(async () => {
      if (!user) {
        const response = await axios.post(`/client/register`, formData);

        if (typeof response.data === "object" && response.data.appointment) {
          alert("Agendamento criado com sucesso");

          console.log(">> response.data", response.data);

          if (response.data.user) {
            setUserData(response.data.user);
            setShowSetPassword(true);
          } else {
            window.location.reload();
          }
        } else {
          console.log(">>> response.data", response.data);
          alert("Algo correu mal ao criar agendamento\nTente novamente");
        }

        return;
      }

      try {
        const response = await axios.post("/appointments", formData);

        if (typeof response.data === "object" && response.data.id) {
          alert("Agendamento criado com sucesso");

          window.location.reload();
        } else {
          console.log("");
        }
      } catch (err) {
        return err;
      }
    });
  };

  const setPasswordFormSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    if (userData) {
      for (const key in userData) {
        const value = userData[key as keyof Omit<User, "appointments">];
        formData.append(`user[${key}]`, value);
      }
    }

    const response = await axios.post(`/client/define-password`, formData);

    if (typeof response.data === "object" && response.data.token) {
      localStorage.setItem("user-auth-token", response.data.token);

      alert("Conta criada com sucesso");

      window.location.reload();
    }
  };

  return (
    <Fragment>
      <Modal
        className="py-5"
        show={show && !showSetPassword}
        onHide={handleClose}
      >
        <form
          method="post"
          action="/"
          onSubmit={(event) => formSubmitHandler(event)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Marcar consulta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <div className="w-full flex flex-col gap-3">
                {!user && (
                  <Fragment>
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="user[name]"
                          placeholder="nome próprio"
                          autoFocus
                        />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Sobrenome</Form.Label>
                        <Form.Control
                          name="user[surname]"
                          type="text"
                          placeholder="sobrenome"
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          name="user[email]"
                          type="email"
                          placeholder="exemplo@gmail.com"
                        />
                      </Col>
                      <Col>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          name="user[phone]"
                          type="text"
                          placeholder="Your phone number"
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )}

                {/* <Row>
                  <Col sm={6}>
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                      name="appointment[date]"
                      type="date"
                      placeholder="exemplo@gmail.com"
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      name="appointment[time]"
                      type="time"
                      placeholder="exemplo@gmail.com"
                    />
                  </Col>
                </Row> */}

                <DateSelectField />
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

      <Modal className="py-5" show={showSetPassword} onHide={handleClose}>
        <form
          method="post"
          action="/"
          onSubmit={(event) => setPasswordFormSubmitHandler(event)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Definir palavra passe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col sm={6}>
                  <Form.Label>Palavra passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="user[password]"
                    placeholder="Palavra passe"
                    autoFocus
                  />
                </Col>
                <Col sm={6}>
                  <Form.Label>Repetir palavra passe</Form.Label>
                  <Form.Control
                    name="user[password-confirmation]"
                    type="password"
                    placeholder="Repetir palavra passe"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
};
