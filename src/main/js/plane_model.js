'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class PlaneModel extends React.Component{
    render() {
        return (
            <tr>
                <td>{this.props.planeModel.name}</td>
                <td>{this.props.planeModel.pilots}</td>
                <td>{this.props.planeModel.navigators}</td>
                <td>{this.props.planeModel.boardConductors}</td>
                <td>{this.props.planeModel.radioOperators}</td>
                <td>{this.props.planeModel.passengers}</td>
                <td>{this.props.planeModel.maxDistance}</td>
            </tr>
        )
    }
}

class PlaneModelList extends React.Component{
    render() {
        let planeModels = this.props.planeModels.map(planeModel =>
            <PlaneModel key={planeModel._links.self.href} planeModel={planeModel}/>
        );
        return (
            <table>
                <tbody>
                <tr>
                    <th>Name</th>
                    <th>Pilots</th>
                    <th>Navigators</th>
                    <th>Board Conductors</th>
                    <th>Radio Operators</th>
                    <th>Passengers</th>
                    <th>Max Distance</th>
                </tr>
                {planeModels}
                </tbody>
            </table>
        )
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {planeModels: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/planeModels'}).done(response => {
            this.setState({planeModels: response.entity._embedded.planeModels});
        });
    }

    render() {
        return (
            <PlaneModelList planeModels={this.state.planeModels}/>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
);

export default App;