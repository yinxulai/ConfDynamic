import { IConfig } from "./config"
import autobind from 'autobind-decorator';
import { action, ObservableMap, observable, computed } from 'mobx';

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
    fetchConfig() {
        this.createCosClient()
            .getObject({
                Bucket: 'examplebucket-1250000000',
                Region: 'ap-beijing',
                Key: 'front.config.json',
            }, function (err: any, data: any) {
                console.log(err || data.Body);
            })
    }

    // 更新配置
    @autobind
    saveConfig(data?: IConfig) {
        this.createCosClient().putObject({
            Bucket: 'examplebucket-1250000000', /* 必须 */
            Region: 'ap-beijing',    /* 必须 */
            Key: 'picture.jpg',              /* 必须 */
            Body: 'hello!',
        }, function (err: any, data: any) {
            console.log(err || data);
        });
    }

    //启用配置
    @autobind
    ensableConfig(name: string) {
        const data = { ...this.configMap.get(name), enable: true } as IConfig
        this.configMap.set(name, data)
    }

    // 禁用配置
    @autobind
    disableConfig(name: string) {
        const data = { ...this.configMap.get(name), enable: false } as IConfig
        this.configMap.set(name, data)
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

    @autobind // 获取临时 token
    private fetchTmpToken() {

    }

    @autobind // 创建连接
    private createCosClient(secretId?: string, secretKey?: string, bucketUrl?: string): any {
        return new COS({
            SecretId: 'COS_SECRETID',
            SecretKey: 'COS_SECRETKEY',
        });
    }
}

export default new Store()