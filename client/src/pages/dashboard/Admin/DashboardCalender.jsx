import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DashboardCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());


    const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    return (
        <div className="w-full max-w-md mx-auto bg- p-6 rounded-2xl shadow-xl  h-[410px]">

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="!w-full border-none bg-white rounded-xl p-2 text-black"
                tileClassName={({ date }) => {
                    const classes = ['py-2 rounded-md transition-all'];

                    // Today
                    if (isSameDay(date, new Date())) {
                        classes.push('bg-indigo-600 text-white');
                    }

                    // Selected date
                    if (isSameDay(date, selectedDate)) {
                        classes.push('bg-[#E60076] text-white');
                    }

                    return classes.join(' ');
                }}
            />

            <p className="text-center mt-4">
                Selected Date:{' '}
                <span className="font-semibold text-pink-500">{selectedDate.toDateString()}</span>
            </p>
        </div>
    );
};

export default DashboardCalendar;
