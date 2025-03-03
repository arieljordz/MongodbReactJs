import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./customPages/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./customPages/ThemeContext";

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
