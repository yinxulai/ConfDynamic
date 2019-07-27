package module

// Field 配置
type Field struct {
	Name     string // 名称
	Type     string
	Identity string      // 唯一标识符
	Value    interface{} // 值
}

func (f *Field) OutReal() map[string]interface{} {
	if f.Type == "Field" {
		value := f.Value.(Field)
		return value.OutReal()
	}

	return map[string]interface{}{f.Name: f.Value}
}
