import { IConfig } from "./config"
import autobind from 'autobind-decorator';
import { action, ObservableMap, observable, computed } from 'mobx';
import { async } from "q";

const COS = require('cos-js-sdk-v5');

export class Store {

    @observable.ref
    configMap = new ObservableMap<string, IConfig>()

    @computed
    get configArray() {
        return [...this.configMap.values()]
    }

    // 获取配置
    @autobind
    async fetchConfig(): Promise<void> {
        const data = await this.downloadObject('front.config.json')
        return this.updateConfig(data)
    }

    // 更新配置
    @autobind
    async saveConfig(data?: IConfig): Promise<void> {
        const body = JSON.stringify(data || this.configArray)
        return await this.uploadObject('front.config.json', body)
    }

    //启用配置
    @autobind
    async ensableConfig(name: string) {
        const config = { ...this.configMap.get(name), enable: true } as IConfig
        this.configMap.set(name, config)
        const request = await Promise.all([
            this.uploadObject(name, JSON.stringify(config)),
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

    @action.bound
    private updateConfig(data: IConfig | IConfig[]) {
        if (Array.isArray(data)) {
            this.configMap.clear()
            data.forEach(item =>
                this.configMap.set(item.name, item)
            )
            return
        }

        this.configMap.set(data.name, data)
    }


    @autobind // 删除对象
    private removeObject(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.createCosClient().putObject({
                Key: name,
                Region: 'ap-chengdu',
                Bucket: 'backup-1251578600',
            }, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }


    @autobind // 更新上传对象
    private uploadObject(name: string, context: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createCosClient().putObject({
                Body: context,
                Region: 'ap-chengdu',
                Key: 'front.config.json',
                Bucket: 'backup-1251578600',
            }, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
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
                        resolve(data)
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