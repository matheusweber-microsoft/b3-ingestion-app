import React from 'react';
import lightTheme from '../styles/theme.js';

const Title = ({ title }) => {
    return (
        <div>
            <h1 className="text-3xl" style={{
                color: lightTheme.colors.title, // Add this line to set the text color
            }}>
                {title}
            </h1>
        </div>
    );
};

export default Title;