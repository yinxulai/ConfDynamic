package module

// Config 配置
type Config struct {
	Name    string `json:"name"`
	Enable  bool   `json:"enable"`
	Context string `json:"context"`
}
