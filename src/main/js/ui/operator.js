'use strict';

/**
 * Страница представления и изменения данных для сущности "пользователь системы".
 */

const React = require('react');

const crt = require('./common_ref_table');
const inp = require('./input');


const STR_ATTR_ORDER = "username,password,role"

class OperatorForm extends crt.CommonReferenceTablePage {

    render() {
        return (
			<div className="contentPage">
				<inp.CreateDialog attributes={this.state.attributes}
							  onCreate={this.onCreate}
							  sortedAttrs={STR_ATTR_ORDER}
							  entName={this.props.entName}/>
				<OperatorList page={this.state.page}
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

class OperatorList extends crt.CommonReferenceDataList {

    render() {
        let objects = this.props.objects.map(object =>
			<Operator key={object.entity._links.self.href}
					  obj={object}
					  attributes={this.props.attributes}
					  entName={this.props.entName}
					  onUpdate={this.props.onUpdate}
					  onFroze={this.props.onFroze}/>
        );
        return super.defaultRender(objects, "Login", "Role")
    }
}


class Operator extends crt.CommonReferenceObject {
    render() {
        return super.defaultRender(
			STR_ATTR_ORDER,
			{},
            this.props.obj.entity.username,
			this.props.obj.entity.role,
        )
    }
}

export default OperatorForm;