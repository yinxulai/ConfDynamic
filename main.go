package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
	"github.com/yinxulai/ConfDynamic/controller"
	"github.com/yinxulai/ConfDynamic/store"
	"github.com/yinxulai/goutils/config"
)

func init() {
	config.AddFile("./config.json")
}

func main() {
	store.Init()
	app := iris.New()
	app.Use(logger.New())
	app.Use(recover.New())

	manage := app.Party("/manage")
	manage.Get("/", controller.View)

	manage.Post("/config", controller.CreateConfig)
	manage.Post("/configs", controller.UpdateConfigByName)

	app.Run(iris.Addr(":8080"))
}
