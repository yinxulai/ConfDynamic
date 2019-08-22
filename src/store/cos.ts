import autobind from 'autobind-decorator';

const COS = require('cos-js-sdk-v5');

export default class Cos {

    @autobind // 删除对象
    removeObject(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.createCosClient().deleteObject({
                Key: name,
                Region: 'ap-tokyo',
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
    uploadObject(name: string, context: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createCosClient().putObject({
                Key: name,
                Body: context,
                Region: 'ap-tokyo',
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
    downloadObject(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createCosClient()
                .getObject({
                    Key: name,
                    Region: 'ap-tokyo',
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
    createCosClient(secretId?: string, secretKey?: string, bucketUrl?: string): any {
        return new COS({
            SecretId: '',
            SecretKey: '',
        });
    }
}
