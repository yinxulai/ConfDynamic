package controller

import "github.com/kataras/iris"

// GetConfigs 获取配置信息
func GetConfigs(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// UpdateConfig 设置配置信息
func UpdateConfig(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
