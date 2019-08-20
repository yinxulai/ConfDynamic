package module

// Application 应用
type Application struct {
	Name                 string            // 名称
	Disable              bool              // 禁用
	Identity             string            // 唯一标识符
	MasterConfigIdentity string            // 默认 主配置
	Configs              map[string]string // 字段
}
