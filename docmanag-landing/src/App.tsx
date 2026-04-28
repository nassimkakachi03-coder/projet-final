import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Register from "./pages/Register";
import PatientLogin from "./pages/PatientLogin";
import PatientPortal from "./pages/PatientPortal";

// Routes sans NavBar/Footer
const NO_LAYOUT_ROUTES = ["/login", "/register"];

function AppLayout() {
  const location = useLocation();
  const isNoLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isNoLayout && <NavBar />}
      <main className={isNoLayout ? "flex-grow" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/espace-patient" element={<PatientPortal />} />
        </Routes>
      </main>
      {!isNoLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
