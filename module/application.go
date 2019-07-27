package module

// Application 应用
type Application struct {
	Name                 string             // 名称
	Disable              bool               // 禁用
	Identity             string             // 唯一标识符
	MasterConfigIdentity string             // 默认 主配置
	Configs              map[string]*Config // 字段
}

func (a *Application) OutConfigsReal() map[string]interface{} {
	data := map[string]interface{}{}

	if len(a.Configs) <= 0 {
		return data
	}

	for _, config := range a.Configs {
		return config.OutReal()
	}

	return data
}
