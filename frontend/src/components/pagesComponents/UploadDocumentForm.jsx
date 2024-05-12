import Title from '../Title.jsx';
import React, { useState, useEffect, useRef } from 'react';
import { uploadDocument } from '../../api/api.ts';
import ErrorMessage from '../ErrorMessage.jsx';  
import SuccessMessage from '../SuccessMessage.jsx';
import CustomInput from '../CustomInput.jsx';
import CustomButton from '../CustomButton.jsx';
import CustomFileInput from '../CustomFileInput.jsx';

const UploadDocumentForm = (props) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [subthemes, setSubthemes] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState({});

  const { themes = [], onLoading } = props;
  const fileInputRef = useRef();

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

  const handleClean = () => {
    fileInputRef.current.clean();
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
        setResponse(response);
        setShowSuccessMessage(true);
        title.value = ""; // Clear the title field
        theme.value = "default"; // Reset the theme select to default
        subtheme.value = "default"; // Reset the subtheme select to default
        expiryDate.value = ""; // Clear the expiry date field
        file.value = ""; // Clear the file input
        handleClean();
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
    <main className="relative">
      <div>
        <Title title="Registrar Documento" />

        <div className="flex flex-col space-y-4 mt-5" id="messages" style={{ display: 'block' }}>
          { showErrorMessage && <ErrorMessage message={errorMessage} id="errorMessage" /> }
          { showSuccessMessage && <SuccessMessage message={`Cadastro de documento foi um sucesso!`} link={`/document/${response.id}`} id="successMessage" /> }
        </div>
        <form className="flex flex-col space-y-4" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px' }} onSubmit={handleSubmit}>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col flex-grow" >
              <CustomInput placeholder="Título do Documento" name="title" disabled={false}/>
              {/* <input type="text" id="field2" name="title" className="border border-gray-300 rounded-md p-1 mt-2" required/> */}
            </div>
          </div>

          <div className="flex flex-row space-x-4 " style={{ marginTop: '30px' }}>
            <div className="flex flex-col flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Tema:</label>
              <select id="theme" name="theme" className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} required onChange={handleThemeChange}>
                <option value="default">Selecione um tema</option>
                {themes.map((theme, index) => (
                  <option key={index} value={theme.themeId}>{theme.themeName}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Subtema:</label>
              <select id="subtheme" name="subtheme" className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} required>
                <option value="default">Selecione um subtema</option>
                {
                  subthemes.length === 0 ? <option value="default">Selecione um tema</option> : subthemes.map((subtheme, index) => (
                    <option key={index} value={subtheme.subthemeId}>{subtheme.subthemeName}</option>
                  ))
                }
              </select>
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Data de validade:</label>
              <input type="date" id="field4" name="expiryDate" className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <input type="hidden" id="language" name="language" value="pt-BR" />

            {/* <div className="flex flex-col  flex-grow">
                  <label htmlFor="field1" className="text-xs font-bold">Language:</label>
                  <select id="language" name="language" className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} required>
                    <option value="eng">English</option>
                    <option value="pt-br">Portuguese</option>
                  </select>
                </div>
           */}
          </div>
          <div className="flex flex-col">
          <label htmlFor="field1" className="text-xs font-bold" style={{ paddingBottom: '10px'  }} >File:</label>
            {/* <input type="file" id="file" name="file" className="border border-gray-300 rounded-md p-2" required/> */}
          <CustomFileInput ref={fileInputRef} placeholder="Selecione um Arquivo" name="file" />
          </div>
          
          <CustomButton buttonText="Enviar" />
        </form>
      </div>
    </main>
  );
}

export default UploadDocumentForm;
