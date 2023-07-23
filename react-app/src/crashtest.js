import React, {useEffect, useState} from "@types/react";
import UserItem from "./components/UserItem";

function CrashTest() {
    const [siteBalance, setSiteBalance] = useState(0)
    const [isStarted, setIsStarted] = useState(false)
    const [isEnd, setIsEnd] = useState(false)
    const [nowCoef, setNowCoef] = useState(1)
    const [userList, setUserList] = useState([])
    const [sumBet, setSumBet] = useState(0)
    const [maxCoef, setMaxCoef] = useState(0)
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        setSumBet(userList.reduce((total, item) => total + item.bet, 0))
    }, [userList])

    useEffect(() => {
        setMaxCoef(siteBalance / sumBet)
    }, [sumBet, siteBalance])

    useEffect(() => {
        if (nowCoef >= maxCoef && isStarted) {
            handleEnd()
        }
    }, [nowCoef, maxCoef])



    const users =
        [
            {
                login: 's1mple',
            },
            {
                login: 'electronik',
            },
            {
                login: 'loh',
            },
            {
                login: 'DarkDend',
            },
            {
                login: 'N1TAXE',
            },
            {
                login: 'AlexDaiwer',
            },
            {
                login: 'prokol',
            },
            {
                login: 'nickname',
            },
            {
                login: 'chebur',
            },
            {
                login: 'makeba',
            },
            {
                login: 'autist',
            },
            {
                login: 'daun',
            },
            {
                login: 'kek',
            },
            {
                login: 'lol',
            },
        ]

    const getRandomUser = () => {
        while (true) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const userExists = userList.some(user => user.login === randomUser.login);
            if (!userExists) {
                return randomUser
            }
        }
    }

    const handleAddUserToList = () => {
        const randomUser = getRandomUser()
        const randomBet = Math.floor(Math.random() * 9901) + 100;
        const randomBetCoef = Math.floor(Math.random() * 5) + 1.05;
        setUserList([...userList, { login: randomUser.login, bet: randomBet, coef: randomBetCoef }]);



    };

    const handleStart = () => {
        setIsStarted(true);
        const id = setInterval(() => {
            setNowCoef(prevCoef => prevCoef + 0.001);
        }, 1);
        setIntervalId(id);
    };

    const handleEnd = () => {
        setIsEnd(true)
        clearInterval(intervalId);
        setIntervalId(null);
    };

    return (
        <div className="App">
            <div className="test">
                <span>Баланс сайта: {siteBalance} р</span>
                <br/>
                <span>Сумма ставок: {userList.reduce((total, item) => total + item.bet, 0)} р</span>
                <br/>
                <span>Макс. коэф.: {maxCoef}</span>
                <hr/>
                <div className="result">
                    <h1>{nowCoef.toFixed(2)}</h1>
                    <hr/>
                </div>
                <button onClick={handleAddUserToList}>Добавить ставку</button>
                <button onClick={(e) => {setSiteBalance(prevState => prevState + 1000)}}>Добавить баланс сайту</button>
                <button onClick={(e) => {setSiteBalance(prevState => prevState - 1000)}}>Убавить баланс сайту</button>
                <button disabled={isStarted} onClick={handleStart}>Запустить краш</button>
                <hr/>
                {userList.map((user) => (
                    <UserItem key={user.login} userInfo={user} coef={nowCoef} end={isEnd} isStart={isStarted}/>
                ))}
            </div>
        </div>
    );
}

export default CrashTest;