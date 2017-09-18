import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {parse, format} from 'libphonenumber-js'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {render} from "react-dom";
import Phone from 'react-phone-number-input'
//import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'
import rrui from 'react-responsive-ui/style.css'

import
{
    MenuButton,
    Form,
    TextInput,
    Select,
    Button
}
from 'react-responsive-ui'

var data = [];
const columns = [
    {
        Header: 'country',
        accessor: 'country' // String-based value accessors!
    }, {
        Header: 'Phone',
        accessor: 'phone' // String-based value accessors!
    }, {
        Header: 'raw data',
        accessor: 'rawdata' // String-based value accessors!
    }, {
        Header: 'normalised',
        accessor: 'normalised' // String-based value accessors!
    }
];

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            single: '',
            country: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        data = [];
        var rawtext = this.state.value;
        var lines = rawtext.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var row = {};
            if (lines[i].startsWith("+")) {
                row = parse(lines[i]);
            } else if (this.state.country !== '') {
                row = parse(lines[i], this.state.country);
            } else {
                //alert(this.state.country);
                row = parse("+" + lines[i]);
            }
            row.rawdata = lines[i];
            var normphone = (format(row.phone, row.country, 'International_plaintext'));
            row.normalised = normphone;
            data.push(row);
        }
        render(
            <Results/>, document.getElementById('results'));
        event.preventDefault();
    }

    render() {
        return (
            <div className="App" style={{
                padding: "10px"
            }}>
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Exercise number one</h2>
                </div>
                <div >
                    <Phone style={{
                        align: "center",
                        padding: "20px"
                    }} placeholder="Enter here a phone number" value={this.state.single} onChange={phone => this.setState({phone})}/>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <p className="App-intro" style={{
                            align: "left",
                            padding: "20px"
                        }}>
                            OR
                        </p>

                    <Form onSubmit={this.handleSubmit}>

                        <TextInput  multiline placeholder="Paste here a list of numbers" value={this.state.value} onChange={value => this.setState({value})}/>

                        <div>

                            <Select  placeholder="Default Country Code (if not detected)" value={this.state.country} onChange={country => this.setState({country})} options={[
                                {
                                    value: 'NL',
                                    label: 'Netherlands'
                                }, {
                                    value: 'ES',
                                    label: 'Spain'
                                }
                            ]}/>
                        </div>

                        <Button buttonStyle={{}} submit value="Submit" className="rrui__button"> Clean List ></Button>

                    </Form>
                    </label>
                </form>
                <div id="results"></div>
            </div>
        );
    }
}
export default App;

class Results extends Component {
    render() {
        return (
            <div style={{
                padding: "10px"
            }}>
                <ReactTable data={data} columns={columns} defaultPageSise={5} showPagination={true} showPaginationTop={false} showPaginationBottom={true} showPageSizeOptions={true} pageSizeOptions={[
                    5,
                    10,
                    20,
                    25,
                    50,
                    100
                ]} defaultPageSize={5}/>
            </div>
        );
    }
}
