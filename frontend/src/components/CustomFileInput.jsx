import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import theme from '../styles/theme.js';

const CustomFileInput = forwardRef(({ placeholder, name }, ref) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
    };

    const handleClick = () => {
        fileInputRef.current.click(); // Trigger click event on file input
    };

    useImperativeHandle(ref, () => ({
        clean: () => {
            console.log('Clean method called');
            setFileName('');
        }
    }));

    return (
        <div className="rounded-md border-b-2" style={{ color: theme.colors.textfieldColor, background: theme.colors.field, display: 'flex', alignItems: 'center', height: '60px', paddingLeft: '10px', borderBottomColor: theme.colors.primary}}>
            <input ref={fileInputRef} type="file" onChange={handleFileChange} name={name} style={{ display: 'none' }} />
            <label htmlFor="fileInput" style={{ cursor: 'pointer', width: '90%' }} onClick={handleClick}>
                {fileName ? fileName : placeholder}
            </label>
            <div style={{ width: '10%', paddingRight: '10px' }}>
                <img src="upload-ic.png" alt="Upload Icon" style={{ marginLeft: '10px', width: '24px', height: '24px', float: 'right' }} />
            </div>
        </div>
    );
});

export default CustomFileInput;