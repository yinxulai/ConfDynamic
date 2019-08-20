package store

import (
	"github.com/yinxulai/ConfDynamic/module"
	"github.com/yinxulai/goutils/file"
)

var cache *[]module.Config

// ReadConfig ReadConfig
func ReadConfig() ([]module.Config, error) {
	var err error
	var data []module.Config

	// 没有缓存 读一下文件
	if cache == nil {
		err = file.ReadJSON("./configs.json", &data)
		if err != nil {
			return nil, err
		}
		cache = &data // 更新缓存
	}

	// 直接返回缓存
	return *cache, nil
}

// UpdateConfig UpdateConfig
func UpdateConfig(data []module.Config) error {

	var err error
	// 写入文件
	err = file.WriteJSON("./configs.json", false, data)
	if err != nil {
		return err
	}

	cache = &data // 更新缓存
	return nil
}
