import React from 'react';

const CustomButton = ({ buttonText }) => {
    return (
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" style={{ backgroundColor: '#FFD862', color: '#002C63', height: '60px' }}>{buttonText}</button>
    );
};

export default CustomButton;