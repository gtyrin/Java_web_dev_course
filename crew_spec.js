'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

const STR_ATTR_ORDER = "name";


class CrewSpecForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              entName={this.props.entName}/>
                <CrewSpecList page={this.state.page}
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

class CrewSpecList extends crt.CommonReferenceDataList {

    render() {
        let objects = this.props.objects.map(object =>
            <CrewSpec key={object.entity._links.self.href}
                      obj={object}
                      attributes={this.props.attributes}
                      entName={this.props.entName}
                      onUpdate={this.props.onUpdate}
                      onFroze={this.props.onFroze}/>
        );
        // Archive, Id, Name
        return super.defaultRender(objects, "Name")
    }
}


class CrewSpec extends crt.CommonReferenceObject {
    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            {},
            this.props.obj.entity.name
        )
    }
}

export default CrewSpecForm;