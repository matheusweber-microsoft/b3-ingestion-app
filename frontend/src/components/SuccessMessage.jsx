import React from 'react';

const SuccessMessage = ({ message }) => {
    return (
        <div className="bg-green-500 text-white p-4 rounded-xl">
            {message}
        </div>
    );
};

export default SuccessMessage;