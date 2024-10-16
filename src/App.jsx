import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import { AppContextProvider } from "./contexts/AppContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import Blog from "./pages/blog/Blog";
import Contact from "./pages/contact/Contact";
import Home from "./pages/home";
import Services from "./pages/services/Services";

function App() {
  return (
    <AppContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />}></Route>
              <Route path="services" element={<Services />}></Route>
              <Route path="blog" element={<Blog />}></Route>
              <Route path="contact" element={<Contact />}></Route>
              <Route path="me" element={<h1>Me</h1>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </AppContextProvider>
  );
}

export default App;
