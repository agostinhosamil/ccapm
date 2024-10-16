import React from "react";
import { FloatingLabel } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./contact.css";

const Contact = () => {
  return (
    <section id="contact" className="block contact-block mt-5">
      <Container fluid>
        <div className="title-holder">
          <h1>Entre em contacto connosco</h1>
        </div>
        <Row>
          <Col sm={6}>
            <h2 className="">
              Tem algum projecto que precisa sair do papel? Podemos ajudar,
              basta nos enviar uma mensagem.
            </h2>
            <p>Também estamos abertos a propostas de parceria</p>
            <Form className="contact-form">
              <Row>
                <Col sm={12}>
                  <Form.Control type="text" placeholder="Seu nome" required />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Seu endereço de email"
                    required
                  />
                </Col>
                <Col sm={6}>
                  <Form.Control
                    type="text"
                    placeholder="Seu endereço de email"
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Control type="text" placeholder="Assunto" required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FloatingLabel controlId="floatingTextarea2" label="Comments">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: "100px" }}
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <div className="d-flex justify-content-between align-items-center">
                <p>
                  Ao enviar esta mensagem estás ciente de que leu e concorda com{" "}
                  <br />a nossa politica de dados, bem como os nossos termos de
                  serviços.{" "}
                </p>
                <button className="btn btn-primary">Enviar</button>
              </div>
            </Form>
          </Col>
          <Col sm={6}>
            <iframe
              src="https://w4ww.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126153.01126636742!2d13.201530491664125!3d-8.853353675067385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d42007f26dc9%3A0x8d3c38156712e706!2zQW5sdWdlIFByZXN0YcOnw6NvIGRlIFNlcnZpw6dvcyAmIENvbcOpcmNpbw!5e0!3m2!1spt-PT!2sao!4v1721315716105!5m2!1spt-PT!2sao"
              width="600"
              height="500"
              allowfullscreen=""
              loading="lazy"
              className="mapa"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
