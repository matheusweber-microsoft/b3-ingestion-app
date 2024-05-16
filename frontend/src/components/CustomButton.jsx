import React from 'react';
import theme from '../styles/theme.js';

const CustomButton = ({ buttonText }) => {
    return (
        <button type="submit" className="text-white px-4 py-2 rounded-md" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.buttonTitle, height: '60px' }}>{buttonText}</button>
    );
};

export default CustomButton;