import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import ConfigStore from "./store/configStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        config: new ConfigStore(),
    }}>
        <App />
    </Context.Provider>,
);

