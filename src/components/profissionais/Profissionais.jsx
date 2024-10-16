import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { doctor1 } from "./imports";
import "./profissionais.css";

function Profissionais() {
  return (
    <>
      <section id="profissionais" className="profissionais-block py-5">
        <Container fluid>
          <h1 className="text-center pb-28 m-0 uppercase font-extrabold text-zinc-900">
            Nossos profissionais
          </h1>
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 5,
              },
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
            <SwiperSlide>
              <Card
                style={{ width: "300px" }}
                className="rounded-full overflow-hidden"
              >
                <img src={doctor1} alt="" />
              </Card>
            </SwiperSlide>
          </Swiper>
        </Container>
      </section>
    </>
  );
}

export default Profissionais;
