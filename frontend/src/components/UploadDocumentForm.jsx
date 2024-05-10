import Title from './Title.jsx';
import React, { useState, useEffect } from 'react';
import { uploadDocument } from '../api/api.ts';
import ErrorMessage from './ErrorMessage.jsx';  
import SuccessMessage from './SuccessMessage.jsx';

const UploadDocumentForm = (props) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [subthemes, setSubthemes] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { themes = [], onLoading } = props;

  useEffect(() => { 
    document.getElementById("messages").style.display = "block";
    if (selectedTheme) {
      const theme = themes.find(theme => theme.themeId === selectedTheme);
      if (theme) {
        setSubthemes(theme.subThemes);
        console.log(theme.subThemes);
        console.log("subthemes = " + subthemes);
      } else {
        setSubthemes([]);
      }
    }
  },[selectedTheme, subthemes]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { title, theme, subtheme, expiryDate, language, file } = event.target;

    onLoading(true);
    setShowErrorMessage(false);
    setShowSuccessMessage(false);

    uploadDocument(title.value, theme.value, subtheme.value, expiryDate.value, file.files[0], "matheus", language.value).then((response) => {
      document.getElementById("messages").style.display = "block";
      if (response.success) {
        setShowSuccessMessage(true);
      } else {
        setErrorMessage(response.message);
        setShowErrorMessage(true);
      }
    }).catch((error) => {
      setErrorMessage(error.message);
      setShowErrorMessage(true);
    }).finally(() => {
      onLoading(false);
    });
  };
  
  return (
<<<<<<< HEAD
    <main>
<<<<<<< HEAD
      <Title title="Upload Document" />
      <form className="flex flex-col space-y-4" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px' }}>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Document Title:</label>
            <input type="text" id="field2" name="field2" className="border border-gray-300 rounded-md p-1 mt-2" required/>
          </div>
=======
    <main class="relative">
      <div>
        <Title title="Upload Document" />

        <div className="flex flex-col space-y-4 mt-5" id="messages" style={{ display: 'none' }}>
          { showErrorMessage && <ErrorMessage message={errorMessage} id="errorMessage" /> }
          { showSuccessMessage && <SuccessMessage message="Success on upload document" id="successMessage" /> }
>>>>>>> a8f4cf2 (Add loading, success and error message)
        </div>
        <form className="flex flex-col space-y-4" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px' }} onSubmit={handleSubmit}>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Document Title:</label>
              <input type="text" id="field2" name="title" className="border border-gray-300 rounded-md p-1 mt-2" required/>
            </div>
          </div>

          <div className="flex flex-row space-x-4 ">
            <div className="flex flex-col flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Theme:</label>
              <select id="theme" name="theme" className="border border-gray-300 rounded-md p-2" required onChange={handleThemeChange}>
                <option value="default">Select a theme</option>
                {themes.map((theme, index) => (
                  <option key={index} value={theme.themeId}>{theme.themeName}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Subtheme:</label>
              <select id="subtheme" name="subtheme" className="border border-gray-300 rounded-md p-2" required>
                <option value="default">Select a theme</option>
                {
                  subthemes.length === 0 ? <option value="default">Select a theme</option> : subthemes.map((subtheme, index) => (
                    <option key={index} value={subtheme.subthemeId}>{subtheme.subthemeName}</option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Expiry Date:</label>
              <input type="date" id="field4" name="expiryDate" className="border border-gray-300 rounded-md p-2" required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Language:</label>
              <select id="language" name="language" className="border border-gray-300 rounded-md p-2" required>
                <option value="eng">English</option>
                <option value="pt-br">Portuguese</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
          <label htmlFor="field1" className="text-xs font-bold">File:</label>
            <input type="file" id="file" name="file" className="border border-gray-300 rounded-md p-2" required/>
          </div>

<<<<<<< HEAD
        <div className="flex flex-col">
        <label htmlFor="field1" className="text-xs font-bold">File:</label>
          <input type="file" id="file" name="file" className="border border-gray-300 rounded-md p-2" required/>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
      </form>
=======
        <Title title="Upload Document" />
        <form className="flex flex-col space-y-4" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px' }}>
          <div className="flex flex-col">
            <label htmlFor="field1" className="text-xs font-bold">Document Title:</label>
            <input type="text" id="field2" name="field2" className="border border-gray-300 rounded-md p-1 mt-2" />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="field2" className="text-xl font-bold">Field 2:</label>
            <input type="text" id="field2" name="field2" className="border border-gray-300 rounded-md p-2" />

            <label htmlFor="field3" className="text-xl font-bold">Field 3:</label>
            <input type="text" id="field3" name="field3" className="border border-gray-300 rounded-md p-2" />

            <label htmlFor="field4" className="text-xl font-bold">Field 4:</label>
            <input type="text" id="field4" name="field4" className="border border-gray-300 rounded-md p-2" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="file" className="text-xl font-bold">File:</label>
            <input type="file" id="file" name="file" className="border border-gray-300 rounded-md p-2" />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
        </form>
>>>>>>> f06a479 (Start)
=======
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
        </form>
      </div>
>>>>>>> a8f4cf2 (Add loading, success and error message)
    </main>
  );
}

export default UploadDocumentForm;
