'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

import {planeModelCache} from './cache'

const STR_ATTR_ORDER = "model,boardingNumber";
const REL_LINKS = {'model': planeModelCache};


class PlaneForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              relLinks={REL_LINKS}
                              entName={this.props.entName}/>
                <PlaneList page={this.state.page}
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

class PlaneList extends crt.CommonReferenceDataList {

    render() {
        let objects = this.props.objects.map(object =>
            <Plane key={object.entity._links.self.href}
                   obj={object}
                   attributes={this.props.attributes}
                   entName={this.props.entName}
                   onUpdate={this.props.onUpdate}
                   onFroze={this.props.onFroze}/>
        );
        // Archive, Boarding number, Id, Model
        return super.defaultRender(objects, "Model", "Boarding Number")
    }
}


class Plane extends crt.CommonReferenceObject {
    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            REL_LINKS,
            REL_LINKS['model'].contentById(this.props.obj.entity.model),
            this.props.obj.entity.boardingNumber,
        )
    }
}

export default PlaneForm;