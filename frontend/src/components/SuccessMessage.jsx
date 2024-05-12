import React from 'react';
import { Link } from 'react-router-dom';

const SuccessMessage = ({ message, link }) => {
    return (
        <div className="bg-green-500 text-white p-4 rounded-xl">
            {message}
            <Link to={link}> Clique aqui para acessá-lo!</Link>
        </div>
    );
};

export default SuccessMessage;