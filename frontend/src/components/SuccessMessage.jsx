import React from 'react';
import { Link } from 'react-router-dom';

const SuccessMessage = ({ message, link }) => {
    return (
        <div className="bg-green-500 text-white p-4 rounded-xl">
            {message}
            <Link to='/document/2e240f53-db3f-41cc-b205-4dd812195877'> Clique aqui para acessá-lo!</Link>
        </div>
    );
};

export default SuccessMessage;