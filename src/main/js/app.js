'use strict';

/**
 * Головной модуль JS на стороне клиента.
 */

import React from 'react'
import ReactDOM from 'react-dom'

// import { LocaleProvider  } from 'antd';

import AirportForm from './ui/airport'
import CrewSpecForm from './ui/crew_spec'
import PlaneModelForm from './ui/plane_model'
import CrewManForm from './ui/crew_man'
import FlightForm from './ui/flight'
import OperatorForm from './ui/operator'
import PlaneForm from './ui/plane'
import CrewForm from './ui/crew'


/**
 * Меню пользователей (обработка выбора пункта пользователем объединена).
 */
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
            listObjComponent = <PlaneModelForm entName="planeModel" pageSize="10" sort="name" title="Plane Models"/>;
            break;
        case "Employees":
            listObjComponent = <CrewManForm entName="crewman" pageSize="10" sort="lastName" title="Employees"/>;
            break;
        case "Flights":
            listObjComponent = <FlightForm entName="flight" pageSize="10" title="Flights"/>;
            break;
        case "Operators":
            listObjComponent = <OperatorForm entName="operator" pageSize="10" sort="login"/>;
            break;
        case "Planes":
            listObjComponent = <PlaneForm entName="plane" pageSize="10" sort="model,boardingNumber"/>;
            break;
        case "Positions":
            listObjComponent = <CrewSpecForm entName="crewSpec" pageSize="10" sort="name" title="Positions"/>;
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
