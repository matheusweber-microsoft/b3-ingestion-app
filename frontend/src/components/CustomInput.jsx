import React, { useState } from 'react';

const CustomInput = ({ placeholder, name, value, disabled }) => {
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
        className="border-b-2 bg-[#e3e5e7] py-2 px-4 rounded-md w-full outline-none" 
        style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }}
        type="text"
        placeholder={isFocused ? '' : placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        value={value}
        disabled={disabled}
      />
      {isFocused && (
        <label className="absolute top-2 left-4 text-gray-500 text-sm transition-all">
          {placeholder}
        </label>
      )}
    </div>
  );
};

export default CustomInput;