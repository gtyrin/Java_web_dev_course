'use strict';

/**
 * Базовые классы представления, редактировани и навигации на стороне клиента.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const keyIndex = require('react-key-index');
const when = require('when');
const pluralize = require('pluralize');

const client = require('../client');
const follow = require('../follow'); // function to hop multiple links by "rel"
const stompClient = require('../websocket-listener');
const utils = require('../utils');

import {UpdateDialog} from './input';

const root = '/api';


/**
 * Родительский класс общего представления, навигации и ввода данных объектов сущности.
 */

class CommonReferenceTablePage extends React.Component {

    constructor(props) {
        super(props);
        this.attrOrder = []; // порядок следования атрибутов при отображении
        this.pluralName = pluralize(props.entName);
        this.state = {objects: [], attributes: [], pageSize: parseInt(props.pageSize), links: {},
            relURL: this.props.relURL};
        this.state.relURL = this.state.relURL || this.pluralName;
        this.relLinks = {};
        this.sortOrder = this.props.sort || '';
        this.useDelete = this.props.useDelete === 'true';
        // this.linkedFields = [];
        // this.loadFromServer = this.loadFromServer.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        let upperCaseName = utils.capitalize(this.props.entName);
        let routes = [
            {route: '/topic/new' + upperCaseName, callback: this.refreshAndGoToLastPage},
            {route: '/topic/update' + upperCaseName, callback: this.refreshCurrentPage}];
        if (this.useDelete) {
            routes.push({route: '/topic/delete' + upperCaseName, callback: this.refreshCurrentPage});
        } else {
            routes.push({route: '/topic/froze' + upperCaseName, callback: this.refreshCurrentPage});
        }
        stompClient.register(routes);
    }

    /**
     * Загрузка данных для объектов сущности.
     */
    loadFromServer(pageSize) {
        follow(client,
               root,
               [{rel: this.state.relURL, params: {size: pageSize, sort: this.sortOrder}}]
        ).then(objCollection => {
            let profileURL;
            if (!('profile' in objCollection.entity._links)) {
                let fields = objCollection.entity._links.self.href.split('/');
                let ind = fields.indexOf('search');
                fields = fields.slice(0, ind);
                fields.splice(fields.length - 1, 0, 'profile');
                profileURL = fields.join('/');
            } else {
                profileURL = objCollection.entity._links.profile.href;
            }
            return client({
                method: 'GET',
                path: profileURL,
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
                //         obj[fldName] = parseInt(relObj.domain._links.self.href.split('/').pop());
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

    /**
     * Изменение числа отображаемых объектов сущности на странице.
     */
    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    refreshAndGoToLastPage(message) {
        follow(client, root, [{
            rel: this.state.relURL,
            params: {size: this.state.pageSize, sort: this.sortOrder}
        }]).done(response => {
            if (response.entity._links.last !== undefined) {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        })
    }

    refreshCurrentPage(message) {
        let page = (this.state.page === undefined) ? 0 : this.state.page.number;
        follow(client, root, [{
            rel: this.state.relURL,
            params: {
                size: this.state.pageSize,
                page: page,
                sort: this.sortOrder
            }
        }]).then(objCollection => {
            this.links = objCollection.entity._links;
            this.page = objCollection.entity.page;

            return objCollection.entity._embedded[this.pluralName].map(object => {
                return client({
                    method: 'GET',
                    path: object._links.self.href
                })
            });
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

    /**
     * Формирование запроса по созданию объекта сущности в БД.
     */
    onCreate(newObject) {
        follow(client, root, [this.state.relURL]).done(response => {
            let url;
            let ind = response.entity._links.self.href.indexOf('search');
            if (ind === -1) {
                url = response.entity._links.self.href;
            } else {
                url = response.entity._links.self.href.slice(0, ind);
            }
            client({
            method: 'POST',
            path: url,
            entity: newObject,
            headers: {'Content-Type': 'application/json'}
            }).done(response => {},
                response => {
                if (response.status.code === 400) {
                    alert(response.entity.errors[0].message);
                }
            })
        });
    }

    /**
     * Формирование запроса по изменению объекта сущности в БД.
     * @param object состояние объекта ДО изменения данных
     * @param updatedObject ассоциативный словарь введенных данных
     * @param method метод для запроса изменения объекта в БД (PUT/PATCH)
     */
    onUpdate(object, updatedObject, method='PUT') {
        client({
            method: method,
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

    /**
     * Формирование запроса по удалению объекта в БД.
     * @param object сведения об удаляемом объекте.
     */
    onDelete(object) {
        client({
            method: 'DELETE',
            path: object.entity._links.self.href
        }).done(response => {
            this.loadFromServer(this.state.pageSize);
            if (response.status.code === 412) {
                alert('DENIED: Unable to delete ' +
                    object.entity._links.self.href + '. Your copy is stale.');
            }
        });
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

/**
 * Общий класс представления списка объектов сущности и методы навигации по списку.
 */
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

    /**
     * Титульный заголовок страницы с именем сущности и отображением страничных сведений (если не одна страница).
     */
    pageInfo() {
        let title = this.title;
        if (this.props.pageSize > 0 && this.props.page  !== undefined  && this.props.page.number  !== undefined
            && (this.props.page.number + 1) < this.props.page.totalPages) {
            title = title + " - Page " + (this.props.page.number + 1) + " of " + this.props.page.totalPages;
        }
        return <h3><br/>{title}</h3>;
    }

    /**
     * Рендеринг виджетов навигации.
     */
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

    /**
     * Общий рендеринг списка объектов сущности
     * @param objects список объектов
     * @param titles список заголовков колонок таблицы
     */
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

/**
 * Родительский класс представления одного объекта сущности в таблице.
 */
class CommonDataObject extends  React.Component {

    constructor(props) {
        super(props);
        this.relLinks = {};
    }

}

/**
 * Общий класс представления одного объекта сущности в таблице.
 * Используется для сущностей НСИ.
 */
class CommonReferenceObject extends CommonDataObject {

    constructor(props) {
        super(props);
        this.onFroze = this.onFroze.bind(this);
    }

    /**
     * Обработчик замораживания использования объекта для других сущностей, зависимых от данного.
     */
    onFroze() {
        let updatedObject = {};
        this.props.obj.entity.archive = !this.props.obj.entity.archive;
        updatedObject = {'archive': this.props.obj.entity.archive};
        this.props.onUpdate(this.props.obj, updatedObject, 'PATCH');
    }

    defaultRender(sortedAttrs, relLinks, ...values) {
        return (
            <tr>
                {keyIndex(values, 1).map((obj) =>
                    <td key={obj.id}
                        className={this.props.obj.entity.archive ? 'frozen': ''}>
                        {obj.value}
                    </td>)}
                <td><UpdateDialog obj={this.props.obj}
                                  attributes={this.props.attributes}
                                  entName={this.props.entName}
                                  sortedAttrs={sortedAttrs}
                                  relLinks={relLinks}
                                  onUpdate={this.props.onUpdate}/></td>
                <td><a className="linkButton frozeButton" href={"#"} onClick={this.onFroze}>Froze</a></td>
            </tr>
        )
    }
}

/**
 * Общий класс представления одного объекта сущности в таблице.
 * Используется для сущностей, работающих с оперативными данными.
 */
class CommonOperatingObject extends CommonDataObject {

    constructor(props) {
        super(props);
        this.onDelete = this.onDelete.bind(this);
    }

    /**
     * Обработчик удаления объекта сущности.
     */
    onDelete() {
        this.props.onDelete(this.props.obj);
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
                                  substFields={this.props.substFields}
                                  onUpdate={this.props.onUpdate}/></td>
                <td><a className="linkButton deleteButton" href={"#"} onClick={this.onDelete}>Delete</a></td>
            </tr>
        )
    }
}

export {CommonReferenceTablePage, CommonReferenceDataList, CommonReferenceObject, CommonOperatingObject};