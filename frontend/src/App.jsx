import DocumentsList from "./pages/DocumentsList";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import SideBar from "./components/SideBar";
import lightTheme from "./styles/theme.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

export default function App() {
  console.log("V1.0")
  return (
    <Router>
      <div className="flex" style={{background: lightTheme.colors.background}}>
        <SideBar />
        <div className="flex-1">
          <Header />
          <div className="mx-6 mt-6">
            <Routes>
              <Route path="/" element={<DocumentsList />} />
              <Route path="/upload" element={<UploadDocument />} />
              <Route path="/document/:id" element={<ViewDocument />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
