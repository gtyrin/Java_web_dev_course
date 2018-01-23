'use strict';

export function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

export function  javaLocalDateToString(obj) {
    return obj.year + '-' + obj.monthValue + '-' + obj.dayOfMonth + ' ' + obj.hour + ':' + obj.minute;
}
