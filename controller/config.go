package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/goutils/file"
)

// GetConfigs 获取配置信息
func GetConfigs(ctx iris.Context) {
	var data [1]module.Config

	file.ReadJSON("./configs.json", &data)

	ctx.ServeFile("./public/index.html", false)
}

// UpdateConfig 设置配置信息
func UpdateConfig(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
