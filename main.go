package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
	"github.com/yinxulai/ConfDynamic/controller"
)

func main() {
	app := iris.New()
	app.Use(logger.New())
	app.Use(recover.New())

	// 对外提供服务
	app.Any("/", middler.Application, controller.Export)

	manage := app.Party("/manage")
	// 获取配置
	manage.Get("/config", middler.Admin, controller.GetConfigs)
	// 更新配置
	manage.Patch("/config", middler.Admin, controller.UpdateConfig)

	app.Run(iris.Addr(":8080"))
}
