import React from 'react';
import { observer } from 'mobx-react';
import styles from './index.module.css';
import autobind from 'autobind-decorator';
import Store, { IConfig } from '../store';
import { Input, Button, message } from 'antd';

interface IProps extends IConfig {
    isCreate?: boolean
}

type State = {
    edit: boolean
    data: IConfig
    saveIsLoading: boolean
    deleteIsLoading: boolean
    enableIsLoading: boolean
}

@observer
export default class Config extends React.Component<IProps, State> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            edit: false,
            saveIsLoading: false,
            deleteIsLoading: false,
            data: { ...this.props },
            enableIsLoading: false,
       
        }
    }

    @autobind
    clearState() {
        this.setState({
            edit: false,
            data: { ...this.props }
        }, () => console.log(this.state))
    }

    @autobind
    switchEdit(state?: boolean) {
        if (state === undefined) {
            this.setState({
                edit: !this.state.edit
            })
            return
        }

        this.setState({
            edit: state
        })
    }

    @autobind
    handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                ...this.state,
                data: {
                    ...this.state.data,
                    name: event.currentTarget.value
                }
            }
        )
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


    @autobind
    async handleSave() {
        const { context, name } = this.state.data
        const { enable, isCreate, name: key } = this.props
        try {
            if (isCreate) {
                await Store.saveCreatingConfig(key, { enable, context, name })
                message.info('保存成功');
            } else {
                await Store.updateConfig(key, { enable, context, name })
                message.info('保存成功');
            }
        } catch (err) {
            message.error(err);
        }
    }

    @autobind
    handleCancel() {
        const { isCreate, name } = this.props

        if (isCreate) {
            return Store.removeCreatingConfig(name)
        }

        this.clearState()
    }

    @autobind
    handleDelete() {
        const { name } = this.props
        try {
            Store.removeConfig(name)
            message.info('删除成功');
        } catch (err) {
            message.error(err);
        }
    }

    @autobind
    async handleEnableChange() {
        const { enable, name } = this.props
        try {
            if (enable) {
                await Store.disableConfig(name)
                message.info(`禁用 ${name} 成功`);
            } else {
                await Store.ensableConfig(name)
                message.info(`启用 ${name} 成功`);
            }
        } catch (err) {
            message.error(err);
        }
    }


    render() {
        const { edit, data ,saveIsLoading ,deleteIsLoading ,enableIsLoading: enableChangeIsLoading } = this.state
        const { isCreate, enable } = this.props
        const { context, name } = data
  
        return (
            <div className={styles.root} >
                <div className={styles.header} onClick={() => this.switchEdit(true)}>
                    {
                        !isCreate
                            ? <div className={styles.name}>{name}</div>
                            : <Input placeholder="输入名称" value={name} onChange={this.handleNameChange} />

                    }

                </div>
                {
                    edit && (
                        <div className={styles.editor}>
                            <Input.TextArea
                                value={context}
                                className={styles.textarea}
                                onChange={this.handleContextChange}
                                autosize={{ minRows: 12, maxRows: 6 }}
                            />
                            <div className={styles.buttons}>
                                <Button loading={saveIsLoading} block type="primary" onClick={this.handleSave} className={styles.savebtn}>保存修改</Button>
                                {
                                    !isCreate && (
                                        <>
                                            <Button loading={enableChangeIsLoading} block type="primary" onClick={this.handleEnableChange} className={styles.savebtn}>{enable ? '禁用' : '启用'}</Button>
                                            <Button loading={enableChangeIsLoading} block type="danger" onClick={this.handleDelete} className={styles.savebtn}>删除配置</Button>
                                        </>
                                    )
                                }
                                <Button block loading={deleteIsLoading} type="danger" onClick={this.handleCancel} className={styles.savebtn}>放弃修改</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}