'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

const STR_ATTR_ORDER = "name,pilots,navigators,boardConductors,radioOperators,passengers";


class PlaneModelForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              entName={this.props.entName}/>
                <PlaneModelList page={this.state.page}
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

class PlaneModelList extends crt.CommonReferenceDataList {
    render() {
        let objects = this.props.objects.map(object =>
            <PlaneModel key={object.entity._links.self.href}
                        obj={object}
                        attributes={this.props.attributes}
                        entName={this.props.entName}
                        title={this.props.title}
                        onUpdate={this.props.onUpdate}
                        onFroze={this.props.onFroze} />
        );
        // Archive, Board conductors, Id, Name, Navigators, Passengers, Pilots, Radio operators
        return super.defaultRender(objects, "Name", "Pilots", "Navigators", "Board conductors", "Radio operators")
    }
}

class PlaneModel extends crt.CommonReferenceObject {
    render() {
        return super.defaultRender(
                STR_ATTR_ORDER,
                {},
                this.props.obj.entity.name,
                this.props.obj.entity.pilots,
                this.props.obj.entity.navigators,
                this.props.obj.entity.boardConductors,
                this.props.obj.entity.radioOperators
        )
    }
}

export default PlaneModelForm;