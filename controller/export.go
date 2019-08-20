package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/module"
	"github.com/yinxulai/ConfDynamic/store"
)

// Export 对外服务
func Export(ctx iris.Context) {
	var data module.Config
	appid := ctx.Params().GetString("appid")
	if appid == "" {
		ctx.JSON(data)
		return
	}

	configs, err := store.ReadConfig()
	if err != nil {
		ctx.JSON(data)
		return
	}

	for _, config := range configs {
		if config.Name == appid && config.State {
			ctx.JSON(config)
			return
		}
	}

	ctx.JSON(data)
}
