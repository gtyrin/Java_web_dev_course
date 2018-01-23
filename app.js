'use strict';

import React from 'react'
import ReactDOM from 'react-dom'

// import { LocaleProvider  } from 'antd';
// import { Button } from 'antd';

import AirportForm from './airport'
// import OperatorForm from './operator'
import CrewSpecForm from './crew_spec'
import PlaneModelForm from './plane_model'
import CrewManForm from './crew_man'
import FlightForm from './flight'
import OperatorForm from './operator'
import PlaneForm from './plane'
import CrewForm from './crew'


const menu = document.getElementById('menu');
menu.onclick = function(event) {
    // let target = event.target;
    let listObjComponent;
    let title = event.target.innerHTML;
    switch (title) {
        case "Airports":
            listObjComponent = <AirportForm entName="airport" pageSize="10"/>;
            break;
        case "Plane Models":
            listObjComponent = <PlaneModelForm entName="planeModel" pageSize="10" title="Plane Models"/>;
            break;
        case "Employees":
            listObjComponent = <CrewManForm entName="crewman" pageSize="10" title="Employees"/>;
            break;
        case "Flights":
            listObjComponent = <FlightForm entName="flight" pageSize="10"/>;
            break;
        case "Operators":
            listObjComponent = <OperatorForm entName="operator" pageSize="10"/>;
            break;
        case "Planes":
            listObjComponent = <PlaneForm entName="plane" pageSize="10"/>;
            break;
        case "Positions":
            listObjComponent = <CrewSpecForm entName="crewSpec" pageSize="10" title="Positions"/>;
            break;
        case "Crew Formation":
            listObjComponent = <CrewForm/>;
            break;
    }

    if (listObjComponent !== undefined) {
        ReactDOM.render(
            listObjComponent,
            document.getElementById('sideBar')
        )
    }
};
