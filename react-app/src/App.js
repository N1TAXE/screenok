import './style/css/style.css';
import {HashRouter} from "react-router-dom";
import React, {useEffect, useContext} from "react";
import AppRouter from "./components/AppRouter";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import Header from "./components/Header";

const App = observer(() => {
    const {config} = useContext(Context);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'config-data') {
                config.setConfig(event.data.payload)
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [config]);

    return (
        <HashRouter>
            <AppRouter/>
        </HashRouter>
    );
})

export default App;
