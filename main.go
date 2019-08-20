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
	app.Any("/{appid:string}", controller.Export)
	// 获取配置
	app.Get("/manage/config", controller.GetConfigs)
	// 更新配置
	app.Patch("/manage/config", controller.UpdateConfig)

	app.Run(iris.Addr(":8080"))
}
