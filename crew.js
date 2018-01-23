'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import { Cascader, Menu } from 'antd';

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

import { employeeCache, flightCache } from './cache'

const STR_ATTR_ORDER = "crewMan,commander"
const REL_LINKS = {'crewMan': employeeCache};

class FilteredCrewForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              relLinks={REL_LINKS}
                              entName={this.props.entName}/>
                <FilteredCrewList page={this.state.page}
                                  objects={this.state.objects}
                                  links={this.state.links}
                                  pageSize={this.state.pageSize}
                                  attributes={this.state.attributes}
                                  entName={this.props.entName}
                                  title={this.props.title}
                                  onNavigate={this.onNavigate}
                                  onUpdate={this.onUpdate}
                                  onFroze={this.onFroze}
                                  updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}

class FilteredCrewList extends crt.CommonReferenceDataList {
    render() {
        let objects = this.props.objects.map(object =>
            <FilteredCrew key={object.entity._links.self.href}
                          obj={object}
                          attributes={this.props.attributes}
                          entName={this.props.entName}
                          onUpdate={this.props.onUpdate}
                          onFroze={this.props.onFroze}/>
        );
        return super.defaultRender(objects, "Crew man", "Is commander")
    }
}


class FilteredCrew extends crt.CommonOperatingObject {
    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            REL_LINKS,
            REL_LINKS['crewMan'].contentById(this.props.obj.entity.crewMan),
            this.props.obj.entity.commander
        )
    }
}


class CrewForm extends React.Component {

    constructor() {
        super();
        this.state = {'options': []};
    }

    componentDidMount() {
        for (let id in flightCache.cache) {
            console.log(flightCache.rawContentById(id));
        }
        let options = [{
            value: '2018-2-13',
            label: '2018-2-13',
            children: [{
                value: 1,
                label: 'Heathrow',
                children: [{
                    value: 2,
                    label: 'KL-3086',
                }],
            }],
        },
            {
                value: '2018-2-14',
                label: '2018-2-14',
                children: [{
                    value: 1,
                    label: 'Heathrow',
                    children: [{
                        value: 2,
                        label: 'KL-3086',
                    }],
                }],
            }];
        this.setState({'options': options});
    }

    onChange(value) {
        console.log(value);
    }

    render() {
        return (
            <div>
                <Cascader options={this.state.options}
                          onChange={this.onChange}
                          placeholder="Please select"
                          style={{width: '100%'}}/>
                <FilteredCrewForm entName="crew" pageSize="0" />
            </div>);
    }

}

export default CrewForm;
