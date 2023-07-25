import React from 'react';

const TopBar = () => {
    const handleClose = () => {
        window.api.closeApp();
    }

    const handleMinimize = () => {
        window.api.minimizeApp();
    }

    return (
        <div className="topbar">
            GetBinder
            <div className="topbar-btns">
                <button onClick={handleMinimize} className="topbar-button">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M8 5H0V3H8V5Z" fill="white"/>
                    </svg>
                </button>
                <button onClick={handleClose} className="topbar-button">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2.79823L6.79823 0L8 1.20177L5.20177 4L8 6.79823L6.79823 8L4 5.20177L1.20177 8L0 6.79823L2.79823 4L0 1.20177L1.20177 0L4 2.79823Z" fill="white"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TopBar;