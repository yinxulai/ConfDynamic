import autobind from 'autobind-decorator';
import { action, ObservableMap, observable, computed } from 'mobx';

export type IConfig = {
    name: string
    context: string
    enable: boolean
}


export class Store {

    @observable.ref
    configMap = new ObservableMap<string, IConfig>()

    @observable.ref
    creatingConfigMap = new ObservableMap<string, IConfig>()

    @computed
    get configArray() {
        return [...this.configMap.values()]
    }

    // ======= 对配置的基本操作 ======= //

    // 获取配置
    @action.bound
    async fetchConfig(): Promise<void> {
        const result = await fetch('/manage/config')
        const { Data } = await result.json()
        this.configMap.clear()
        Data.forEach((config: IConfig) => {
            this.configMap.set(config.name, config)
        })
    }


    // 更新配置
    @autobind
    async saveConfig(data?: IConfig | IConfig[]): Promise<void> {
        let body = null

        if (!data) {
            // 没有数据
            body = JSON.stringify(this.configArray.slice())
        }

        // 数组
        if (data && Array.isArray(data)) {
            body = JSON.stringify(data)
        }


        if (data && !Array.isArray(data)) {
            // 单条数据
            const map = this.configMap.toJS().set(data.name, data)
            body = JSON.stringify([...map.values()])
        }


        await fetch("/manage/config", { method: 'PATCH', body })
        this.fetchConfig()
    }

    // ======= 对线上数据的操作 ======= //

    //启用配置
    @autobind
    async ensableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: true } as IConfig
        return await this.saveConfig(config)
    }

    // 禁用配置
    @autobind
    async disableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: false } as IConfig
        return await this.saveConfig(config)
    }

    // 删除配置
    @autobind
    async removeConfig(name: string) {
        const configs = this.configMap.toJS()
        configs.delete(name)
        return await this.saveConfig([...configs.values()])
    }

    //  更新配置
    @autobind
    async updateConfig(data: IConfig) {
        await this.saveConfig(data)
    }

    // ======= 对编辑中的数据操作 ======= //

    @computed
    get creatingConfigArray() {
        return [...this.creatingConfigMap.values()]
    }

    @action.bound
    addCreatingConfig() {
        const name = `新配置-${this.creatingConfigMap.size}`
        this.creatingConfigMap.set(name, { name: name } as IConfig)
    }

    @action.bound
    removeCreatingConfig(name: string) {
        this.creatingConfigMap.delete(name)
    }

    @action.bound
    async saveCreatingConfig(name: string, data: IConfig) {
        this.creatingConfigMap.delete(name)
        return this.saveConfig(data)
    }

}

export default new Store()