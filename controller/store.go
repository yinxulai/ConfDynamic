package controller

// Store 负责存储
type Store interface {
	Get() (interface{}, error) // 获取
	Update(interface{}) error  // 更新
}
