'use strict';

const React = require('react');

const crt = require('./common_ref_table');
const CreateDialog = crt.CreateDialog;

const utils = require('./utils');

import {airportCache, planeCache} from './cache'

const STR_ATTR_ORDER = "number,departureTime,departureAirport,landingTime,landingAirport,plane";
const REL_LINKS = {"plane": planeCache, "departureAirport": airportCache, "landingAirport": airportCache};


class FlightForm extends crt.CommonReferenceTablePage {

    render() {
        return (
            <div className="contentPage">
                <CreateDialog attributes={this.state.attributes}
                              onCreate={this.onCreate}
                              sortedAttrs={STR_ATTR_ORDER}
                              relLinks={REL_LINKS}
                              entName={this.props.entName}/>
                <FlightList page={this.state.page}
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

class FlightList extends crt.CommonReferenceDataList {

    render() {
        let objects = this.props.objects.map(object =>
            <Flight key={object.entity._links.self.href}
                    obj={object}
                    attributes={this.props.attributes}
                    entName={this.props.entName}
                    onUpdate={this.props.onUpdate}
                    onFroze={this.props.onFroze}/>
        );
        // Departure airport, Departure time, Id, Landing airport, Landing time, Number, Plane
        return super.defaultRender(
            objects, "Number", "Departure time", "Departure airport", "Landing time", "Landing airport", "Plane")
    }
}


class Flight extends crt.CommonReferenceObject {

    render() {
        return super.defaultRender(
            STR_ATTR_ORDER,
            REL_LINKS,
            this.props.obj.entity.number,
            utils.javaLocalDateToString(this.props.obj.entity.departureTime),
            REL_LINKS['departureAirport'].contentById(this.props.obj.entity.departureAirport),
            utils.javaLocalDateToString(this.props.obj.entity.landingTime),
            REL_LINKS['landingAirport'].contentById(this.props.obj.entity.landingAirport),
            REL_LINKS['plane'].contentById(this.props.obj.entity.plane),
        )
    }
}

export default FlightForm;