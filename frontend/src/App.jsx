import DocumentsList from "./pages/DocumentsList";
import UploadDocument from "./pages/UploadDocument";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="grid grid-flow-col gap-8">
        <div>
          <div>Documents management</div>
        </div>
        <div className="col-span-2">
          <Routes>
            <Route path="/" element={<DocumentsList />} />
            <Route path="/upload" element={<UploadDocument />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
