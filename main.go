package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
	"github.com/yinxulai/ConfDynamic/controller"
	"github.com/yinxulai/goutils/config"
)

func init() {
	config.SetStandard("port", ":8080", true, "服务监听的端口，默认 :3030")
}

func main() {
	app := iris.New()
	app.Use(logger.New())
	app.Use(recover.New())

	// 对外提供服务
	app.Any("/{appid:string}", controller.Export)
	// 获取配置
	app.Get("/manage/config", controller.GetConfigs)
	// 更新配置
	app.Patch("/manage/config", controller.UpdateConfig)

	port, err := config.Get("port")
	if err != nil {
		panic("请指定 port")
	}

	app.Run(iris.Addr(port))
}
