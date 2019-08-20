package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	"github.com/yinxulai/goutils/file"

	"github.com/yinxulai/goutils/random"

	"github.com/yinxulai/ConfDynamic/module"
)

// TODO: 可能用 mysql

type localFileService struct {
	sync.RWMutex
	ConfigCache         map[string]*module.Config
	ConfigFilePath      string
	ApplicationCache    map[string]*module.Application
	ApplicationFilePath string
}

func (s *localFileService) CreateApplication(data *module.Application) error {
	defer s.dumpFile()
	defer s.loadFile()

	for {
		data.Identity = random.String(24)
		has, err := s.HasApplicationByIdentity(data.Identity)
		if err != nil {
			return err
		}
		if !has {
			break
		}
	}

	s.ApplicationCache[data.Identity] = data
	return nil
}

func (s *localFileService) HasApplicationByIdentity(identity string) (bool, error) {
	if s.ApplicationCache[identity] == nil {
		return false, nil
	}

	return true, nil
}

func (s *localFileService) GetApplicationByIdentity(identity string) (*module.Application, error) {
	has, err := s.HasApplicationByIdentity(identity)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, errors.New("应用不存在")
	}

	return s.ApplicationCache[identity], nil

}

func (s *localFileService) UpdateApplicationByIdentity(identity string, data *module.Application) error {
	defer s.dumpFile()
	defer s.loadFile()

	has, err := s.HasApplicationByIdentity(identity)
	if err != nil {
		return err
	}

	if !has {
		return errors.New("应用不存在")
	}

	data.Identity = identity
	s.ApplicationCache[identity] = data
	return nil
}

func (s *localFileService) CreateConfig(data *module.Config) error {
	defer s.dumpFile()
	defer s.loadFile()

	for {
		data.Identity = random.String(24)
		has, err := s.HasConfigByIdentity(data.Identity)
		if err != nil {
			return err
		}

		if !has {
			break
		}
	}

	s.ConfigCache[data.Identity] = data
	return nil
}

func (s *localFileService) HasConfigByIdentity(identity string) (bool, error) {
	if s.ConfigCache[identity] == nil {
		return false, nil
	}

	return true, nil
}

func (s *localFileService) GetConfigByIdentity(identity string) (*module.Config, error) {
	has, err := s.HasConfigByIdentity(identity)
	if err != nil {
		return nil, err
	}

	if !has {
		return nil, errors.New("配置不存在")
	}

	return s.ConfigCache[identity], nil
}

func (s *localFileService) UpdateConfigByIdentity(identity string, data *module.Config) error {
	defer s.dumpFile()
	defer s.loadFile()

	has, err := s.HasConfigByIdentity(identity)
	if err != nil {
		return err
	}

	if !has {
		return errors.New("配置不存在")
	}

	data.Identity = identity
	s.ConfigCache[identity] = data
	return nil
}

func (s *localFileService) loadFile() error {
	var err error

	// s.RLock()
	// defer s.RUnlock()

	err = file.ReadJSON(s.ConfigFilePath, s.ConfigCache)
	err = file.ReadJSON(s.ApplicationFilePath, s.ApplicationCache)

	return err
}

func (s *localFileService) dumpFile() error {
	var err error

	// s.RLocker()
	// defer s.RUnlock()

	configData, err := json.Marshal(s.ConfigCache)
	ApplicationData, err := json.Marshal(s.ApplicationCache)

	err = file.WriteByte(s.ConfigFilePath, false, configData)
	err = file.WriteByte(s.ApplicationFilePath, false, ApplicationData)

	fmt.Println(err)
	return err
}
