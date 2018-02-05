'use strict';

const moment = require('moment');

const APP_PROPERTIES_FN = 'application.properties';


export function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

export function  javaLocalDateToString(seconds) {
    let obj = moment.unix(seconds);
    return obj.format("YYYY-MM-DD H:mm");
}
