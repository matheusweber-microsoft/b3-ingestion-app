import React, { useState } from 'react';

const CustomDateField = (name, initialValue, disabled) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <input type="date" id="field4" name={name} className="rounded-md p-2 border-b-2 bg-gray-100" style={{ height: '60px', borderBottomColor: '#00B0E6', marginTop: '10px'  }} value={initialValue} disabled={disabled} required min={new Date().toISOString().split('T')[0]} />
    );
};

export default CustomDateField;