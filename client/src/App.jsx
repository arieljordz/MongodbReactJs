import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./customPages/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./customPages/ThemeContext";
import "admin-lte/dist/css/adminlte.min.css"; // AdminLTE Styles
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap Styles
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome Icons



const clientId =
  "1083595131876-m65tgditjmdmg3ait4h01q1q25t7p759.apps.googleusercontent.com";

function App() {
  return (
    <div>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <BrowserRouter>
            <ToastContainer />
            <Layout />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
