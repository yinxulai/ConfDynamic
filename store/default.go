package store

import "github.com/yinxulai/ConfDynamic/module"

var currentService Service

func init() {
	currentService = new(localFileService)
}

// Service 负责存储
type Service interface {
	CreateApplication(*module.Application) error
	HasApplicationByIdentity(string) (bool, error)
	GetApplicationByIdentity(string) (*module.Application, error)
	UpdateApplicationByIdentity(string, *module.Application) error

	CreateConfig(*module.Config) error
	HasConfigByIdentity(string) (bool, error)
	GetConfigByIdentity(string) (*module.Config, error)
	UpdateConfigByIdentity(string, *module.Config) error
}

func CreateApplication(data *module.Application) error {
	return currentService.CreateApplication(data)
}

func HasApplicationByIdentity(identity string) (bool, error) {
	return currentService.HasApplicationByIdentity(identity)
}

func GetApplicationByIdentity(identity string) (*module.Application, error) {
	return currentService.GetApplicationByIdentity(identity)
}

func UpdateApplicationByIdentity(identity string, data *module.Application) error {
	return currentService.UpdateApplicationByIdentity(identity, data)
}

func CreateConfig(data *module.Config) error {
	return currentService.CreateConfig(data)
}

func HasConfigByIdentity(identity string) (bool, error) {
	return currentService.HasConfigByIdentity(identity)
}

func GetConfigByIdentity(identity string) (*module.Config, error) {
	return currentService.GetConfigByIdentity(identity)
}

func UpdateConfigByIdentity(identity string, data *module.Config) error {
	return currentService.UpdateConfigByIdentity(identity, data)
}
