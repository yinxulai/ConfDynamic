package main

import (
	"fmt"

	"github.com/kataras/iris"
	"github.com/kataras/iris/middleware/logger"
	"github.com/kataras/iris/middleware/recover"
	"github.com/yinxulai/ConfDynamic/controller"
	"github.com/yinxulai/goutils/config"
)

func init() {
	config.SetStandard("port", ":8080", true, "服务监听的端口，默认 :3030")
	config.SetStandard("view", "./", true, "前端静态文件位置 默认 ./")
}

func main() {
	app := iris.New()
	initStaticDir(app)
	app.Use(logger.New())
	app.Use(recover.New())

	// 控制页面
	app.Get("/manage", controller.GetView)

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

func initStaticDir(app *iris.Application) {
	path, _ := config.Get("view")
	fmt.Println(path)
	app.HandleDir("/static", path+"/static")
	app.RegisterView(iris.HTML(path, ".html"))
}
