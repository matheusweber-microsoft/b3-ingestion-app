import Filters from "../components/Filters";
import { Link } from "react-router-dom";
import ListDocuments from "../components/ListDocuments";

export default function DocumentsList() {
  return (
    <div>
      <h2>Documents</h2>

      <Filters />

      <Link to="/upload">
        <div className="input w-64 my-8">Upload Document</div>
      </Link>

      <ListDocuments />
    </div>
  );
}
