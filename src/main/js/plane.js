'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class Plane extends React.Component{
    render() {
        return (
            <tr>
                <td>{this.props.airport.name}</td>
                <td>{this.props.airport.code}</td>
                <td>{this.props.airport.latitude}</td>
                <td>{this.props.airport.longitude}</td>
            </tr>
        )
    }
}

class AirportList extends React.Component{
    render() {
        var airports = this.props.airports.map(airport =>
            <Airport key={airport._links.self.href} airport={airport}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                </tr>
                {airports}
                </tbody>
            </table>
        )
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {airports: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/airports'}).done(response => {
            this.setState({airports: response.entity._embedded.airports});
        });
    }

    render() {
        return (
            <AirportList airports={this.state.airports}/>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
)

export default App;