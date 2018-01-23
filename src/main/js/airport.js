'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

const STR_ATTR_ORDER = "name,code"


class AirportForm extends crt.CommonReferenceTablePage {

    render() {
        return (
			<div className="contentPage">
				<CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              entName={this.props.entName}/>
				<AirportList page={this.state.page}
                             objects={this.state.objects}
                             links={this.state.links}
                             pageSize={this.state.pageSize}
                             attributes={this.state.attributes}
                             entName={this.props.entName}
                             onNavigate={this.onNavigate}
                             onUpdate={this.onUpdate}
                             onFroze={this.onFroze}
                             updatePageSize={this.updatePageSize}/>
			</div>
        )
    }
}

class AirportList extends crt.CommonReferenceDataList {

    render() {
		let objects = this.props.objects.map(object =>
			<Airport key={object.entity._links.self.href}
					  obj={object}
                      attributes={this.props.attributes}
                      entName={this.props.entName}
                      onUpdate={this.props.onUpdate}
                      onFroze={this.props.onFroze}/>
        );
        // Archive, Code, Id, Name
		return super.defaultRender(objects, "Name", "Code")
    }
}


class Airport extends crt.CommonReferenceObject {
    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            {},
            this.props.obj.entity.name,
            this.props.obj.entity.code
        )
    }
}

export default AirportForm;