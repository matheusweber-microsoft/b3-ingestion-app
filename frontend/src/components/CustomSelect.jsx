import React, { useState } from 'react';
import theme from '../styles/theme.js';

const CustomSelect = ({name, defaultOption, options, disabled, onChange}) => {
    return (
        <select name={name} className="rounded-md p-2 border-b-2" style={{ height: '60px', color: theme.colors.textfieldColor, borderBottomColor: theme.colors.primary, backgroundColor: theme.colors.field, marginTop: '10px'  }} required onChange={onChange} disabled={disabled}>
            <option value="default">{defaultOption}</option>
            {options && options.length > 0 && options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
};

export default CustomSelect;