package controller

import (
	"github.com/kataras/iris"
)

// GetApplications 获取应用信息
func GetApplications(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// CreateApplicationParameter 参数
type CreateApplicationParameter struct {
}

// CreateApplication 创建应用信息
func CreateApplication(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// GetApplicationByIdentityParameter 参数
type GetApplicationByIdentityParameter struct {
}

// GetApplicationByIdentity 获取应用信息
func GetApplicationByIdentity(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// UpdateApplicationByIdentityParameter 参数
type UpdateApplicationByIdentityParameter struct {
}

// UpdateApplicationByIdentity 设置应用信息
func UpdateApplicationByIdentity(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
