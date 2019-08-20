package controller

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/ConfDynamic/store"
	"github.com/yinxulai/goutils/restful"
)

// Export 对外服务
func Export(ctx iris.Context) {
	identity := ctx.Values().Get("Identity").(string)

	app, err := store.GetApplicationByIdentity(identity)
	if err != nil {
		ctx.JSON(restful.New(restful.NOTFOUND, err.Error(), nil))
		ctx.StatusCode(200)
		return
	}

	// app.MasterConfigIdentity

	// ctx.JSON(restful.New(restful.OK, "", app.OutConfigsReal()))
	// ctx.StatusCode(200)
	// return
}
