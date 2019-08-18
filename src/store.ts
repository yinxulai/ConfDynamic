import autobind from 'autobind-decorator';
import { action, ObservableMap, observable, computed } from 'mobx';

const COS = require('cos-js-sdk-v5');


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
    @autobind
    async fetchConfig(): Promise<void> {
        const data = await this.downloadObject('front.config.json')
        return this.updateLocalConfigMap(JSON.parse(data))
    }

    // 更新配置
    @autobind
    async saveConfig(data?: IConfig): Promise<void> {
        const body = JSON.stringify(data || this.configArray)
        await this.uploadObject('front.config.json', body)
        this.fetchConfig()
    }

    // ======= 对线上数据的操作 ======= //

    //启用配置
    @autobind
    async ensableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: true } as IConfig
        this.configMap.set(name, config)
        const request = await Promise.all([
            this.uploadObject(name, config.context),
            this.uploadObject('front.config.json', JSON.stringify(this.configArray))
        ])

        this.fetchConfig()
        return request
    }

    // 禁用配置
    @autobind
    async disableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: false } as IConfig
        this.configMap.set(name, config)
        const request = await Promise.all([
            this.removeObject(name),
            this.uploadObject('front.config.json', JSON.stringify(this.configArray))
        ])

        this.fetchConfig()
        return request
    }

    // 删除配置
    @autobind
    async removeConfig(name: string) {
        const configMap = this.configMap.toJS()
        configMap.delete(name)
        this.updateLocalConfigMap([...configMap.values()])
        await this.saveConfig()
        await this.removeObject(name)
    }

    //  更新配置
    @autobind
    async updateConfig(name: string, data: IConfig) {
        this.updateLocalConfigMap(data)
        await this.saveConfig()
        !data.enable
            ? this.removeObject(name)
            : this.uploadObject(data.name, data.context)

    }

    // ======= 对编辑中的数据操作 ======= //  

    @computed
    get creatingConfigArray() {
        return [...this.creatingConfigMap.values()]
    }

    @action.bound
    addCreatingConfig() {
        const name = `新配置-${this.creatingConfigMap.size}`
        this.creatingConfigMap.set(name, { name } as IConfig)
    }

    @action.bound
    removeCreatingConfig(name: string) {
        this.creatingConfigMap.delete(name)
    }

    @action.bound
    async saveCreatingConfig(name: string, data: IConfig) {
        this.creatingConfigMap.delete(name)
        this.updateLocalConfigMap(data)
        await this.saveConfig()
    }

    @action.bound
    updateLocalConfigMap(data: IConfig | IConfig[]) {
        if (Array.isArray(data)) {
            this.configMap.clear()
            data.forEach(item =>
                this.configMap.set(item.name, item)
            )
            return
        }

        this.configMap.set(data.name, data)
    }

    // ======= OSS 对象操作 ======= // 

    @autobind // 删除对象
    private removeObject(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.createCosClient().deleteObject({
                Key: name,
                Region: 'ap-chengdu',
                Bucket: 'backup-1251578600',
            }, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.Body)
                }
            })
        })
    }

    @autobind // 更新上传对象
    private uploadObject(name: string, context: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createCosClient().putObject({
                Key: name,
                Body: context,
                Region: 'ap-chengdu',
                Bucket: 'backup-1251578600',
            }, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data.Body)
                }
            })
        })
    }

    @autobind //  下载对象
    private downloadObject(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createCosClient()
                .getObject({
                    Key: name,
                    Region: 'ap-chengdu',
                    Bucket: 'backup-1251578600',
                }, (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data.Body)
                    }
                })
        })
    }

    @autobind // 创建连接
    private createCosClient(secretId?: string, secretKey?: string, bucketUrl?: string): any {
        return new COS({
            SecretId: 'AKIDa7TeeVsg093rMgM6A2j060lKhttitPFw',
            SecretKey: 'iFbljdLrD8rPmzd6NTREpFTTIwOuJYdg',
        });
    }
}

export default new Store()