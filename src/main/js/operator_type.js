'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class OperatorType extends React.Component{
    render() {
        return (
			<tr>
				<td>{this.props.operatorType.name}</td>
			</tr>
        )
    }
}

class OperatorTypeList extends React.Component{
    render() {
        var opTypes = this.props.operatorTypes.map(operatorType =>
			<OperatorType key={operatorType._links.self.href} operatorType={operatorType}/>
        );
        return (
			<table>
				<tbody>
				<tr>
					<th>Name</th>
				</tr>
                {opTypes}
				</tbody>
			</table>
        )
    }
}


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {operatorTypes: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/operatorTypes'}).done(response => {
			this.setState({operatorTypes: response.entity._embedded.operatorTypes});
		});
	}

	render() {
		return (
			<OperatorTypeList operatorTypes={this.state.operatorTypes}/>
		)
	}
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
)

export default App;