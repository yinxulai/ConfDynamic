package controller

import "github.com/kataras/iris"

// GetConfig 获取配置信息
func GetConfig(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// SetConfig 设置配置信息
func SetConfig(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
