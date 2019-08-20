package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/module"
	"github.com/yinxulai/ConfDynamic/store"
	"github.com/yinxulai/goutils/restful"
)

// GetView 获取配置信息
func GetView(ctx iris.Context) {
	ctx.View("index.html")
}

// GetConfigs 获取配置信息
func GetConfigs(ctx iris.Context) {
	data, err := store.ReadConfig()

	if err != nil {
		ctx.JSON(restful.New(restful.NOTFOUND, err.Error(), nil))
		return
	}

	ctx.JSON(restful.New(restful.OK, "", data))
	return
}

// UpdateConfig 设置配置信息
func UpdateConfig(ctx iris.Context) {
	var err error
	var data []module.Config
	err = ctx.ReadJSON(&data)
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.PARAMERR, err.Error(), nil))
		return
	}

	// 更新文件及缓存
	err = store.UpdateConfig(data)
	if err != nil {
		ctx.JSON(restful.New(restful.NOTFOUND, err.Error(), nil))
		return
	}

	ctx.JSON(restful.New(restful.OK, "", data))
	return
}
