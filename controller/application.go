package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/module"
	"github.com/yinxulai/ConfDynamic/store"
	"github.com/yinxulai/goutils/restful"
)

// GetApplications 获取应用信息
func GetApplications(ctx iris.Context) {
}

// CreateApplicationParams 参数
type CreateApplicationParams struct {
	Name *string // 名称
}

// CreateApplication 创建应用信息
func CreateApplication(ctx iris.Context) {
	var err error
	params := new(CreateApplicationParams)
	createParams := new(module.Application)
	ctx.ReadJSON(params)

	createParams.Name = *params.Name
	if err = store.CreateApplication(createParams); err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	ctx.JSON(restful.New(restful.OK, "创建成功", nil))
	ctx.StatusCode(200)
}

// GetApplicationByIdentityParams 参数
type GetApplicationByIdentityParams struct {
	Name *string // 名称
}

// GetApplicationByIdentity 获取应用信息
func GetApplicationByIdentity(ctx iris.Context) {
	var has bool
	var err error
	var app *module.Application
	identity := ctx.Params().Get("identity")

	if has, err = store.HasApplicationByIdentity(identity); err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	if !has {
		ctx.JSON(restful.New(restful.NOTFOUND, "该应用不存在", nil))
		ctx.StatusCode(200)
		return
	}

	if app, err = store.GetApplicationByIdentity(identity); err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	ctx.JSON(restful.New(restful.OK, "", app))
	ctx.StatusCode(200)
}

// UpdateApplicationByIdentityParams 参数
type UpdateApplicationByIdentityParams struct {
	Name                 *string // 名称
	Disable              *bool   // 禁用
	MasterConfigIdentity *string // 默认 主配置
}

// UpdateApplicationByIdentity 设置应用信息
func UpdateApplicationByIdentity(ctx iris.Context) {
	var has bool
	var err error
	var app *module.Application
	identity := ctx.Params().Get("identity")
	params := new(UpdateApplicationByIdentityParams)

	ctx.ReadJSON(params)

	if has, err = store.HasApplicationByIdentity(identity); err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	if !has {
		ctx.JSON(restful.New(restful.NOTFOUND, "该应用不存在", nil))
		ctx.StatusCode(200)
		return
	}

	originApp, err := store.GetApplicationByIdentity(identity)
	if err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
	}

	if params.Name != nil {
		originApp.Name = *params.Name
	}

	if params.Disable != nil {
		originApp.Disable = *params.Disable
	}

	if params.MasterConfigIdentity != nil {
		originApp.MasterConfigIdentity = *params.MasterConfigIdentity
	}

	if err = store.UpdateApplicationByIdentity(identity, originApp); err != nil {
		ctx.JSON(restful.New(restful.SERVERERR, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	ctx.JSON(restful.New(restful.OK, "", app))
	ctx.StatusCode(200)
}
