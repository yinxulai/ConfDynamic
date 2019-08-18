import React from 'react';
import Store from './store';
import { Button } from 'antd';
import Config from './config';
import ReactDOM from 'react-dom';
import { observer } from "mobx-react";
import styles from './index.module.css';

import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

@observer
class App extends React.Component<any> {

    componentDidMount() {
        Store.fetchConfig()
    }


    render() {
        const { configArray, creatingConfigArray: createConfigArray } = Store

        return (
            <ConfigProvider locale={zhCN}>
                <div className={styles.root}>
                    <div className={styles.title}>
                        配置管理
                </div>
                    <div className={styles.content}>
                        {
                            configArray.map(
                                config => <Config key={config.name} {...config} />
                            )
                        }
                        {
                            createConfigArray.map(
                                config => <Config key={config.name} {...config} isCreate />
                            )
                        }
                    </div>
                    <Button
                        block
                        type="primary"
                        className={styles.savebtn}
                        onClick={Store.addCreatingConfig}
                    >
                        创建
                    </Button>
                </div>
            </ConfigProvider>
        );
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
