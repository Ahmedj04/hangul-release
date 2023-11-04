import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ minutes, onTimerComplete }) => {
    const [seconds, setSeconds] = useState(minutes * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            } else {
                clearInterval(timer);
                onTimerComplete();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds, minutes, onTimerComplete]);

    const minutesDisplay = Math.floor(seconds / 60);
    const secondsDisplay = seconds % 60;

    return (
        <div>
            <p>
                Time Left: {minutesDisplay}:{secondsDisplay < 10 ? '0' : ''}{secondsDisplay}
            </p>
        </div>
    );
};

export default CountdownTimer;
