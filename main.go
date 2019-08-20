package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
	"github.com/yinxulai/ConfDynamic/controller"
	"github.com/yinxulai/ConfDynamic/middler"
)

func main() {
	app := iris.New()
	app.Use(logger.New())
	app.Use(recover.New())

	// 对外提供服务
	app.Any("/", middler.Application, controller.Export)

	manage := app.Party("/manage")
	manage.Get("/", controller.View)

	manage.Get("/config", middler.Admin, controller.GetConfig)
	manage.Get("/configs", middler.Admin, controller.GetConfigs)
	manage.Patch("/config", middler.Admin, controller.UpdateConfig)

	manage.Get("/applications", middler.Admin, controller.GetApplications)
	manage.Post("/application", middler.Admin, controller.CreateApplication)
	manage.Get("/application/{identity: string}", middler.Admin, controller.GetApplicationByIdentity)
	manage.Patch("/application/{identity: string}", middler.Admin, controller.UpdateApplicationByIdentity)

	app.Run(iris.Addr(":8080"))
}
