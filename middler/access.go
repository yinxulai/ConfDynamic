package middler

import (
	"github.com/kataras/iris"
	"github.com/yinxulai/goutils/crypto"
	"github.com/yinxulai/goutils/restful"
)

// TOKENKEY token 加密的k ey
const TOKENKEY = "4MoGcD7PVQnYnPnM"

// Admin 管理员鉴权
func Admin(ctx iris.Context) {
	var err error
	encryptedSession := ctx.GetCookie("Session")                                // 获取用户 Session
	session, err := crypto.RSADecryptWithSha1Base64(encryptedSession, TOKENKEY) // 解密 session
	if err != nil {
		ctx.JSON(restful.New(restful.UNAUTHORIZED, "", nil))
		ctx.StatusCode(200)
	}

	// ctx.Values().Set("info", shareInformation)
	ctx.Next() //继续执行下一个handler，在本例中是mainHandler。
}

// Application 应用鉴权
func Application(ctx iris.Context) {
	version := ctx.GetHeader("Version")
	identity := ctx.GetHeader("Identity")

	// ctx.Values().Set("info", shareInformation)
	ctx.Next() //继续执行下一个handler，在本例中是mainHandler。
}
