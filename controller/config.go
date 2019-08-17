package controller

import (
	"context"
	"strings"
	"time"

	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/store"
	"github.com/yinxulai/goutils/restful"
)

// QueryConfigParams 创建配置
type QueryConfigParams struct {
	Name    string // 名称
	Context string // 内容
}

// QueryConfig 获取配置信息
func QueryConfig(ctx iris.Context) {
	var err error
	params := new(QueryConfigParams)
	err = ctx.ReadJSON(params)
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.PARAMERR, err.Error(), nil))
		return
	}

	cotx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = store.Upload(cotx, params.Name, strings.NewReader(params.Context))
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.INTERNALSERVERERROR, err.Error(), nil))
		return
	}

	ctx.JSON(restful.New(restful.OK, "创建成功", nil))
}

// CreateConfigParams 创建配置
type CreateConfigParams struct {
	Name    string // 名称
	Context string // 内容
}

// CreateConfig 获取配置信息
func CreateConfig(ctx iris.Context) {
	var err error
	params := new(CreateConfigParams)
	err = ctx.ReadJSON(params)
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.PARAMERR, err.Error(), nil))
		return
	}

	cotx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = store.Upload(cotx, params.Name, strings.NewReader(params.Context))
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.INTERNALSERVERERROR, err.Error(), nil))
		return
	}

	ctx.JSON(restful.New(restful.OK, "创建成功", nil))
}

// UpdateConfigByNameParams 创建配置
type UpdateConfigByNameParams struct {
	Name    string // 名称
	Context string // 内容
}

// UpdateConfigByName 设置配置信息
func UpdateConfigByName(ctx iris.Context) {
	params := new(UpdateConfigByNameParams)
	err := ctx.ReadJSON(params)
	if err != nil {
		// 参数错误
		ctx.JSON(restful.New(restful.PARAMERR, err.Error(), nil))
		return
	}

}
