import { useSelector, useDispatch } from "react-redux";
import {
  setDocumentTitle,
  setFileName,
  setUploadDate,
  setExpiredOnly,
  setSelectedThemeId,
  setSelectedSubThemeId,
} from "./filtersSlice";

function Filters() {
  const themes = [
    {
      id: 1,
      name: "Theme 1",
    },
    {
      id: 2,
      name: "Theme 2",
    },
    {
      id: 3,
      name: "Theme 3",
    },
  ];

  const subThemes = [
    {
      id: 1,
      name: "Sub Theme 1",
    },
    {
      id: 2,
      name: "Sub Theme 2",
    },
    {
      id: 3,
      name: "Sub Theme 3",
    },
  ];

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const handleInputChange = (setter) => (e) => {
    dispatch(setter(e.target.value));
  };

  return (
    <div>
      <p>filters</p>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p>Document Title</p>
          <input
            type="text"
            value={filters?.documentTitle}
            onChange={handleInputChange(setDocumentTitle)}
            placeholder="Search by document title"
            className="input"
          />
        </div>
        <div>
          <p>File Name</p>
          <input
            type="text"
            value={filters?.fileName}
            onChange={handleInputChange(setFileName)}
            placeholder="Search by file name"
            className="input"
          />
        </div>
        <div>
          <p>Uploaded on</p>
          <input
            type="date"
            value={filters?.uploadDate}
            onChange={handleInputChange(setUploadDate)}
            className="input"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={filters?.expiredOnly}
            onChange={(e) => dispatch(setExpiredOnly(e.target.checked))}
            className="input w-8 h-8 mr-2"
          />
          <p>Show only Expired Documents or About to Expire (In X Days)</p>
        </div>
        <div>
          <p>Theme</p>

          <select
            value={filters?.selectedThemeId || ""}
            onChange={handleInputChange(setSelectedThemeId)}
            className="input"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Sub Theme</p>
          <select
            value={filters?.selectedSubThemeId || ""}
            onChange={handleInputChange(setSelectedSubThemeId)}
            className="input"
          >
            {subThemes.map((subTheme) => (
              <option key={subTheme.id} value={subTheme.id}>
                {subTheme.name}
              </option>
            ))}
          </select>
        </div>
        <button className="input">Search</button>
      </div>
    </div>
  );
}

export default Filters;
