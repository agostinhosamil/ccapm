import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { BsTelephone } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import banner1 from "../../assets/images/medico.png";
import banner2 from "../../assets/images/medico2.png";
import banner3 from "../../assets/images/medico3.png";
import { CreateAppointmentModal } from "./CreateAppointmentModal";
import "./hero.css";

const Hero = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="w-full block py-16 bg-[#adffd9]">
      <CreateAppointmentModal handleClose={handleClose} show={show} />
      <section id="home" className="hero-block py-5">
        <Container>
          <Row>
            <Col sm={6}>
              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={false}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <img alt="Header banner" src={banner1} />
                </SwiperSlide>
                <SwiperSlide>
                  <img alt="Header banner" src={banner2} />
                </SwiperSlide>
                <SwiperSlide>
                  <img alt="Header banner" src={banner3} />
                </SwiperSlide>
              </Swiper>
            </Col>
            <Col sm={6}>
              <h1 className="font-extrabold text-emerald-950 uppercase">
                Consultório de
                <br />
                Psicologia
              </h1>
              <p>
                To be more specific, the problem of a small part of the matrix
                of available is regularly debated in the light of The Usage of
                Transparent Extent <br /> (Buck Begay in The Book of the
                Structural Comparison.
              </p>
              <Row>
                <Col sm={4}>
                  <a href="#" className="button btn1" onClick={handleShow}>
                    <FaCalendarAlt size={15} /> &nbsp; Marcar consulta
                  </a>
                </Col>
                <Col sm={4}>
                  <a href="#" className="button btn2">
                    <BsTelephone size={15} /> &nbsp; Ligar agora
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Hero;
