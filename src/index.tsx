import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.css';
import Config, { IProps as IConfigProps } from './config';

console.log(styles)

type State = {
    configs: IConfigProps[]
}

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


    render() {
        return (
            <div className={styles.root}>
                <div className={styles.title}>
                    配置管理
                </div>
                <div className={styles.content}>
                    {
                        this.state.configs.map(
                            config => <Config key={config.name} {...config} />
                        )
                    }
                </div>
            </div>
        );
    }
}



ReactDOM.render(<App />, document.getElementById('root'));
