/*
Классы формирование кеша, используемого в создании combobox формы редактирования для полей с Foreign Key.
 */

'use strict';

// TODO Генерировать сигналы завершения формирования конкретного кеша

const pluralize = require('pluralize');
const when = require('when');

const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const stompClient = require('./websocket-listener');
const utils = require('./utils')

const root = '/api';


// Сортировка элементов списка по полю содержания
function compare(a,b) {
    if (a.content < b.content)
        return -1;
    if (a.content > b.content)
        return 1;
    return 0;
}


class ReferenceCache {

    constructor(entName,
                fldOptions={'id':['id'], 'content': ['name']},
                extraOptions = {'dependencies': [], 'host': 'http://localhost', 'port': 8080}) {
        this.entName = entName;
        this.idFldNames = fldOptions.id || ['id'];
        this.contentFldNames = fldOptions.content || ['name'];
        this.dependencies = {};
        extraOptions.dependencies.map(depName => {
            this.dependencies[depName] = undefined;
        })
        this.children = {};
        this.cache = {};
        this.altCache = []; // альтернативный кеш
        this.size = 0;
        this.pluralName = pluralize(entName);
        this.addDependency = this.addDependency.bind(this)
        this.create = this.create.bind(this);
    }

    init(dependencies=[]) {
        this.registerListeners();
        follow(client, root, [
            {rel: this.pluralName}]
        ).done(objCollection => {
            this.size = objCollection.entity.page.totalElements;
            this.create(dependencies)
        })
    }

    registerListeners() {
        let upperCaseName = utils.capitalize(this.entName);
        stompClient.register([
            {route: '/topic/new' + upperCaseName, callback: this.addItem()},
            {route: '/topic/update' + upperCaseName, callback: this.updateItem()},
            {route: '/topic/delete' + upperCaseName, callback: this.deleteItem()}
        ]);
    }

    // Возврат полей содержимого по id для "сырой" обработки (на случай, если содержание включает объекты)
    rawContentById(id) {
        return Object.values(this.cache[id]);
    }

    // Возврат полей содержимого по id для текстового представления
    contentById(id) {
        return Object.values(this.cache[id]).join(" ");
        // for (let elem in this.cache) {
        //     if (elem.id === id) {
        //         return elem.content
        //     }
        // }
    }

    // Список всех значений кеша. Поля содержимого склеиваются через пробел.
    values() {
        let ret = [];
        for (let id in this.cache) {
            ret.push(this.contentById(id));
        }
        return ret;
    }

    // Добавление нового элемента.
    addItem(message) {
    }

    // Изменение элемента.
    updateItem(message) {

    }

    // Удаление элемента
    deleteItem(message) {

    }

    /* Проверка соблюдения всех зависимостей перед разрешением на создание кеша. */
    canCreateOrUpdate() {
        let ret = true;
        for (let depClassName in this.dependencies) {
            if (this.dependencies[depClassName] === undefined) {
                ret = false;
                break;
            }
        }
        return ret;
    }

    // Добавление зависимости.
    addDependency(child) {
        this.dependencies[child.constructor.name] = child;
        if (this.canCreateOrUpdate()) {
            this.init()
        }
    }

    /* Первоначальное формирование кеша
       Игнорируются записи, у которых is_archive = 1
       Зависимые поля вида 'spec->crewSpec.name' также достаются */
    create(dependencies=[]) {
        follow(client, root, [
            {rel: this.pluralName, params: {size: this.size}}]
        ).then(objCollection => {
            let id, relId, nativeFldName, cacheObjName, content, elems;
            objCollection.entity._embedded[this.pluralName].map(obj => {
                if ('archive' in obj && obj.archive) {
                    return;
                }
                id = "";
                this.idFldNames.map(fldName => {
                    if (fldName === "id") {
                        id += obj._links.self.href.split('/').pop()
                    } else {
                        id += obj[fldName]
                    }
                });
                this.cache[id] = {}
                let _fldName
                this.contentFldNames.map(fldName => {
                    if (fldName.includes("->")) {
                        elems = fldName.split("->");
                        _fldName = elems[0]
                    } else {
                        _fldName = fldName
                    }
                    this.cache[id][_fldName] = undefined
                })
                this.contentFldNames.map(fldName => {
                    if (fldName.includes("->")) {
                        elems = fldName.split("->");
                        nativeFldName = elems[0];
                        cacheObjName = elems[1];
                        this.cache[id][nativeFldName] = this.dependencies[cacheObjName].contentById(obj[nativeFldName])
                    } else {
                        this.cache[id][fldName] = obj[fldName]
                    }
                });
            })
        }).done(() => {
            // console.log(this.cache)
            for (let id in this.cache) {
                this.altCache.push({"id": parseInt(id), "content": Object.values(this.cache[id]).join(' ')});
            }
            this.altCache.sort(compare)
            console.log(this.altCache);
            dependencies.map(cacheObj => {
                cacheObj.addDependency(this);
            })
        })
    }
}

class AirportCache extends ReferenceCache {
    constructor() {
        super('airport')
    }
}

class EmployeeCache extends ReferenceCache {
    constructor(extraOptions) {
        super('crewman',
              {'content': ['spec->PositionCache', 'firstName', 'midName', 'lastName']},
            extraOptions)
    }
}

class FlightCache extends ReferenceCache {
    constructor(extraOptions) {
        super('flight',
             {'content': ['departureTime', 'departureAirport->AirportCache', 'landingAirport->AirportCache',
                 'number']},
            extraOptions)
    }
}

class PlaneCache extends ReferenceCache {
    constructor(extraOptions) {
        super('plane', {'content': ['model->PlaneModelCache', 'boardingNumber']},
            extraOptions)
    }
}

class PlaneModelCache extends ReferenceCache {
    constructor() {
        super('planeModel')
    }
}

class PositionCache extends ReferenceCache {
    constructor() {
        super('crewSpec')
    }
}

class FilteredCache extends ReferenceCache {

    constructor(entName, fldOptions, extraOptions) {
        super(entName, fldOptions, extraOptions);
        // this.filterURL = extraOptions.filterURL;
        this.ids = [];
    }

    init(dependencies=[]) {
        this.registerListeners();
        follow(client, root, [
            {rel: this.filterURL}]
        ).done(objCollection => {
            for(let obj in objCollection) {
                this.ids.push(obj.id);
            }
            this.size = objCollection.entity.page.totalElements;
            this.create(dependencies);
        })
    }

    create(dependencies) {
        super.create(dependencies)
        let ids = Object.keys(this.cache);
        for(let id in ids) {
            if (!(id in this.ids)) {
                // TODO: id заменить на перечень полей, представляющих (возможно) составной идентификатор записи.
                // TODO или убрать поддержку других ключей кроме суррогатных.
                delete this.cache.id;
            }
        }
    }
}

/* Отбор записей кеша самолетов за текущую дату (прошли техосмотр). */
// Сделать выборку самолетов за дату и отобрать те записи из кеша самолетов, что соответствуют 1й выборке, полю plane.
class PlaneAdmissionCache extends FilteredCache {
    constructor(extraOptions) {
        super('planeAdmission', {'content': ['model->PlaneModelCache', 'boardingNumber']},
            extraOptions)
    }
}

/* Отбор членов экипажа за текущую дату (прошли медосмотр). */
// Сделать выборку сотрудников за дату и отобрать те записи из кеша, что соответствуют 1й выборке, полю crewMan.
class CrewManAdmissionCache extends FilteredCache {
    constructor(extraOptions) {
        super('crewmanAdmission',
            {'content': ['spec->PositionCache', 'firstName', 'midName', 'lastName']},
            extraOptions)
    }
}

export const employeeCache = new EmployeeCache({'dependencies': ['PositionCache']});
export const flightCache = new FlightCache({'dependencies': ['AirportCache']});
export const planeCache = new PlaneCache({'dependencies': ['PlaneModelCache']});

export const airportCache = new AirportCache();
airportCache.init([flightCache]);

export const planeModelCache = new PlaneModelCache()
planeModelCache.init([planeCache]);

export const positionCache = new PositionCache()
positionCache.init([employeeCache]);

airportCache.registerListeners();
employeeCache.registerListeners();
flightCache.registerListeners();
planeCache.registerListeners();
planeModelCache.registerListeners();
positionCache.registerListeners();

export const planeAdmissionCache = new PlaneAdmissionCache();
export const crewManAdmissionCache = new CrewManAdmissionCache();
