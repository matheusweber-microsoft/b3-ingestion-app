import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import uploadIcon from '../images/upload-ic.png'; // Import the image

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
        <div className="rounded-md border-b-2" style={{ background: '#e3e5e7', display: 'flex', alignItems: 'center', height: '60px', paddingLeft: '10px', borderBottomColor: '#00B0E6'}}>
            <input ref={fileInputRef} type="file" onChange={handleFileChange} name={name} style={{ display: 'none' }} />
            <label htmlFor="fileInput" style={{ cursor: 'pointer', width: '90%' }} onClick={handleClick}>
                {fileName ? fileName : placeholder}
            </label>
            <div style={{ width: '10%', paddingRight: '10px' }}>
                <img src={uploadIcon} alt="Upload Icon" style={{ marginLeft: '10px', width: '24px', height: '24px', float: 'right' }} />
            </div>
        </div>
    );
});

export default CustomFileInput;