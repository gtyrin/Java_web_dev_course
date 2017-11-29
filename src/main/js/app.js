'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

import App from './airport'
// import App from './operator'
// import App from './operator_type'
// import App from './plane'
// import App from './plane_model'

ReactDOM.render(
    <App/>,
    document.getElementById('react')
);
