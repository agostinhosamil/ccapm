import { Fragment } from "react";

import Graphic from "../components/Graphic";
import Hero from "../components/hero/Hero";
import Profissionais from "../components/profissionais/Profissionais";
import Services from "../components/services/Services";

const Home = () => {
  return (
    <Fragment>
      <Hero />
      <Graphic />
      <Services />
      <Profissionais />
    </Fragment>
  );
};

export default Home;
