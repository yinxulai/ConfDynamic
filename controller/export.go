package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/store"
)

// Export 对外服务
func Export(ctx iris.Context) {
	appid := ctx.Params().GetString("appid")
	if appid == "" {
		ctx.Text("")
		return
	}

	configs, err := store.ReadConfig()
	if err != nil {
		ctx.Text("")
		return
	}

	for _, config := range configs {
		if config.Name == appid && config.Enable {
			ctx.Text(config.Context)
			return
		}
	}

	ctx.Text("")
}
