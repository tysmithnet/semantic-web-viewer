import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {ForceGraph3D} from 'react-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView, setStoredProcedureSelection, setTableSelection, setRelationSelection, removeSelectedNodes} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, ButtonGroup, Button} from 'react-bootstrap';
import { Map } from 'core-js';
import {Typeahead} from 'react-bootstrap-typeahead';
import Switch from 'react-bootstrap-switch';
import '../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';

export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.forceGraphRef = React.createRef();
        this.handleGraphDataViewToggle = this.handleGraphDataViewToggle.bind(this);
        this.handleStoredProcSelectionChanged = this.handleStoredProcSelectionChanged.bind(this);
        this.handleTableSelectionChanged = this.handleTableSelectionChanged.bind(this);
        this.handleRelationSelectionChanged = this.handleRelationSelectionChanged.bind(this);
        this.handleRemoveSelectedClicked = this.handleRemoveSelectedClicked.bind(this);
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST}); // todo: make action
    }

    handleGraphDataViewToggle(isGraph) {
        this.props.dispatch(toggleGraphView(isGraph));
    }

    handleRemoveSelectedClicked() {
        this.props.dispatch(removeSelectedNodes([...(this.props.selectedStoredProcedures || []), ...(this.props.selectedTables || [])]))
    }

    render() {
        if (this.props.isLoaded) {
            return (
                <div className="all-db">
                    <div className="controls">
                        {this.renderControls()}
                    </div>
                    <div className="output">
                        <div className={cx('graph', {'hidden': !this.props.isGraphView})} >
                            {this.renderGraph()}
                        </div>
                        <div className={cx('data', {'hidden': this.props.isGraphView})}>
                            {this.renderTable()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return <span>Loading..</span>
        }
    }

    renderGraph(){
       return <ForceGraph3D 
        graphData={{nodes: this.props.nodes, links: this.props.links}} 
        width={window.innerWidth * .7} 
        height={window.innerHeight}
        nodeAutoColorBy="type"
        />
    }

    handleStoredProcSelectionChanged(selected) {
        this.props.dispatch(setStoredProcedureSelection(selected));
    }

    handleTableSelectionChanged(selected) {
        this.props.dispatch(setTableSelection(ids));
    }

    handleRelationSelectionChanged(event) {
        const selected = [];
        if(event && event.target && event.target.options) {
            for(let i = 0; i < event.target.options.length; i++) {
                const option  = event.target.options[i];
                if(option.selected)
                    selected.push(option.value);
            }
        }
        this.props.dispatch(setRelationSelection(selected));
    }

    renderControls() {
        function createProcOption(storedProc) {
            return (<option key={storedProc.sp.value} value={storedProc.sp.value}>
                {storedProc.title.value}
            </option>);
        }

        function createTableOption(table) {
            return (<option key={table.tb.value} value={table.tb.value}>
                {table.title.value}
            </option>);
        }

        return (
            <form>
                <div className="container">
                    <div className="col-sm-12">
                    <FormGroup controlId="storedProceduresSelection">
                        <ControlLabel>Stored Procedures</ControlLabel>
                        <Typeahead
                            labelKey="name"
                            multiple
                            onChange={this.handleStoredProcSelectionChanged}
                            options={this.props.nodes.filter(x => x.type == "storedProc")}
                            />
                    </FormGroup>
                    <FormGroup controlId="tableSelection">
                        <ControlLabel>Tables</ControlLabel>
                        <Typeahead
                            labelKey="name"
                            multiple
                            onChange={this.handleTableSelectionChanged}
                            options={this.props.nodes.filter(x => x.type == "table")}
                            selected={this.props.selectedStoredProcedures}
                            />
                    </FormGroup>
                    <FormGroup controlId="tableSelection">
                        <ControlLabel>Relations</ControlLabel>
                        <FormControl componentClass="select" multiple onChange={this.handleRelationSelectionChanged}>
                            <option key="select" value="select">Select</option>
                            <option key="insert" value="insert">Insert</option>
                            <option key="update" value="update">Update</option>
                            <option key="delete" value="delete">Delete</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="graphTableView">
                        <ControlLabel>Graph/Table</ControlLabel>
                        <Switch onChange={(el, state) => this.handleGraphDataViewToggle(state)} />
                    </FormGroup>
                    <FormGroup controlId="nodeActions">
                        <ControlLabel>Node Actions</ControlLabel>
                        <Button onClick={this.handleRemoveSelectedClicked}>Remove Selected</Button>
                        <Button onClick={this.handleRemoveUnselectedClicked}>Remove Unselected</Button>
                    </FormGroup>
                </div>
                </div>
          </form>       
        )
    }

    renderTable() {
        const seenProcs = {};
        const seenTables = {};
        const rows = [];
        
        for(let i = 0; i < this.props.links.length; i++){
            const rel = this.props.links[i];
            seenProcs[rel.source] = true;
            seenTables[rel.target] = true;
            rows.push([rel.source, rel.type, rel.target]);
        }

        for(let i = 0; i < this.props.storedProcs.length; i++) {
            const proc = this.props.storedProcs[i];
            if(!seenProcs[proc.id])
                rows.push([proc.id, null, null]);
        }

        for(let i = 0; i < this.props.tables.length; i++) {
            const table = this.props.tables[i];
            if(!table[table.id])
                rows.push([null, null, table.id]);
        }

        function renderRow(row, index) {
            return (<tr key={row.id}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
            </tr>)
        }

        return (
            <table>
                <thead>
                <tr>
                    <th>Stored Procedure</th>
                    <th>Operation</th>
                    <th>Table</th>
                </tr>
                </thead>
                <tbody>
                    {rows.map(renderRow)}
                </tbody>
            </table>
        );
    }
}

/* istanbul ignore next */
function mapStateToProps(state) {
    return {
        storedProcs: state.allDb.storedProcs, 
        isLoaded: state.allDb.isLoaded, 
        tables: state.allDb.tables, 
        nodes: state.allDb.nodes,
        links: state.allDb.links, 
        distinctRelationTypes: state.allDb.distinctRelationTypes,
        isGraphView: state.allDb.isGraphView, 
        selectedStoredProcedures: state.allDb.selectedStoredProcedures, 
        selectedTables: state.allDb.selectedTables, 
        selectedRelations: state.allDb.selectedRelations
    };
}

export default connect(mapStateToProps)(AllDb);
