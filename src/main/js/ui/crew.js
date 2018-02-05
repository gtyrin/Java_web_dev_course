'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const Moment = require('moment');

const client = require('../client');
const follow = require('../follow'); // function to hop multiple links by "rel"

import { Cascader, Menu } from 'antd';

const crt = require('./common_ref_table');
const inp = require('./input');

import { employeeCache } from '../cache'

const env = require('../const');

const ROOT = '/api';

/**
 * Адрес доступа к набору записей для предстоящих полетов.
 */
const REL_URL = 'futureFlights';

/**
 * Список полей редактирования.
 */
const STR_ATTR_ORDER = "crewMan,commander";

/**
 * Используемые кеши для отображения и редактирования данных сущности.
 */
const REL_LINKS = {'crewMan': employeeCache};


/**
 * Компонент отображения списка сущностей, навигации и ввода данных.
 */
class FilteredCrewForm extends crt.CommonReferenceTablePage {

    constructor(props) {
        super(props);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(newProps) {
        let state = this.state;
        state.relURL = newProps.relURL;
        this.setState(state);
        this.loadFromServer(this.state.pageSize);
        // console.log(newProps);
    }

    render() {
        return (
            <div className="contentPage">
                <inp.CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              relLinks={REL_LINKS}
                              substFields={this.props.substFields}
                              entName={this.props.entName}/>
                <FilteredCrew page={this.state.page}
                              objects={this.state.objects}
                              links={this.state.links}
                              pageSize={this.state.pageSize}
                              attributes={this.state.attributes}
                              entName={this.props.entName}
                              title={this.props.title}
                              substFields={this.props.substFields}
                              onNavigate={this.onNavigate}
                              onUpdate={this.onUpdate}
                              onDelete={this.onDelete}
                              updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}

/**
 * Компонент представления списка сущностей в табличном виде.
 */
class FilteredCrew extends crt.CommonReferenceDataList {
    render() {
        let objects = this.props.objects.map(object =>
            <FilteredCrewMan key={object.entity._links.self.href}
                             obj={object}
                             attributes={this.props.attributes}
                             entName={this.props.entName}
                             substFields={this.props.substFields}
                             pageSize="0"
                             onUpdate={this.props.onUpdate}
                             onDelete={this.props.onDelete}/>
        );
        return super.defaultRender(objects, "Crew man", "Is commander")
    }
}


/**
 * Компонент представления сущности в виде строки в таблице.
 */
class FilteredCrewMan extends crt.CommonOperatingObject {
    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            REL_LINKS,
            REL_LINKS['crewMan'].contentById(this.props.obj.entity.crewMan),
            this.props.obj.entity.commander ? 'yes' : ''
        )
    }
}


/**
 * Головной компонент страницы, содержащий виджет выбора рейса и виджет представления и ввода данных экипажа.
 */
class CrewForm extends React.Component {

    constructor() {
        super();
        this.state = {options: [], flightId: -1};
        this.flightTree = [];
        this.onFlightChange = this.onFlightChange.bind(this);
    }

    /**
     * Формирование дерева для виджета выбора рейса.
     */
    componentDidMount() {
        client({
            method: 'GET',
            path: 'api/futureFlights'
        }).then(objCollection => {
            let i, o1, o2, r;
            for (let i in objCollection.entity) {
                r = objCollection.entity[i];
                let dt = Moment(r[1]).format().substring(0, 10);
                o1 = this.findObjByLabel(this.flightTree, dt);
                if (o1 === undefined) {
                    o1 = {'label': dt, 'value': dt, 'children': []};
                    this.flightTree.push(o1);
                }
                o2 = this.findObjByLabel(o1.children, r[2]);
                if (o2 === undefined) {
                    o2 = {'label': r[2], 'value': r[2], 'children': []};
                    o1.children.push(o2);
                }
                if (this.findObjByLabel(o2.children, r[3]) === undefined) {
                    o2.children.push({'label': r[3], 'value': r[0]});
                }
            }
        }).done(() => {
            this.setState({'options': this.flightTree});
        })
    }

    /**
     * Обработчик изменения выбранного рейса.
     * @param value
     */
    onFlightChange(value) {
        this.setState({flightId: value[2]});
    }

    render() {
        return (
            <div>
                <Cascader options={this.state.options}
                          onChange={this.onFlightChange}
                          placeholder="Please select"
                          style={{width: '100%'}}/>
                <FilteredCrewForm entName="crew"
                                  // pageSize="10"
                                  useDelete="true"
                                  substFields={{flight: this.state.flightId}}
                                  relURL={env.default.host + ':' + env.default.port
                                    + '/api/crews/search/findByFlight?flightId='
                                    + this.state.flightId} />
            </div>);
    }

    findObjByLabel(list, label) {
        let ret;
        let listLen = list.length;
        for (let i=0; i < listLen; i++) {
            if (list[i].label === label) {
                ret = list[i];
            }
        }
        return ret;
    }
}

export default CrewForm;
