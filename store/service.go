package store

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/tencentyun/cos-go-sdk-v5"
	"github.com/yinxulai/goutils/config"
)

// New 创建一个 COSService
func New() *COSService {
	var err error
	coss := new(COSService)
	coss.SecretID, err = config.Get("secret-id")
	coss.SecretKey, err = config.Get("secret-key")
	bucketURL, err := config.Get("bucket-url")

	fmt.Println(coss.SecretID)
	fmt.Println(coss.SecretKey)
	fmt.Println(bucketURL)

	coss.BucketURL, err = url.Parse(bucketURL)
	if err != nil {
		panic(err)
	}

	coss.Client = cos.NewClient(&cos.BaseURL{BucketURL: coss.BucketURL}, &http.Client{
		Transport: &cos.AuthorizationTransport{
			SecretID:  coss.SecretID,
			SecretKey: coss.SecretKey,
		},
	})

	return coss
}

// COSService 腾讯云 SSO
type COSService struct {
	SecretID  string
	SecretKey string
	BucketURL *url.URL
	Client    *cos.Client
}

// Query 查询
func (srv *COSService) Query(ctx context.Context, name string, data io.Reader) error {
	// var err error
	// result, httpResult, err := srv.Client.Bucket.Get(context.Background(), nil)
	// if err != nil {
	// 	return err
	// }

	// for _, c := range result.Contents {
	// 	fmt.Printf("%s, %d\n", c.Key, c.Size)
	// }

	return nil
}

// Upload 上传
func (srv *COSService) Upload(ctx context.Context, name string, data io.Reader) error {
	var err error
	_, err = srv.Client.Object.Put(context.Background(), name, data, nil)
	if err != nil {
		return err
	}
	return nil
}

// Update 更新
func (srv *COSService) Update(ctx context.Context, name string, data io.Reader) error {
	_, err := srv.Client.Object.Put(context.Background(), name, data, nil)
	if err != nil {
		return err
	}
	return nil
}

// Rename 重命名
func (srv *COSService) Rename(ctx context.Context, name string, newName string) error {
	var err error
	err = srv.Copy(ctx, newName, name)
	if err != nil {
		return err
	}

	// 删除原有文件
	_, err = srv.Client.Object.Delete(ctx, name)
	if err != nil {
		return err
	}

	return nil
}

// Copy 拷贝
func (srv *COSService) Copy(ctx context.Context, sourceName string, targetName string) error {
	var err error
	_, _, err = srv.Client.Object.Copy(context.Background(), targetName, sourceName, nil)
	if err != nil {
		return err
	}
	return nil
}
