import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useParams, useNavigate } from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {MAIN_ROUTE} from "../utils/consts";
import Header from "./Header";

const BindItem = observer(() => {
    const {id} = useParams()
    const {config} = useContext(Context)
    const [foundConfigItem, setFound] = useState(null);
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(true)
    const [shortCut, setShortCut] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const item = config.getConfig.binds.find((item) => item.id === Number(id));
        setFound(item)
    }, [id, config.getConfig])

    function getCombinationFromKeyCode(keyCode, event) {
        event.preventDefault()
        const { ctrlKey, shiftKey, altKey } = event;
        const keys = [];
        // Проверяем, нажат ли CTRL
        if (ctrlKey || shiftKey || altKey) {
            if (ctrlKey) {
                keys.push("CTRL");
            }

            // Проверяем, нажат ли SHIFT
            if (shiftKey) {
                keys.push("SHIFT");
            }

            // Проверяем, нажат ли ALT
            if (altKey) {
                keys.push("ALT");
            }
            const key = String.fromCharCode(keyCode);

            if (key != '\u0011') {
                keys.push(key);
                return keys.join('+').toString()
            } else {
                return null
            }
        } else {
            return String.fromCharCode(keyCode)
        }
    }

    const handleKeyDown = (e) => {
        const keyCode = e.keyCode || e.which;
        const combination = getCombinationFromKeyCode(keyCode, e);
        if (combination) {
            return setShortCut(combination)
        }
        return null
    };

    const handleDelete = () => {
        const updatedConfig = config.getConfig.binds.filter(item => item.id !== foundConfigItem.id);
        config.setConfig({
            ...config.getConfig,
            binds: updatedConfig
        });
        window.api.saveConfigData(JSON.parse(JSON.stringify(config.getConfig)));
        navigate(MAIN_ROUTE);
    }

    const handleSaveConfig = () => {
        const updatedConfig = config.getConfig.binds.map(item => {
            if (item.id === foundConfigItem.id) {
                return { ...item, id: Number(id), name: name, shortcut: shortCut };
            } else {
                return item;
            }
        });
        config.setConfig({
            ...config.getConfig,
            binds: updatedConfig
        });
        // Вызываем функцию из основного процесса Electron для сохранения данных в файл
        window.api.saveConfigData(JSON.parse(JSON.stringify(config.getConfig)));
        navigate(MAIN_ROUTE);
    };

    useEffect(() => {
        if (foundConfigItem && loading) {
            setName(foundConfigItem.name);
            setShortCut(foundConfigItem.shortcut);
            setLoading(false)
        }
    }, [foundConfigItem]);

    if (loading) {
        return (<>Loading...</>)
    }

    return (
        <React.Fragment>
            <Header title={`Настройки`}/>
            <div className="container">
                <div className="top-header">
                    Настройки: {foundConfigItem.name}
                    <NavLink className="link-back" to={MAIN_ROUTE}>
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.70711 0.292893C6.31658 -0.0976311 5.68342 -0.0976311 5.29289 0.292893L0.292893 5.29289C-0.097631 5.68342 -0.097631 6.31658 0.292893 6.70711L5.29289 11.7071C5.68342 12.0976 6.31658 12.0976 6.70711 11.7071C7.09763 11.3166 7.09763 10.6834 6.70711 10.2929L2.41421 6L6.70711 1.70711C7.09763 1.31658 7.09763 0.683417 6.70711 0.292893Z" fill="white"/>
                        </svg>
                        Вернуться
                    </NavLink>
                </div>
                <div className="input__group">
                    <div className="input__item">
                        <label htmlFor="name">Название профиля</label>
                        <input name="name" value={name} onChange={(e) => setName(e.target.value)} type="text"/>
                    </div>
                    <div className="input__item">
                        <label htmlFor="shortcut">Комбинация клавиш</label>
                        <input name="shortcut" placeholder={!shortCut && 'Клавиша не назначена'} value={shortCut} onKeyDown={handleKeyDown} type="text"/>
                    </div>
                </div>
                <div className="btn-group">
                    <button className="btn btn-md btn-success w100" onClick={handleSaveConfig}>Сохранить</button>
                    <button className="btn btn-md btn-icon btn-red w100" onClick={handleDelete}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.4167 2.88H12.0833V1.28C12.0833 0.574 11.5602 0 10.9167 0H5.08333C4.43984 0 3.91667 0.574 3.91667 1.28V2.88H1.58333C1.26068 2.88 1 3.166 1 3.52V4.16C1 4.248 1.06562 4.32 1.14583 4.32H2.24687L2.69714 14.78C2.7263 15.462 3.24036 16 3.86198 16H12.138C12.7615 16 13.2737 15.464 13.3029 14.78L13.7531 4.32H14.8542C14.9344 4.32 15 4.248 15 4.16V3.52C15 3.166 14.7393 2.88 14.4167 2.88ZM10.7708 2.88H5.22917V1.44H10.7708V2.88Z" fill="white"/>
                        </svg>
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
});

export default BindItem;