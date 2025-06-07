import React, {useContext, useEffect, useState} from 'react';
import {BIND_ROUTE} from "../utils/consts";
import {NavLink} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import Header from "../components/Header";

const MainPage = observer(() => {
    const { config } = useContext(Context);
    const [binds, setBinds] = useState([]);

    // Синхронизируем состояние с MobX хранилищем
    useEffect(() => {
        if (config.getConfig?.binds) {
            setBinds(config.getConfig.binds);
        }
    }, [config.getConfig]);

    const handleAddItem = () => {
        // Безопасное вычисление последнего ID
        const lastId = binds.length > 0
            ? Math.max(...binds.map(item => item.id))
            : 0;

        const newItem = {
            id: lastId + 1,
            name: "Новая запись",
            shortcut: null,
        };

        // Создаем обновленный массив
        const updatedBinds = [...binds, newItem];

        // Обновляем состояние и хранилище
        setBinds(updatedBinds);
        config.setConfig({
            ...config.getConfig,
            binds: updatedBinds
        });

        window.api.saveConfigData(JSON.parse(JSON.stringify(config.getConfig)));
    };

    return (
        <React.Fragment>
            <Header title="Мои профили"/>
            <div className="container">
                <button className="btn btn-md btn-dark w100" onClick={handleAddItem}>Создать профиль</button>
                <div className="profile-list">
                    {binds.length > 0 && config.getConfig.binds.map((data) => (
                        <NavLink key={data.id} className="profile-item" to={`${BIND_ROUTE}/${data.id}`}>
                            {data.name}
                            <div className="btn-group">
                                {data.shortcut ? (
                                    <span>{data.shortcut}</span>
                                ) : (
                                    <span className="warning">Не назначено!</span>
                                )}
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.292893 0.292893C0.683417 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683417 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893Z"
                                        fill="inherit"/>
                                </svg>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
})

export default MainPage;