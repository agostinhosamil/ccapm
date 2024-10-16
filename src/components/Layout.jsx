import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import Footer from "./footer/Footer";
import Header from "./header/Header";

const Layout = () => {
  return (
    <Fragment>
      <Header />
      <div className="w-full block">
        <Outlet />
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;
