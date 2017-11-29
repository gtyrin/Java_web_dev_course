'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class Operator extends React.Component{
    render() {
        return (
			<tr>
				<td>{this.props.operator.login}</td>
				<td>{this.props.operator.password}</td>
				<td>{this.props.operator.opType}</td>
			</tr>
        )
    }
}

class OperatorList extends React.Component{
    render() {
        let operators = this.props.operators.map(operator =>
			<Operator key={operator._links.self.href} operator={operator}/>
        );
        return (
			<table>
				<tbody>
				<tr>
					<th>Login</th>
					<th>Password</th>
					<th>Operator Type</th>
				</tr>
                {operators}
				</tbody>
			</table>
        )
    }
}


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {operators: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/operators'}).done(response => {
			this.setState({operators: response.entity._embedded.operators});
		});
	}

	render() {
		return (
			<OperatorList operators={this.state.operators}/>
		)
	}
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
);

export default App;