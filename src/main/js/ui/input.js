'use strict';

/**
 * Модуль классов по созданию и редактированию данных сущностей на основании переданных в них метаданных.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
import { Button, Checkbox, DatePicker, Icon, Input, InputNumber, Select, TimePicker  } from 'antd';
const utils = require('../utils')


class ModalDialog extends  React.Component {

    componentDidMount() {
        document.addEventListener("keyup", (e) => {
            if (e.keyCode === 27)  {
                // this.renderFields(this.props)
                window.location = "#";
            }
        });
    }

    cleanFields(props) {
        let ref;
        this.props.sortedAttrs.split(',').map(attribute => {
            // ref = this.refs[attribute];
            // switch (this.props.attributes[attribute].type) {
            //     case 'integer':
            //         if (attribute in this.props.relLinks) {
            //             ret[attribute] = this.props.relLinks[attribute].idByValue(
            //                 this.refs[attribute].rcSelect.state.value[0].key);
            //         } else {
            //             ret[attribute] = this.refs[attribute].inputNumberRef.state.value;
            //         }
            //         break;
            //     case 'boolean':
            //         ret[attribute] = this.refs[attribute].rcCheckbox.state.checked;
            //         break;
            //     default:
            //         ret[attribute] = this.refs[attribute].input.value.trim();
            // }
            // if (!(attribute in (this.props.substFields || {}))) {
            // this.refs[attribute].removeSelected();
            // ref = this.refs[attribute];
            // .setState({value: ''});
            // ref = ReactDOM.findDOMNode(this.refs[attribute]);
            // ReactDOM.findDOMNode(this.refs[attribute]). = '';
            // ReactDOM.findDOMNode(this.refs[attribute]).value = '';
            // }
        });
    }

    /**
     * Динамическое формирование полей ввода в заивисимсти от их типа данных.
     * @param props свойства сущности.
     * @param toCreateObj форма ввода используется для создания объекта.
     * @returns {Array}
     */
    renderFields(props, toCreateObj) {
        if (props.attributes.length === 0) {
            return;
        }
        let val, val2;
        let areThereData = 'obj' in props;
        let relKeys = 'relLinks' in props ? Object.keys(props.relLinks) : [];

        let inputs = ('sortedAttrs' in props ? props.sortedAttrs : '').split(",").map(key => {
                let inpWidget = null;
                if (relKeys.indexOf(key) !== -1) {
                    const children = [];
                    props.relLinks[key].altCache.map(r => {
                        if (!(toCreateObj & r.archive)) {
                            children.push(<Select.Option key={r.content} idval={r.id} >{r.content}</Select.Option>);
                        }
                    });
                    inpWidget = <Select mode="combobox"
                                        key={key}
                                        ref={key}
                                        defaultValue={(areThereData) ?
                                            props.relLinks[key].contentById(props.obj.entity[key]) : ''}
                                        style={{width: '99%'}}>
                        {children}
                    </Select>
                } else if (key.toLowerCase().endsWith('time') || key.toLowerCase().endsWith('date')) {
                    const dateFormat = 'YYYY-MM-DD';
                    const timeFormat = 'HH:mm';
                    if (areThereData) {
                        let datetime = moment.unix(props.obj.entity[key]);
                        // let fields = utils.javaLocalDateToString(props.obj.entity[key]).split(' ');
                        val = moment(datetime, dateFormat);
                        val2 = moment(datetime, timeFormat);
                    } else {
                        val = val2 = moment();
                    }
                    inpWidget = <div>
                        <DatePicker defaultValue={val}
                                    key={'Date' + key}
                                    ref={'Date' + key}
                                    format={dateFormat}
                                    style={{width: '49.5%'}}/>
                        <TimePicker defaultValue={val2}
                                    key={'Time' + key}
                                    ref={'Time' + key}
                                    format={timeFormat}
                                    style={{width: '49.5%'}}/>
                    </div>
                } else if (key == 'password') {
                    val = (areThereData) ? props.obj.entity[key] : '';
                    inpWidget = <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                       key={key}
                                       ref={key}
                                       defaultValue={val}
                                       type="password"
                                       placeholder="Password"
                                       style={{width: '99%'}}/>
                } else if (props.attributes[key].type == 'integer') {
                    val = (areThereData) ? props.obj.entity[key] : 0;
                    inpWidget = <InputNumber id={key} min={1}
                                             key={key}
                                             ref={key}
                                             defaultValue={val}
                                             style={{width: '99%'}}/>
                } else if(props.attributes[key].type == 'boolean') {
                    val = (areThereData) ? props.obj.entity[key] : false;
                    inpWidget = <Checkbox key={key}
                                          ref={key}
                                          defaultChecked={val}> </Checkbox>
                } else {
                    val = (areThereData) ? props.obj.entity[key] : ' ';
                    inpWidget = <Input key={key}
                                       type="text" placeholder={key}
                                       defaultValue={val}
                                       ref={key} className="field"/>
                }
                return <div key={key + "p"}>
                    <label className="field"> {props.attributes[key].title + ":"}</label>
                    {inpWidget}
                </div>
            }
        );

        return inputs;
    }

    /**
     * Формирование ассоиативного массива результатов введенным пользователем данных.
     * @returns {{}}
     */
    userData() {
        let ret = {};
        for (let attribute in this.props.attributes) {
            if (attribute in (this.props.substFields || {})) {
                ret[attribute] = this.props.substFields[attribute];
            } else {
                switch (this.props.attributes[attribute].type) {
                    case 'integer':
                        if (attribute in this.props.relLinks) {
                            ret[attribute] = this.props.relLinks[attribute].idByValue(
                                this.refs[attribute].rcSelect.state.value[0].key);
                        } else if (attribute.toLowerCase().endsWith('time') || attribute.toLowerCase().endsWith('date')) {
                            // ret[attribute] = this.refs[attribute].picker.state.value.unix();
                            let date = this.refs['Date' + attribute].picker.state.value.format('YYYY-MM-DD');
                            let time = this.refs['Time' + attribute].state.value.format('HH:mm');
                            ret[attribute] = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').unix();
                        } else {
                            ret[attribute] = this.refs[attribute].inputNumberRef.state.value;
                        }
                        break;
                    case 'boolean':
                        ret[attribute] = this.refs[attribute].rcCheckbox.state.checked;
                        break;
                    default:
                        ret[attribute] = this.refs[attribute].input.value.trim();
                }
            }
        };
        return ret;
    }
}


/**
 * Диалог создания объектьа сущности.
 */
class CreateDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let data = this.userData();
        this.cleanFields(this.props)
        this.props.onCreate(data);
        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    render() {
        let upperName = "#create" + utils.capitalize(this.props.entName);
        return (
            <div>
                <a className="linkButton insertButton" href={"#" + upperName}>Add</a>
                <div id={upperName} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">x</a>
                        <h2>Add new record</h2>
                        <form>
                            {this.renderFields(this.props, true)}
                            <br />
                            <Button type="primary" onClick={this.handleSubmit}>Add</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

/**
 * Диалог редактирования редактирования объекта сущности.
 */
class UpdateDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onUpdate(this.props.obj, this.userData());
        window.location = "#";
    }

    render() {
        let dialogId = "update" + utils.capitalize(this.props.entName) + "-" + this.props.obj.entity._links.self.href;
        return (
            <div>
                <a className="linkButton updateButton" href={"#" + dialogId}>Update</a>
                <div id={dialogId} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">x</a>
                        <h2>Update record</h2>
                        <form>
                            {this.renderFields(this.props, false)}
                            <br/>
                            <Button type="primary" onClick={this.handleSubmit}>Update</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export {CreateDialog, UpdateDialog};
