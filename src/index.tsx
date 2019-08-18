import React from 'react';
import Store from './store';
import ReactDOM from 'react-dom';
import { observer } from "mobx-react";
import styles from './index.module.css';
import Config, { IConfig } from './config';


type State = {
    configs: IConfig[]
}

@observer
class App extends React.Component<any, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            configs: [
                {
                    name: "1",
                    context: "2312",
                    enable: false
                },
                {
                    name: "213",
                    context: "31231",
                    enable: true
                },
            ]
        }
    }


    componentDidMount() {
        Store.fetchConfig()
    }

    render() {
        const { configArray: array } = Store

        return (
            <div className={styles.root}>
                <div className={styles.title}>
                    配置管理
                </div>
                <div className={styles.content}>
                    {
                        array.map(
                            config => <Config key={config.name} {...config} />
                        )
                    }
                </div>
            </div>
        );
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
