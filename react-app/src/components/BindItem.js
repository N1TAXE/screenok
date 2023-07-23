import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
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

    useEffect(() => {
        const item = config.getConfig.find((item) => item.id === Number(id));
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

    const handleSaveConfig = () => {
        const updatedConfig = config.getConfig.map(item => {
            if (item.id === foundConfigItem.id) {
                return { ...item, id: Number(id), name: name, shortcut: shortCut };
            } else {
                return item;
            }
        });
        config.setConfig(updatedConfig);
        // Вызываем функцию из основного процесса Electron для сохранения данных в файл
        window.api.saveConfigData(JSON.parse(JSON.stringify(config.getConfig)));
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
                        <input name="shortcut" value={shortCut} onKeyDown={handleKeyDown} type="text"/>
                    </div>
                </div>
                <button className="btn btn-md btn-success w100" onClick={handleSaveConfig}>Сохранить</button>
            </div>
        </React.Fragment>
    );
});

export default BindItem;