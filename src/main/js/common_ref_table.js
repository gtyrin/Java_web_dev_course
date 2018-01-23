'use strict';

// TODO Обрабатывать сигналы завершения формирования/обновления кеша для разблокировки пунктов меню и обновления (?) таблиц с такими полями

const React = require('react');
const ReactDOM = require('react-dom');
const keyIndex = require('react-key-index');
const when = require('when');
const pluralize = require('pluralize');
const moment = require('moment');

import { Button, Checkbox, DatePicker, Icon, Input, InputNumber, Select, TimePicker  } from 'antd';

const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const stompClient = require('./websocket-listener');
const utils = require('./utils')

const root = '/api';


class CommonReferenceTablePage extends React.Component {

    constructor(props) {
        super(props);
        this.attrOrder = []; // порядок следования атрибутов при отображении
        this.pluralName = pluralize(props.entName);
        this.state = {objects: [], attributes: [], pageSize: parseInt(props.pageSize), links: {}};
        this.relLinks = {}
        // this.linkedFields = [];
        // this.loadFromServer = this.loadFromServer.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onFroze = this.onFroze.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        let upperCaseName = utils.capitalize(this.props.entName);
        stompClient.register([
            {route: '/topic/new' + upperCaseName, callback: this.refreshAndGoToLastPage},
            {route: '/topic/update' + upperCaseName, callback: this.refreshCurrentPage},
            {route: '/topic/delete' + upperCaseName, callback: this.refreshCurrentPage}
        ]);
    }

    loadFromServer(pageSize) {
        follow(client,
               root,
               [{rel: this.pluralName, params: {size: pageSize}}]
        ).then(objCollection => {
            return client({
                method: 'GET',
                path: objCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                // Object.keys(this.schema.properties).map(fldName => {
                //     if (this.schema.properties[fldName].hasOwnProperty("format")) {
                //         this.linkedFields.push(fldName);
                //     }
                // });
                // console.log(this.linkedFields);
                // console.log(this.schema);
                this.links = objCollection.entity._links;
                return objCollection;
            });
        }).then(objCollection => {
            this.page = objCollection.entity.page;
            return objCollection.entity._embedded[this.pluralName].map(obj => {
                // this.linkedFields.map(fldName => {
                //     return client({
                //         method: 'GET',
                //         path: obj._links[fldName].href
                //     }).then(relObj => {
                //         obj[fldName] = parseInt(relObj.entity._links.self.href.split('/').pop());
                //     })
                // });
                // console.log(obj);
                return client({
                    method: 'GET',
                    path: obj._links.self.href
                })
            })
        }).then(objPromises => {
            return when.all(objPromises);
        }).done(objects => {
            let attributes = {};
            for (let key in this.schema.properties) {
                if (["archive", "id"].indexOf(key) === -1) {
                    attributes[key] = {
                        'title': this.schema.properties[key].title,
                        'type': this.schema.properties[key].type
                    };
                }
            };
            this.setState({
                page: this.page,
                objects: objects,
                attributes: attributes,
                pageSize: pageSize,
                links: this.links
            });
        });
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    refreshAndGoToLastPage(message) {
        follow(client, root, [{
            rel: this.pluralName,
            params: {size: this.state.pageSize}
        }]).done(response => {
            if (response.entity._links.last !== undefined) {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        })
    }

    refreshCurrentPage(message) {
        follow(client, root, [{
            rel: this.pluralName,
            params: {
                size: this.state.pageSize,
                page: this.state.page.number
            }
        }]).then(objCollection => {
            this.links = objCollection.entity._links;
            this.page = objCollection.entity.page;

            return objCollection.entity._embedded.objects.map(object => {
                return client({
                    method: 'GET',
                    path: object._links.self.href
                })
            });
        }).then(objPromises => {
            return when.all(objPromises);
        }).then(objects => {
            this.setState({
                page: this.page,
                objects: objects,
                attributes: Object.keys(this.schema.properties),
                pageSize: this.state.pageSize,
                links: this.links
            });
        });
    }

    onCreate(newObject) {
        follow(client, root, [this.pluralName]).done(response => {
            client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newObject,
                headers: {'Content-Type': 'application/json'}
            })
        });
    }

    onUpdate(object, updatedObject) {
        client({
            method: 'PUT',
            path: object.entity._links.self.href,
            entity: updatedObject,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': object.headers.Etag
            }
        }).done(response => {
            // this.loadFromServer(this.state.pageSize);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    object.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }

    onFroze(object) {
        object.Froze = !object.Froze;
        client({
            method: 'PATCH',
            path: object._links.self.href,
            entity: object,
            headers: {'Content-Type': 'application/json'}
        })
        // .done(response => {
        //     this.loadFromServer(this.state.pageSize);
        // });
    }

    onNavigate(navUri) {
        client({
            method: 'GET',
            path: navUri
        }).then(objCollection => {
            this.links = objCollection.entity._links;
            this.page = objCollection.entity.page;

            return objCollection.entity._embedded[this.pluralName].map(object =>
                client({
                    method: 'GET',
                    path: object._links.self.href
                })
            );
        }).then(objPromises => {
            return when.all(objPromises);
        }).done(objects => {
            let attributes = {};
            for (let key in this.schema.properties) {
                if (["archive", "id"].indexOf(key) === -1) {
                    attributes[key] = {
                        'title': this.schema.properties[key].title,
                        'type': this.schema.properties[key].type
                    };
                }
            };
            this.setState({
                page: this.page,
                objects: objects,
                attributes: attributes,
                pageSize: this.state.pageSize,
                links: this.links
            });
        });
    }

}

class ModalDialog extends  React.Component {

    componentDidMount(){
        document.addEventListener("keyup", (e) => {
            if (e.keyCode === 27)  window.location = "#";
        });
    }

    renderFields(props) {
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
                    for (let id in props.relLinks[key].cache) {
                        val = Object.values(props.relLinks[key].cache[id]).join(' ');
                        children.push(<Option key={val}>{val}</Option>);
                    }
                    val = (areThereData) ? Object.values(props.relLinks[key].cache[props.obj.entity[key]]).join(' ') : ' ';
                    inpWidget = <Select mode="combobox"
                                        defaultValue={val}
                                        style={{width: '99%'}}>
                        {children}
                    </Select>
                } else if (key.toLowerCase().endsWith('time') || key.toLowerCase().endsWith('date')) {
                    const dateFormat = 'YYYY-MM-DD';
                    const timeFormat = 'HH:mm';
                    if (areThereData) {
                        let fields = utils.javaLocalDateToString(props.obj.entity[key]).split(' ');
                        val = moment(fields[0], dateFormat);
                        val2 = moment(fields[1], timeFormat);
                    } else {
                        val = val2 = moment();
                    }
                    inpWidget = <div>
                        <DatePicker defaultValue={val}
                                    format={dateFormat}
                                    style={{width: '49.5%'}}/>
                        <TimePicker defaultValue={val2}
                                    format={timeFormat}
                                    style={{width: '49.5%'}}/>
                    </div>
                } else if (key == 'password') {
                    val = (areThereData) ? props.obj.entity[key] : '';
                    inpWidget = <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                       defaultValue={val}
                                       type="password"
                                       placeholder="Password"
                                       style={{width: '99%'}}/>
                } else if (props.attributes[key].type == 'integer') {
                    val = (areThereData) ? props.obj.entity[key] : 0;
                    inpWidget = <InputNumber min={1}
                                             defaultValue={val}
                                             style={{width: '99%'}}/>
                } else if(props.attributes[key].type == 'boolean') {
                    val = (areThereData) ? props.obj.entity[key] : false;
                    inpWidget = <Checkbox defaultChecked={val}> </Checkbox>
                } else {
                    val = (areThereData) ? props.obj.entity[key] : ' ';
                    inpWidget = <Input key={key + "i"}
                                       type="text" placeholder={key}
                                       defaultValue={val}
                                       ref={key + "i"} className="field"/>
                }
                return <div key={key + "p"}>
                    <label className="field"> {props.attributes[key].title + ":"}</label>
                    {inpWidget}
                </div>
            }
        );

        return inputs;
    }
}

class CreateDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let newObject = {};
        this.props.attributes.forEach(attribute => {
            newObject[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newObject);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

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
                            {this.renderFields(this.props)}
                            <br />
                            <Button type="primary" onClick={this.handleSubmit}>Add</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

class UpdateDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let updatedObject = {};
        Object.keys(this.props.attributes).forEach(attribute => {
            updatedObject[attribute] = ReactDOM.findDOMNode(this.refs[attribute].title).value.trim();
        });
        this.props.onUpdate(this.props.obj, updatedObject);
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
                            {this.renderFields(this.props)}
                            <br/>
                            <Button type="primary" onClick={this.handleSubmit}>Update</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

class CommonReferenceDataList extends React.Component {

    constructor(props) {
        super(props);
        this.title = utils.capitalize(props.title !== undefined ? props.title : pluralize(this.props.entName));
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        let pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    pageInfo() {
        return this.props.pageSize > 0 && this.props.page  !== undefined  && this.props.page.number  !== undefined ?
            <h3>{this.title} - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;
    }

    bottomRender() {
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>First</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>Prev</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>Next</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>Last</button>);
        }
        return (this.props.pageSize > 0) ? (
            <div>
                <div className="refNavBar">
                    {navLinks}
                </div>
                <div className="refNavBar">
                    Rows: <input ref="pageSize" defaultValue={this.props.pageSize} onChange={this.handleInput}/>
                </div>
            </div>
        ) : null;
    }

    defaultRender(objects, ...titles) {
        return (
            <div>
                {this.pageInfo()}
                <table>
                    <tbody>
                    <tr>
                        {titles.map((key) => <th key={key}>{key}</th>)}
                        <th/>
                        <th/>
                    </tr>
                    {objects}
                    </tbody>
                </table>
                {this.bottomRender()}
            </div>
        )
    }
}

class CommonDataObject extends  React.Component {

    constructor(props) {
        super(props);
        this.relLinks = {};
    }

}

class CommonReferenceObject extends CommonDataObject {

    constructor(props) {
        super(props);
        this.handleFroze = this.handleFroze.bind(this);
    }

    handleFroze() {
        this.props.onFroze(this.props.obj);
    }

    defaultRender(sortedAttrs, relLinks, ...values) {
        // rowCells.push(<td><button onClick={this.handleFroze}>Froze</button></td>);
        return (
            <tr>
                {keyIndex(values, 1).map((obj) => <td key={obj.id}>{obj.value}</td>)}
                <td><UpdateDialog obj={this.props.obj}
                                  attributes={this.props.attributes}
                                  entName={this.props.entName}
                                  sortedAttrs={sortedAttrs}
                                  relLinks={relLinks}
                                  onUpdate={this.props.onUpdate}/></td>
                <td><a className="linkButton frozeButton" href={"#"}>Froze</a></td>
            </tr>
        )
    }
}

class CommonOperatingObject extends CommonDataObject {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onFroze(this.props.obj);
    }

    defaultRender(sortedAttrs, relLinks, ...values) {
        // rowCells.push(<td><button onClick={this.handleDelete}>Delete</button></td>);
        return (
            <tr>
                {keyIndex(values, 1).map((obj) => <td key={obj.id}>{obj.value}</td>)}
                <td><UpdateDialog obj={this.props.obj}
                                  attributes={this.props.attributes}
                                  entName={this.props.entName}
                                  sortedAttrs={sortedAttrs}
                                  relLinks={relLinks}
                                  onUpdate={this.props.onUpdate}/></td>
                <td><a className="linkButton deleteButton" href={"#"}>Delete</a></td>
            </tr>
        )
    }
}

export {CommonReferenceTablePage, CreateDialog, UpdateDialog, CommonReferenceDataList, CommonReferenceObject,
        CommonOperatingObject};