'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {airports: [], attributes: [], pageSize: 13, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onArchive = this.onArchive.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'airports', params: {size: pageSize}}]
        ).then(airportCollection => {
            return client({
                method: 'GET',
                path: airportCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return airportCollection;
            });
        }).done(airportCollection => {
            this.setState({
                airports: airportCollection.entity._embedded.airports,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: airportCollection.entity._links});
        });
    }

    onCreate(newAirport) {
        follow(client, root, ['airports']).then(airportCollection => {
            return client({
                method: 'POST',
                path: airportCollection.entity._links.self.href,
                entity: newAirport,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [
                {rel: 'airports', params: {'size': this.state.pageSize}}]);
        }).done(response => {
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    onArchive(airport) {
        airport.archive = !airport.archive;
        client({
            method: 'PATCH',
            path: airport._links.self.href,
            entity: airport,
            headers: {'Content-Type': 'application/json'}
        })
        // .done(response => {
        //     this.loadFromServer(this.state.pageSize);
        // });
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(airportCollection => {
            this.setState({
                airports: airportCollection.entity._embedded.airports,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: airportCollection.entity._links
            });
        });
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    // componentDidMount() {
    // 	client({method: 'GET', path: '/api/airports'}).done(response => {
    // 		this.setState({airports: response.entity._embedded.airports});
    // 	});
    // }

    render() {
        return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<AirportList airports={this.state.airports}
                             links={this.state.links}
                             pageSize={this.state.pageSize}
                             onNavigate={this.onNavigate}
                             onArchive={this.onArchive}
                             updatePageSize={this.updatePageSize}/>
			</div>
        )
    }
}

class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let newAirport = {};
        this.props.attributes.forEach(attribute => {
            newAirport[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newAirport);

        // clear out the dialog's inputs
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        // Navigate away from the dialog to hide it.
        window.location = "#";
    }

    render() {
        let inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
        );

        return (
			<div>
				<a href="#createAirport">Add</a>

				<div id="createAirport" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Add new airport</h2>

						<form>
                            {inputs}
							<button onClick={this.handleSubmit}>Add</button>
						</form>
					</div>
				</div>
			</div>
        )
    }

}

class AirportList extends React.Component{
    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        let pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        let airports = this.props.airports.map(airport =>
			<Airport key={airport._links.self.href} airport={airport} onArchive={this.props.onArchive}/>
        );
        let navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>First</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>Prev</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>Next</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>Last</button>);
        }
        return (
			<div>
                <table>
					<tbody>
					<tr>
						<th>Name</th>
						<th>Code</th>
						<th>Latitude</th>
						<th>Longitude</th>
						{/*<th>Archived</th>*/}
					</tr>
                    {airports}
					</tbody>
				</table>
				<div>
                    {navLinks} Rows per page: <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				</div>
			</div>
        )
    }
}

class Airport extends React.Component{
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onArchive(this.props.airport);
    }

    render() {
        return (
			<tr>
				<td>{this.props.airport.name}</td>
				<td>{this.props.airport.code}</td>
				<td>{this.props.airport.latitude}</td>
				<td>{this.props.airport.longitude}</td>
				{/*<td>{this.props.airport.archive}</td>*/}
				<td>
					<button onClick={this.handleDelete}>Archive</button>
				</td>
			</tr>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('react')
)

export default App;