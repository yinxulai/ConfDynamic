import DB from './s3'
import autobind from 'autobind-decorator';
import { action, ObservableMap, observable, computed } from 'mobx';

export type IConfig = {
    name: string
    context: string
    enable: boolean
}

export class Store extends DB {

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
        const result = await fetch('http://119.28.193.246/manage/config')
        console.log(result)
        // result.map(config => {
        //     this.configMap.set(config.name, config)
        // })
    }

    // 更新配置
    @autobind
    async saveConfig(data?: IConfig | IConfig[]): Promise<void> {
        if (!data) {
            await this.uploadObject('front.config.json', JSON.stringify(this.configArray))
            this.fetchConfig()
            return
        }

        if (Array.isArray(data)) {
            await this.uploadObject('front.config.json', JSON.stringify(data))
            this.fetchConfig()
            return
        }

        const body = this.configMap.toJS().set(data.name, data)
        await this.uploadObject('front.config.json', JSON.stringify([...body.values()]))
        this.fetchConfig()
    }

    // ======= 对线上数据的操作 ======= //

    //启用配置
    @autobind
    async ensableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: true } as IConfig

        const request = await Promise.all([
            this.saveConfig(config),
            this.uploadObject(name, config.context)
        ])

        this.fetchConfig()
        return request
    }

    // 禁用配置
    @autobind
    async disableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: false } as IConfig

        const request = await Promise.all([
            this.removeObject(name),
            this.saveConfig(config)
        ])

        this.fetchConfig()
        return request
    }

    // 删除配置
    @autobind
    async removeConfig(name: string) {
        const configs = this.configMap.toJS()
        configs.delete(name)

        const request = await Promise.all([
            this.removeObject(name),
            this.saveConfig([...configs.values()])
        ])

        this.fetchConfig()
        return request
    }

    //  更新配置
    @autobind
    async updateConfig(data: IConfig) {
        await this.saveConfig(data)
        const request = await !data.enable
            ? this.removeObject(data.name)
            : this.uploadObject(data.name, data.context)

        this.fetchConfig()
        return request
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