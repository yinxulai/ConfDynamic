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
    @action.bound
    async fetchConfig(): Promise<void> {
        const result = await this.downloadObject('front.config.json')
        const data: IConfig | IConfig[] = JSON.parse(result)

        if (Array.isArray(data)) {
            this.configMap.clear()
            data.forEach(item =>
                this.configMap.set(item.name, item)
            )
            return
        }

        this.configMap.set(data.name, data)
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
        this.creatingConfigMap.set(name, { name } as IConfig)
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

    // ======= OSS 对象操作 ======= //

    @autobind // 删除对象
    private removeObject(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.createCosClient().deleteObject({
                Key: name,
                Region: 'ap-chengdu',
                Bucket: 'config-1256073177',
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
                Bucket: 'config-1256073177',
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
                    Bucket: 'config-1256073177',
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
            SecretId: 'AKIDC8pKZZykc7MK1RPWDKxEExO8bnjOZtjH',
            SecretKey: '0A4g21jAKEuJRIRIsCGUR8Yn44oPjnaL',
        });
    }
}

export default new Store()
