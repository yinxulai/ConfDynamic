package store

import (
	"context"
	"io"

	"github.com/yinxulai/goutils/config"
)

var currentService *COSService

func init() {
	config.SetStandard("secret-id", "", true, "腾讯云对象存储 secret-id")
	config.SetStandard("secret-key", "", true, "腾讯云对象存储 secret-key")
	config.SetStandard("bucket-url", "", true, "腾讯云对象存储 bucket-url")
}

// Init Init
func Init() {
	currentService = New()
}

// Upload 上传
func Upload(ctx context.Context, name string, data io.Reader) error {
	return currentService.Update(ctx, name, data)
}

// Update 更新
func Update(ctx context.Context, name string, data io.Reader) error {
	return currentService.Update(ctx, name, data)
}

// Rename 重命名
func Rename(ctx context.Context, name string, newName string) error {
	return currentService.Rename(ctx, name, newName)
}

// Copy 拷贝
func Copy(ctx context.Context, sourceName string, targetName string) error {
	return currentService.Copy(ctx, sourceName, targetName)
}
