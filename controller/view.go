package controller

import "github.com/kataras/iris"

// View 应用
func View(ctx iris.Context) {
	ctx.ServeFile("./public/index.html", false)
}
