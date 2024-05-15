import { useSelector, useDispatch } from "react-redux";
import Title from "../Title";
import CustomInput from "../CustomInput";
import React, { useState, useEffect, useRef } from 'react';


function DocumentDetails({documentTitle, fileName, theme, themeName, subtheme, subthemeName, uploadedDate, expiryDate, uploadedBy}) {
    const fileInputRef = useRef();
    return (
        <main class="relative" style={{ padding: '10px' }}>
            <Title title={"Detalhes do documento: " + documentTitle}/>
            <div style={{ marginTop: '10px' }}>
                <div className="flex flex-row space-x-4 ">
                    <div className="flex flex-col flex-grow" >
                        <label htmlFor="field1" className="text-xs font-bold">Nome do Arquivo:</label>
                        <CustomInput placeholder="" name="" value={fileName} disabled={true}/>
                    </div>

                    <div className="flex flex-col flex-grow">
                    <label htmlFor="field1" className="text-xs font-bold">Tema:</label>
                        <CustomInput placeholder="" name="" value={themeName} disabled={true}/>
                    </div>
    
                    <div className="flex flex-col  flex-grow">
                    <label htmlFor="field1" className="text-xs font-bold">Subtema:</label>
                        <CustomInput placeholder="" name="" value={subthemeName} disabled={true}/>
                    </div>
                </div>
                <div className="flex flex-row space-x-4 " style={{ marginTop: '45px' }}>
                    <div className="flex flex-col  flex-grow">
                        <label htmlFor="field1" className="text-xs font-bold">Cadastrado em:</label>
                        <CustomInput placeholder="" name="" value={uploadedDate} disabled={true}/>
                    </div>

                    <div className="flex flex-col  flex-grow">
                        <label htmlFor="field1" className="text-xs font-bold">Data de validade:</label>
                        <CustomInput placeholder="" name="" value={expiryDate} disabled={true}/>
                    </div>

                    <div className="flex flex-col flex-grow" >
                        <label htmlFor="field1" className="text-xs font-bold">Cadastrado por:</label>
                        <CustomInput placeholder="" name="" value={uploadedBy} disabled={true}/>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid black', marginTop: '40px', width: '100%' }}></div>
        </main>
      );
}

export default DocumentDetails;
