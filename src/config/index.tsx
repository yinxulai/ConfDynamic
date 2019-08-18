import React from 'react';
import styles from './index.module.css';
import autobind from 'autobind-decorator';

console.log(styles)

export type IProps = {
    name: string
    context: string
    enable: boolean
}

type State = {
    edit: boolean
    data: IProps
}

export default class Config extends React.Component<IProps, State> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            edit: true,
            data: { ...this.props }
        }
    }

    @autobind
    switchEdit() {
        this.setState({
            edit: !this.state.edit
        })
    }

    @autobind
    handleContextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState(
            {
                ...this.state,
                data: {
                    ...this.state.data,
                    context: event.currentTarget.value
                }
            }
        )
    }


    render() {
        const { edit, data } = this.state
        const { enable, context, name } = data

        return (
            <div className={styles.root} >
                <div className={styles.header}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.close} onClick={this.switchEdit}>{edit ? "收起" : "编辑"}</div>
                </div>
                {
                    edit && (
                        <div className={styles.editor}>
                            <textarea className={styles.textarea} rows={6} value={context} onChange={this.handleContextChange} />
                            <button className={styles.savebtn}>保存修改</button>
                            {
                                enable
                                    ? <button className={styles.disable}>禁用</button>
                                    : <button className={styles.enable}>启用</button>
                            }

                        </div>
                    )
                }
            </div>
        );
    }
}