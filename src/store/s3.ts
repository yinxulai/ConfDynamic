import SDK from 'aws-sdk';
import autobind from 'autobind-decorator';

export default class S3 {

    @autobind // 删除对象
    removeObject(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.createS3Client().deleteObject({
                Key: name,
                Bucket: 'cname.configs-manage.com'
            }, (err) => {
                if (err) {
                    reject(err.message)
                } else {
                    resolve()
                }
            })
        })
    }

    @autobind // 更新上传对象
    uploadObject(name: string, context: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createS3Client().putObject({
                Key: name,
                Body: context,
                ACL: 'public-read',
                Bucket: 'cname.configs-manage.com',
            }, (err, data) => {
                if (err) {
                    reject(err.message)
                } else {
                    resolve()
                }
            })
        })
    }

    @autobind //  下载对象
    downloadObject(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createS3Client().getObject({
                Key: name,
                Bucket: 'cname.configs-manage.com'
            }, (err, data) => {
                if (err) {
                    reject(err.message)
                } else {
                    resolve(data.Body)
                }
            })
        })
    }

    @autobind // 创建连接
    createS3Client(): SDK.S3 {
        // AWS S3
        return new SDK.S3({
            region: 'ap-southeast-1',
            accessKeyId: 'AKIAINF2QWPZY6OB4ZSQ',
            secretAccessKey: '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',
        })
    }
}

