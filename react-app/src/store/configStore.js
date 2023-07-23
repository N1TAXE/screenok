import {makeAutoObservable} from "mobx";

export default class ConfigStore {
    constructor() {
        this._config = []
        makeAutoObservable(this)
    }

    setConfig(config) {
        this._config = config
    }

    get getConfig() {
        return this._config
    }
}