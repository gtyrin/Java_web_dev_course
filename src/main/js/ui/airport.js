'use strict';

/**
 * Страница представления и изменения данных для сущности "аэропорт".
 */

const React = require('react');

const crt = require('./common_ref_table');
const inp = require('./input');

/**
 * Поля для обработки в форме ввода.
 */
const STR_ATTR_ORDER = "name,code"


/**
 * Общий компонент отображения  страницы.
 */
class AirportForm extends crt.CommonReferenceTablePage {

    render() {
        return (
			<div className="contentPage">
				<inp.CreateDialog attributes={this.state.attributes}
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

/**
 * Компонент представления списка данных в табличном виде.
 */
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


/**
 * Компонент представления единичного объекта в табличном представлении.
 */
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