import React, { useState } from 'react';

const CustomSelect = ({name, defaultOption, disabled}) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <select id="theme" name={name} className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} required onChange={handleSelectChange} disabled={disabled}>
            <option value="default">{defaultOption}</option>
        </select>
    );
};

export default CustomSelect;