import {BIND_ROUTE, MAIN_ROUTE} from "./utils/consts";
import BindItem from "./components/BindItem";
import MainPage from "./Pages/MainPage";

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: MainPage
    },
    {
        path: BIND_ROUTE + '/:id',
        Component: BindItem
    },
]