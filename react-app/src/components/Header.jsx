import React, {useState} from 'react';
import {MAIN_ROUTE} from "../utils/consts";
import {NavLink} from "react-router-dom";

const Header = ({title}) => {
    const [isStarted, setisStarted] = useState(false)

    const handleStartShortcuts = () => {
        window.api.startShortCuts();
        setisStarted(true);
    };

    const handleStopShortcuts = () => {
        window.api.stopShortCuts();
        setisStarted(false);
    };

    return (
        <header>
            {title}
            {!isStarted ? (
                <button onClick={handleStartShortcuts} className="btn btn-sm btn-success">Запустить</button>
            ) : (
                <button onClick={handleStopShortcuts} className="btn btn-sm btn-red">Остановить</button>
            )}
        </header>
    );
};

export default Header;