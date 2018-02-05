/**
 * Классы формирование кеша, используемого в создании combobox формы редактирования для полей с Foreign Key.
 */

'use strict';

// TODO Генерировать сигналы завершения формирования конкретного кеша
// TODO Основной кеш не отсортирован

const pluralize = require('pluralize');
const when = require('when');

const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const stompClient = require('./websocket-listener');
const utils = require('./utils');

const env = require('./const');

const root = '/api';


// Сортировка элементов списка по полю содержания
function compare(a,b) {
    if (a.content < b.content)
        return -1;
    if (a.content > b.content)
        return 1;
    return 0;
}


/**
 * Родительский класс кешей объектов сущностей НСИ.
 */
class ReferenceCache {

    constructor(entName,
                fldOptions={id:['id'], content: ['name']},
                extraOptions = {dependencies: [], host: env.host, port: env.port}) {
        this.entName = entName;
        this.idFldNames = fldOptions.id || ['id'];
        this.contentFldNames = fldOptions.content || ['name'];
        this.nativeFldNames = {};
        this.isDependencesFormed = false;
        this.dependencies = {};
        extraOptions.dependencies.map(depName => {
            this.dependencies[depName] = undefined;
        })
        this.children = {};
        this.parents = [];
        this.cache = {};
        this.altCache = []; // альтернативный кеш
        this.size = 0;
        this.isCreated = false;
        this.pluralName = pluralize(entName);
        this.addDependency = this.addDependency.bind(this)
        this.create = this.create.bind(this);
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.frozeItem = this.frozeItem.bind(this);
    }

    // TODO dependencies должен роддерживаться как список для первоначального запуска, так и словарь (обработанные данные)
    init(dependencies=[]) {
        // this.registerListeners();
        this.contentFldNames.map(fldName => {
            if (fldName.includes("->")) {
                this.nativeFldNames[fldName] = fldName.split("->")[0];
            } else {
                this.nativeFldNames[fldName] = fldName;
            }
        })
        follow(client, root, [
            {rel: this.pluralName}]
        ).done(objCollection => {
            this.size = objCollection.entity.page.totalElements;
            this.create(dependencies)
        })
    }

    /**
     * Подписка на обработку событий по созданию,изменению и удалению объектов.
     */
    registerListeners() {
        let upperCaseName = utils.capitalize(this.entName);
        stompClient.register([
            {route: '/topic/new' + upperCaseName, callback: this.addItem},
            {route: '/topic/update' + upperCaseName, callback: this.updateItem},
            {route: '/topic/froze' + upperCaseName, callback: this.frozeItem},
        ]);
    }

    /**
     * Возврат полей содержимого по id для текстового представления
     */
    contentById(id) {
        if (this.isCreated) {
            return this.cache[id].content;
        } else {
            let ret = [];
            for (let i = 0; i < this.contentFldNames.length; i++) {
                ret.push(this.cache[id][this.nativeFldNames[this.contentFldNames[i]]]);
            }
            return ret.join(' ');
        }
    }

    idByValue(val) {
        let ret = -1;
        for(let i=0; i<this.altCache.length; i++) {
            if (this.altCache[i].content === val) {
                ret = this.altCache[i].id;
                break;
            }
        }
        return ret;
    }

    /**
     * Добавление нового элемента.
     * @param message message.body имеет значение типа "/api/crewman/3"
     */
    addItem(message) {
        this.create();
        console.log("Cache addItem");
    }

    /**
     * Изменение элемента.
     */
    updateItem(message) {
        this.create();
        console.log("Cache updateItem");
    }

    /**
     * Выведение элемента из ввода для новых объектов.
     */
    // TODO Вызывается дважды и невилирует новую установку.
    frozeItem(message) {
        let id = message.body.split('/').slice(-1);
        this.cache[id].archive = !this.cache[id].archive;
        console.log("Cache frozeItem");
    }

    /**
     * Проверка соблюдения всех зависимостей перед разрешением на создание кеша.
     */
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

    /**
     * Добавление зависимости.
     */
    addDependency(child) {
        this.dependencies[child.constructor.name] = child;
        if (this.canCreateOrUpdate()) {
            this.init()
        }
    }

    /**
     * Первоначальное формирование кеша
     * Игнорируются записи, у которых is_archive = 1
     * Зависимые поля вида 'spec->crewSpec.name' также достаются
     */
    create(dependencies=[]) {
        this.cache = {};
        this.altCache = [];
        this.isCreated = false;
        follow(client, root, [
            {rel: this.pluralName, params: {size: this.size}}]
        ).then(objCollection => {
            let id, relId, nativeFldName, cacheObjName, content, elems;
            objCollection.entity._embedded[this.pluralName].map(obj => {
                id = "";
                this.idFldNames.map(fldName => {
                    if (fldName === "id") {
                        id += obj._links.self.href.split('/').pop()
                    } else {
                        id += obj[fldName]
                    }
                });
                this.cache[id] = {archive: obj.archive}
                this.contentFldNames.map(fldName => {
                    this.cache[id][this.nativeFldNames[fldName]] = undefined
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
            for (let id in this.cache) {
                this.altCache.push({id: parseInt(id), content: this.contentById(id), archive: this.cache[id].archive});
            }
            this.altCache.sort(compare)
            this.cache = {}
            this.altCache.map(r => {
                this.cache[r.id] = r;
            });
            this.isCreated = true;
            if (this.isDependencesFormed) {
                this.parents.map(cacheObj => {
                    cacheObj.init();
                })
            } else {
                dependencies.map(cacheObj => {
                    cacheObj.addDependency(this);
                })
                this.parents = dependencies;
                this.isDependencesFormed = true;
            }
        })
    }
}

/**
 * Кеш объектов сущности "аэропорт".
 */
class AirportCache extends ReferenceCache {
    constructor() {
        super('airport')
    }
}

/**
 * Кеш объектов сущности "член экипажа".
 */
class EmployeeCache extends ReferenceCache {
    constructor(extraOptions) {
        super('crewman',
              {content: ['spec->PositionCache', 'firstName', 'midName', 'lastName']},
            extraOptions)
    }
}

/**
 * Кеш объектов сущности "самолет".
 */
class PlaneCache extends ReferenceCache {
    constructor(extraOptions) {
        super('plane', {content: ['model->PlaneModelCache', 'boardingNumber']},
            extraOptions)
    }
}

/**
 * Кеш объектов сущности "модель самолета".
 */
class PlaneModelCache extends ReferenceCache {
    constructor() {
        super('planeModel')
    }
}

/**
 * Кеш объектов сущности "специальность члена экипажа".
 */
class PositionCache extends ReferenceCache {
    constructor() {
        super('crewSpec')
    }
}

export const employeeCache = new EmployeeCache({'dependencies': ['PositionCache']});
export const planeCache = new PlaneCache({'dependencies': ['PlaneModelCache']});

export const airportCache = new AirportCache();
airportCache.init();

export const planeModelCache = new PlaneModelCache()
planeModelCache.init([planeCache]);

export const positionCache = new PositionCache()
positionCache.init([employeeCache]);

airportCache.registerListeners();
employeeCache.registerListeners();
planeCache.registerListeners();
planeModelCache.registerListeners();
positionCache.registerListeners();
