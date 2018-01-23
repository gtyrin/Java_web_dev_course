'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

import {positionCache} from './cache'

const STR_ATTR_ORDER = "firstName,midName,lastName,age,spec,flyingHours"
const REL_LINKS = {'spec': positionCache};


class CrewManForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              relLinks={REL_LINKS}
                              entName={this.props.entName}/>
                <CrewManList page={this.state.page}
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

class CrewManList extends crt.CommonReferenceDataList {

    render() {
        let objects = this.props.objects.map(object =>
            <CrewMan key={object.entity._links.self.href}
                     obj={object}
                     attributes={this.props.attributes}
                     entName={this.props.entName}
                     onUpdate={this.props.onUpdate}
                     onFroze={this.props.onFroze}/>
        );
        // Age, Archive, First name, Flying hours, Id, Last name, Mid name, Spec
        return super.defaultRender(objects, "First name", "Mid name", "Last name", "Age", "Spec", "Flying hours")
    }
}


class CrewMan extends crt.CommonReferenceObject {

    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            REL_LINKS,
            this.props.obj.entity.firstName,
            this.props.obj.entity.midName,
            this.props.obj.entity.lastName,
            this.props.obj.entity.age,
            REL_LINKS['spec'].contentById(this.props.obj.entity.spec),
            this.props.obj.entity.flyingHours
        )
    }
}

export default CrewManForm;