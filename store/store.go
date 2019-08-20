package store

import (
	"sync"

	"github.com/yinxulai/ConfDynamic/module"
	"github.com/yinxulai/goutils/file"
)

var lock sync.Mutex
var cache *[]module.Config
var dataFile = "./configs.json"

// ReadConfig ReadConfig
func ReadConfig() ([]module.Config, error) {
	lock.Lock()
	defer lock.Unlock()

	var err error
	var data []module.Config

	// 没有缓存 读一下文件
	if cache == nil {
		err = file.ReadJSON(dataFile, &data)
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
	lock.Lock()
	defer lock.Unlock()

	var err error
	// 写入文件
	err = file.WriteJSON(dataFile, false, data)
	if err != nil {
		return err
	}

	cache = &data // 更新缓存
	return nil
}
