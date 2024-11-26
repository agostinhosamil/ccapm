import { Fragment } from "react";

import Graphic from "../components/Graphic";
import Hero from "../components/Hero";
import Profissionais from "../components/Professionals";
import Services from "../components/Services";

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
