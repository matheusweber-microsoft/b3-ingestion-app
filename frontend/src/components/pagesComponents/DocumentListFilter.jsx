import CustomInput from '../CustomInput.jsx';
import CustomButton from '../CustomButton.jsx';
import CustomFileInput from '../CustomFileInput.jsx';
import CustomSelect from '../CustomSelect.jsx';
import Title from '../Title.jsx';
import React, { useState, useEffect, useRef } from 'react';

const DocumentListFilter = (props) => {
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedSubtheme, setSelectedSubtheme] = useState(null); 
    const [subthemes, setSubthemes] = useState([]);

    const { themes = [], onFilter } = props;

    const uploadedDateOptions = [
        { value: '1', label: 'Hoje' },
        { value: '3', label: 'Últimos 3 dias' },
        { value: '7', label: 'Últimoa semana' },
        { value: '30', label: 'Último mês' },
    ];

    useEffect(() => { 
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
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const { documentTitle, fileName, uploadedDate, theme, subtheme, onlyExpired } = event.target;
        const formData = {
            documentTitle: documentTitle.value || undefined,
            fileName: fileName.value || undefined,
            uploadedDate: uploadedDate.value || undefined,
            theme: theme.value || undefined,
            subtheme: subtheme.value || undefined,
            onlyExpired: onlyExpired.checked || undefined
        };
        onFilter(formData);
    };

    return (
        <main className="relative" style={{ padding: '10px' }}>
            <Title title={"Documentos"}/>
                <form className="flex flex-col space-y-4" style={{width: "100%", float:"left"}} onSubmit={handleSubmit}>
                    <div className="flex flex-row" style={{ marginTop: '10px' }}>
                        <div className="flex flex-col" style={{width: "90%", float:"left"}}>
                            <div className="flex flex-row space-x-4 ">
                                <div className="flex flex-col flex-grow" style={{width: "33%"}} >
                                    <label htmlFor="field1" className="text-xs font-bold">Título do documento:</label>
                                    <CustomInput placeholder="Título do documento" name="documentTitle" disabled={false} required={false}/>
                                </div>

                                <div className="flex flex-col flex-grow" style={{width: "33%"}} >
                                    <label htmlFor="field1" className="text-xs font-bold">Título do arquivo:</label>
                                    <CustomInput placeholder="Título do documento" name="fileName" disabled={false} required={false}/>
                                </div>

                                <div className="flex flex-col flex-grow" style={{width: "33%"}}>
                                    <label htmlFor="field1" className="text-xs font-bold">Enviado nos últimos:</label>
                                    <CustomSelect name="uploadedDate" defaultOption="Selecione uma opção" options={uploadedDateOptions} required={false} disabled={false} onChange={() => {}} />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-4 " style={{ marginTop: '15px' }}>
                                <div className="flex flex-col flex-grow" style={{width: "33%"}}>
                                    <label htmlFor="field1" className="text-xs font-bold">Tema:</label>
                                    <CustomSelect name="theme" required={false} defaultOption="Selecione um tema" options={themes.map((theme, index) => ({value: theme.themeId, label: theme.themeName}))} disabled={false} onChange={handleThemeChange} />
                                </div>

                                <div className="flex flex-col flex-grow" style={{width: "33%"}}>
                                    <label htmlFor="field1" className="text-xs font-bold">Subtema:</label>
                                    <CustomSelect name="subtheme" required={false} defaultOption="Selecione um subtema" options={subthemes.map((subtheme, index) => ({value: subtheme.subthemeId, label: subtheme.subthemeName}))} disabled={false} onChange={handleSubthemeChange} />
                                </div>

                                <div className="flex flex-col flex-grow" style={{width: "33%", marginTop: "25px"}} >
                                    <CustomButton buttonText="Procurar" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center" style={{width: "10%", float:"left"}} >
                            <div className="flex flex-row space-x-4 items-center justify-center ml-10">
                                <div className="flex items-center">
                                    <input type="checkbox" id="checkbox" name="onlyExpired" className="mr-2" />
                                    <label htmlFor="checkbox">Mostrar apenas expirados ou prestes a expirar</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            <div style={{ borderTop: '1px solid black', marginTop: '40px', width: '100%', float:"left" }}></div>
        </main>
    );
};

export default DocumentListFilter;