import React, {useEffect, useState} from 'react';

const UserItem = ({coef, userInfo, end, isStart}) => {
    const [res, setRes] = useState("В игре...")
    const [isWin, setIsWin] = useState(false)

    useEffect(() => {
        if (coef >= userInfo.coef && isStart && !isWin) {
            setRes(`Сумма выигрыша: ${userInfo.bet * coef} р`)
            setIsWin(true)
        }
    }, [coef, userInfo.coef])

    useEffect(() => {
        if (end && !isWin) {
            setRes(`Сумма проигрыша: ${userInfo.bet} р`)
            console.log('end');
        }
    }, [end])

    return (
        <React.Fragment>
            <div className="user-item">
                <span>Игрок: {userInfo.login}</span>
                <br/>
                <span>Желаемый кэф: {userInfo.coef}</span>
                <br/>
                <span>Ставка: {userInfo.bet} р</span>
                <React.Fragment>
                    <br/>
                    <span>{res}</span>
                </React.Fragment>
            </div>
            <hr/>
        </React.Fragment>
    );
};

export default UserItem;