package main

import (
	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
)

func main() {
	app := iris.New()
	app.Use(logger.New())
	app.Use(recover.New())

	app.Get("/", controller.View)
	app.Get("/config", controller.GetConfig)
	app.Get("/application", controller.GetApplication)
	app.Post("/config", controller.SetConfig)
	app.Post("/application", fcontroller.SetApplication)

	app.Run(iris.Addr(":8080"))
}
