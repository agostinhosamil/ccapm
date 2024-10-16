import Container from "react-bootstrap/Container";
import { NavLink } from "react-router-dom";
import doctor from "../../assets/images/doctor1.png";
import img from "../../assets/images/pi4.jpg";
import "./services.css";

const Services = () => {
  return (
    <>
      <section id="services" className="block services-block">
        <Container fluid>
          <h1 className="w-full flex py-20 m-0 text-center justify-center font-extrabold uppercase">
            Nossos Serviços{" "}
          </h1>
          <div className="services-containeer">
            <div className="row">
              <div className="col-md-6">
                <div className="box-img">
                  <img src={img} alt="" />
                  <h3 className="mt-2">Psicoterapia Individual</h3>
                  <p>
                    Curiously, there is a direct relation between the strategic
                    management and cost of the driving factor. However, with
                    height of the content strategy should focus on The Program
                    of Detached Breach
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="box-img">
                  <img src={img} alt="" />
                  <h3 className="mt-2">Terapia de Casal e Familiar</h3>
                  <p>
                    Curiously, there is a direct relation between the strategic
                    management and cost of the driving factor. However, with
                    height of the content strategy should focus on The Program
                    of Detached Breach
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="box-img">
                  <img src={img} alt="" />
                  <h3 className="mt-2">Orientação Vocacional</h3>
                  <p>
                    Curiously, there is a direct relation between the strategic
                    management and cost of the driving factor. However, with
                    height of the content strategy should focus on The Program
                    of Detached Breach
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="box-img">
                  <img src={img} alt="" />
                  <h3 className="mt-2">Orientação Parental</h3>
                  <p>
                    Curiously, there is a direct relation between the strategic
                    management and cost of the driving factor. However, with
                    height of the content strategy should focus on The Program
                    of Detached Breach
                  </p>
                </div>
              </div>
              <div>
                <NavLink to="/services" className="button3 btn3">
                  Ver mais
                </NavLink>
              </div>
            </div>
            <div className="content-img">
              <img src={doctor} alt="" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Services;
