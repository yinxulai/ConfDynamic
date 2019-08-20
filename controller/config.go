package controller

import "github.com/kataras/iris"

// CreateConfig 获取配置信息
func CreateConfig(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// UpdateConfigByIdentity 设置配置信息
func UpdateConfigByIdentity(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}

// GetConfigByIdentity 获取配置信息
func GetConfigByIdentity(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
