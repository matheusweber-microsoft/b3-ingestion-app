import React, { useState } from 'react';
import theme from '../styles/theme.js';

const CustomInput = ({ placeholder, name, value, disabled, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative w-full h-12">
      <input
        className="border-b-2 py-2 px-4 rounded-md w-full outline-none" 
        style={{ height: '60px', color: theme.colors.textfieldColor, borderBottomColor: theme.colors.primary, backgroundColor: theme.colors.field, marginTop: '10px'  }}
        type="text"
        required={required}
        placeholder={isFocused ? '' : placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        value={value}
        disabled={disabled}
      />
      {isFocused && (
        <label className="absolute top-2 left-4 text-sm transition-all" style={{textColor: theme.colors.tertiary}}>
          {placeholder}
        </label>
      )}
    </div>
  );
};

export default CustomInput;