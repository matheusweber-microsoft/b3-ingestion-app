import React, { useState } from 'react';
import theme from '../styles/theme.js';

const CustomDateField = ({name, required}) => {
    return (
        <input type="date" name={name} className="rounded-md p-2 border-b-2" style={{ height: '60px', color: theme.colors.textfieldColor, borderBottomColor: theme.colors.primary, backgroundColor: theme.colors.field, marginTop: '10px'  }} required={required} min={new Date().toISOString().split('T')[0]} />
    );
};

export default CustomDateField;