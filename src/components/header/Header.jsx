import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BsSearch, BsTelephone } from "react-icons/bs";
import { FaServicestack } from "react-icons/fa";
import { FaBlog, FaHouse } from "react-icons/fa6";

import "./header.css";
import { UserProfileButton } from "./UserProfileButton";

const Header = () => {
  return (
    <header id="header">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            Metanoia &nbsp;
            <InputGroup>
              <InputGroup.Text id="basic-addon1" className="pesquisar1">
                <BsSearch className="fs-6" />
              </InputGroup.Text>
              <Form.Control
                placeholder="pesquisar"
                aria-label="pesquisar"
                aria-describedby="basic-addon1"
                className="pesquisar2"
              />
            </InputGroup>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto flex items-center">
              <Nav.Link href="/">
                <FaHouse size={18} />
                &nbsp; Página inical
              </Nav.Link>
              <Nav.Link href="/services">
                <FaServicestack size={18} />
                &nbsp; Serviços
              </Nav.Link>
              <Nav.Link href="/Blog">
                <FaBlog size={18} />
                &nbsp; Blog
              </Nav.Link>
              <Nav.Link href="/contact">
                <BsTelephone size={18} />
                &nbsp; Contacto
              </Nav.Link>
              <UserProfileButton />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
