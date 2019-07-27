package module

// Config 配置
type Config struct {
	Name     string            // 名称
	Identity string            // 唯一标识符
	Fields   map[string]*Field // 字段
}

func (c *Config) OutReal() map[string]interface{} {
	data := map[string]interface{}{}

	if len(c.Fields) <= 0 {
		return data
	}

	for _, field := range c.Fields {
		return field.OutReal()
	}
	return data
}
