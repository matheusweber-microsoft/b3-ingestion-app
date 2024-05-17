import React from 'react';

const StatusView = ({ status }) => {
    switch (status) {
        case 1:
            return (
                <div className="bg-yellow-500 text-white p-4 rounded-xl flex items-center justify-center w-full h-2">
                    <p className="text-sm">Prestes a expirar</p>
                </div>
            )
        case 2:
            return (
                <div className="bg-red-500 text-white p-4 rounded-xl flex items-center justify-center w-full h-2">
                    <p className="text-sm">Expirado</p>
                </div>
            )
        default:
            return <div>-</div>;
    }
};

export default StatusView;