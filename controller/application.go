package controller

import "github.com/kataras/iris"

type GetApplicationParameter struct {
}

// GetApplication 获取应用信息
func GetApplication(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// SetApplication 设置应用信息
func SetApplication(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
