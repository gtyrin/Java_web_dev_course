'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
// end::vars[]

// tag::app[]
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
// end::app[]

// tag::airport-list[]
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
// end::airport-list[]

// tag::airport[]
class Airport extends React.Component{
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
// end::airport[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]

