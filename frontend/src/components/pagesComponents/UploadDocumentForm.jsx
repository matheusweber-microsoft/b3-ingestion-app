import Title from '../Title.jsx';
import React, { useState, useEffect, useRef } from 'react';
import { uploadDocument } from '../../api/api.ts';
import ErrorMessage from '../ErrorMessage.jsx';  
import SuccessMessage from '../SuccessMessage.jsx';
import CustomInput from '../CustomInput.jsx';
import CustomButton from '../CustomButton.jsx';
import CustomFileInput from '../CustomFileInput.jsx';
import CustomSelect from '../CustomSelect.jsx';
import CustomDateField from '../CustomDateField.jsx';

const UploadDocumentForm = (props) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubtheme, setSelectedSubtheme] = useState(null); 
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
      } else {
        setSubthemes([]);
      }
    }
  },[selectedTheme, subthemes]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleSubthemeChange = (event) => {
    setSelectedSubtheme(event.target.value);
  };

  const handleClean = () => {
    fileInputRef.current.clean();
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const { title, theme, subtheme, expiryDate, language, file } = event.target;
    
    const themeObj = themes.find(theme => theme.themeId === selectedTheme);
    const themeName = themeObj.themeName;
    const subthemeObj = subthemes.find(subtheme => subtheme.subthemeId === selectedSubtheme);
    const subthemeName = subthemeObj.subthemeName;
    console.log(expiryDate);
    onLoading(true);
    setShowErrorMessage(false);
    setShowSuccessMessage(false);

    // uploadDocument(title.value, theme.value, themeName, subtheme.value, subthemeName, expiryDate.value, file.files[0], "matheus", language.value).then((response) => {
    //   document.getElementById("messages").style.display = "block";
    //   if (response.success) {
    //     setResponse(response);
    //     setShowSuccessMessage(true);
    //     title.value = ""; // Clear the title field
    //     theme.value = "default"; // Reset the theme select to default
    //     subtheme.value = "default"; // Reset the subtheme select to default
    //     expiryDate.value = ""; // Clear the expiry date field
    //     file.value = ""; // Clear the file input
    //     handleClean();
    //   } else {
    //     setErrorMessage(response.message);
    //     setShowErrorMessage(true);
    //   }
    // }).catch((error) => {
    //   setErrorMessage(error.message);
    //   setShowErrorMessage(true);
    // }).finally(() => {
    //   onLoading(false);
    // });
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
              <CustomSelect name="theme" defaultOption="Selecione um tema" options={themes.map((theme, index) => ({value: theme.themeId, label: theme.themeName}))} disabled={false} onChange={handleThemeChange} />
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Subtema:</label>
              <CustomSelect name="subtheme" defaultOption="Selecione um subtema" options={subthemes.map((subtheme, index) => ({value: subtheme.subthemeId, label: subtheme.subthemeName}))} disabled={false} onChange={handleSubthemeChange} />
            </div>

            <div className="flex flex-col  flex-grow">
              <label htmlFor="field1" className="text-xs font-bold">Data de validade:</label>
              <CustomDateField name="expiryDate" />
            </div>
            <input type="hidden" id="language" name="language" value="eng" />
          </div>
          <div className="flex flex-col">
          <label htmlFor="field1" className="text-xs font-bold" style={{ paddingBottom: '10px'  }} >File:</label>
          <CustomFileInput ref={fileInputRef} placeholder="Selecione um Arquivo" name="file" />
          </div>
          
          <CustomButton buttonText="Enviar" />
        </form>
      </div>
    </main>
  );
}

export default UploadDocumentForm;
