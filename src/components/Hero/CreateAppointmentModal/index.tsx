import { validAngolanPhoneNumber } from "@verdantkit/utils";
import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { z } from "zod";

import { DateSelectField } from "client@components/DateSelectField";
import { FormErrorMessage } from "client@components/FormErrorMessage";
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
  const [formError, setFormError] = useState<
    z.ZodIssue | { message: string }
  >();

  const { user } = useAuth();
  const { resolvePromise } = useApp();

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const throwErrorIfFieldIsInvalid = (
    dataSchema: z.ZodString | z.ZodEffects<any>,
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const validatedData = dataSchema.safeParse(event.target.value);

    if (validatedData.error) {
      return setFormError(validatedData.error.errors[0]);
    }

    setFormError(undefined);
  };

  const usernameFieldBlurHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) =>
    throwErrorIfFieldIsInvalid(
      z.string().min(3, "Nome ou sobrenome não pode ser tão curto"),
      event
    );

  const messageFieldBlurHandler = (event: React.FocusEvent<HTMLInputElement>) =>
    throwErrorIfFieldIsInvalid(
      z
        .string()
        .min(
          10,
          "Talvez a descrição do seu caso não devesse ser tão curta; por favor, explane um pouco mais sobre."
        ),
      event
    );

  const emailFieldBlurHandler = (event: React.FocusEvent<HTMLInputElement>) =>
    throwErrorIfFieldIsInvalid(
      z.string().email("O email fornecido não é válido"),
      event
    );

  const phoneFieldBlurHandler = (event: React.FocusEvent<HTMLInputElement>) =>
    throwErrorIfFieldIsInvalid(
      z
        .string()
        .transform((phone) => phone.replace(/[^0-9+]+/g, ""))
        .refine(
          (phone) => validAngolanPhoneNumber(phone),
          "Número de telefone não válido"
        ),
      event
    );

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    await resolvePromise(async () => {
      if (!user) {
        const response = await axios.post(`/client/register`, formData);

        if (typeof response.data === "object" && response.data.appointment) {
          alert("Agendamento criado com sucesso");

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
              {formError && <FormErrorMessage message={formError.message} />}
              <div className="w-full flex flex-col gap-3">
                {!user && (
                  <Fragment>
                    <Row>
                      <Col sm={6}>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          autoCorrect="off"
                          type="text"
                          name="user[name]"
                          placeholder="nome próprio"
                          autoFocus
                          onBlur={usernameFieldBlurHandler}
                        />
                      </Col>
                      <Col sm={6}>
                        <Form.Label>Sobrenome</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          autoCorrect="off"
                          name="user[surname]"
                          type="text"
                          placeholder="sobrenome"
                          onBlur={usernameFieldBlurHandler}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          autoCorrect="off"
                          name="user[email]"
                          type="email"
                          placeholder="exemplo@gmail.com"
                          onBlur={emailFieldBlurHandler}
                        />
                      </Col>
                      <Col>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck={false}
                          autoCorrect="off"
                          name="user[phone]"
                          type="text"
                          placeholder="Your phone number"
                          onBlur={phoneFieldBlurHandler}
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )}

                {/* <Row>
                  <Col sm={6}>
                    <Form.Label>Data</Form.Label>
                    <Form.Control
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoCorrect="off"
                      name="appointment[date]"
                      type="date"
                      placeholder="exemplo@gmail.com"
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoCorrect="off"
                      name="appointment[time]"
                      type="time"
                      placeholder="exemplo@gmail.com"
                    />
                  </Col>
                </Row> */}

                <DateSelectField fieldKeyTemplate="appointment[$0]" />
              </div>
            </Form.Group>
            <Form.Group
              className="my-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Descrição do seu caso</Form.Label>
              <Form.Control
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                autoCorrect="off"
                name="appointment[description]"
                as="textarea"
                onBlur={messageFieldBlurHandler}
                rows={3}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!!formError}
              className="disabled:cursor-not-allowed"
            >
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
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoCorrect="off"
                    type="password"
                    name="user[password]"
                    placeholder="Palavra passe"
                    autoFocus
                  />
                </Col>
                <Col sm={6}>
                  <Form.Label>Repetir palavra passe</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoCorrect="off"
                    name="user[password-confirmation]"
                    type="password"
                    placeholder="Repetir palavra passe"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              disabled={!!formError}
              className="disabled:opacity-25 disabled:pointer-events-none"
            >
              Salvar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Fragment>
  );
};
