import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {ForceGraph3D} from 'react-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView, setStoredProcedureSelection, setTableSelection, setRelationSelection, removeSelectedNodes, setRelationTypesSelection} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    FormControl,
    ControlLabel,
    ButtonGroup,
    Button
} from 'react-bootstrap';
import {Map} from 'core-js';
import {Typeahead} from 'react-bootstrap-typeahead';
import Switch from 'react-bootstrap-switch';
import '../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';
import "C:\\git\\semantic-web-viewer\\node_modules\\react-bootstrap-table-next\\dist\\react-bootstrap-table2.css";
export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.forceGraphRef = React.createRef();
        this.handleGraphDataViewToggle = this
            .handleGraphDataViewToggle
            .bind(this);
        this.handleStoredProcSelectionChanged = this
            .handleStoredProcSelectionChanged
            .bind(this);
        this.handleTableSelectionChanged = this
            .handleTableSelectionChanged
            .bind(this);
        this.handleRelationSelectionChanged = this
            .handleRelationSelectionChanged
            .bind(this);
        this.handleRemoveSelectedClicked = this
            .handleRemoveSelectedClicked
            .bind(this);
        this.handleRelationTypesSelectionChanged = this.handleRelationTypesSelectionChanged.bind(this);
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST}); // todo: make action
    }

    handleGraphDataViewToggle(isGraph) {
        this
            .props
            .dispatch(toggleGraphView(isGraph));
    }

    handleRemoveSelectedClicked() {
        this
            .props
            .dispatch(removeSelectedNodes([
                ...(this.props.selectedStoredProcedures || []),
                ...(this.props.selectedTables || [])
            ]))
    }
 
    getGraphData() {
        const nodes = [];
        const links = [];

        

        return {nodes, links};
    }

    render() {
        if (this.props.isLoaded) {
            const graphData = this.getGraphData();
            return (
                <div className="all-db">
                    <div className="controls">
                        {this.renderControls()}
                    </div>
                    <div className="output">
                        <div
                            className={cx('graph', {
                            'hidden': !this.props.isGraphView
                        })}>
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

    renderGraph(nodes, links) {
        return <ForceGraph3D
            graphData={{
            nodes,
            links,
        }}
            width={window.innerWidth * .7}
            height={window.innerHeight}
            nodeAutoColorBy="type"/>
    }

    handleStoredProcSelectionChanged(selected) {
        this
            .props
            .dispatch(setStoredProcedureSelection(selected));
    }

    handleTableSelectionChanged(selected) {
        this
            .props
            .dispatch(setTableSelection(selected));
    }

    handleRelationSelectionChanged(selected) {
        this
            .props
            .dispatch(setRelationSelection(selected));
    }

    handleRelationTypesSelectionChanged(selected) {
        this.props.dispatch(setRelationTypesSelection(selected));
    }

    renderControls() {
        function createProcOption(storedProc) {
            return (
                <option key={storedProc.sp.value} value={storedProc.sp.value}>
                    {storedProc.title.value}
                </option>
            );
        }

        function createTableOption(table) {
            return (
                <option key={table.tb.value} value={table.tb.value}>
                    {table.title.value}
                </option>
            );
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
                                options={this
                                .props
                                .nodes
                                .filter(x => x.type == "storedProc")}/>
                        </FormGroup>
                        <FormGroup controlId="relationSelection">
                            <ControlLabel>Relations</ControlLabel>
                            <Typeahead
                                labelKey="name"
                                multiple
                                options={this.props.distinctRelationTypes} 
                                selected={this.props.selectedRelationTypes}
                                onChange={this.handleRelationTypesSelectionChanged}/>
                        </FormGroup>
                        <FormGroup controlId="tableSelection">
                            <ControlLabel>Tables</ControlLabel>
                            <Typeahead
                                labelKey="name"
                                multiple
                                onChange={this.handleTableSelectionChanged}
                                options={this
                                .props
                                .nodes
                                .filter(x => x.type == "table")}
                                selected={this.props.selectedTables}/>
                        </FormGroup>
                        
                        <FormGroup controlId="graphTableView">
                            <ControlLabel>Graph/Table</ControlLabel>
                            <Switch onChange={(el, state) => this.handleGraphDataViewToggle(!this.props.isGraphView)}/>
                        </FormGroup>
                    </div>
                </div>
            </form>
        )
    }

    renderTable() {
        const rows = [];
        this
            .props
            .links
            .filter(l => {
                if (this.props.selectedStoredProcedures.length || this.props.selectedRelationTypes.length || this.props.selectedTables.lengths) {
                    for(let i = 0; i < this.props.selectedRelationTypes.length; i++) {
                        const selectedRelationType = this.props.selectedRelationTypes[i];
                        if(selectedRelationType == l.rel) {
                            return true;
                        }
                    }
                    for(let i = 0; i < this.props.selectedStoredProcedures.length; i++) {
                        const selectedProc = this.props.selectedStoredProcedures[i];
                        if(selectedProc.id == l.source.id || selectedProc.id == l.target.id)
                        {
                            return true;
                        }
                    }
                    for(let i = 0; i < this.props.selectedTables.length; i++){
                        const selectedTable = this.props.selectedTables[i];
                        if(selectedTable.id == l.source.id || selectedTable.id == l.target.id){
                            return true;
                        }
                    }
                    return false;
                }
                return true;
            })
            .forEach(l => {
                rows.push([l.source, l.name, l.target]);
            });
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
                    {rows.map(r => {
                        return <tr>
                            <td>{r[0].name}</td>
                            <td>{r[1]}</td>
                            <td>{r[2].name}</td>
                        </tr>
                    })}
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
        selectedRelationTypes: state.allDb.selectedRelationTypes,
        selectedRelations: state.allDb.selectedRelations
    };
}

export default connect(mapStateToProps)(AllDb);
