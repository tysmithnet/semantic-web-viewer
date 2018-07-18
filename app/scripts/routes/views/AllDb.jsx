import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {ForceGraph3D} from 'react-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView, setStoredProcedureSelection, setTableSelection, setRelationSelection, removeSelectedNodes, setRelationTypesSelection, setUsersSelection, setTeamSelection} from 'actions/views/all-db';
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
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import '../../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.css';
import "../../../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.css";
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
        this.columnFormatterProc = this.columnFormatterProc.bind(this);
        this.columnFormatterRel = this.columnFormatterRel.bind(this);
        this.columnFormatterTable = this.columnFormatterTable.bind(this);
        this.handleTeamSelectionChanged = this.handleTeamSelectionChanged.bind(this);
        this.handleUserSelectionChanged = this.handleUserSelectionChanged.bind(this);
    }

    handleTeamSelectionChanged(teams) {
        this.props.dispatch(setTeamSelection(teams))
    }

    handleUserSelectionChanged(users) {
        this.props.dispatch(setUsersSelection(users))
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
        if(this.props.selectedStoredProcedures.length == 0 
            && this.props.selectedTables.length == 0
            && this.props.selectedRelationTypes.length == 0
            && this.props.selectedTeams.length == 0
            && this.props.selectedUsers.length == 0){
                return {nodes: this.props.nodes, links: this.props.links}
            }

        const nodes = [];
        const links = [];

        for(let i = 0; i < this.props.links.length; i++) {
            const link = this.props.links[i];
            if(this.props.selectedStoredProcedures.length) {
                for(let j = 0; j < this.props.selectedStoredProcedures.length; j++) {
                    const selected = this.props.selectedStoredProcedures[j];
                    if(link.source == selected) {
                        if(links.indexOf(link) == -1) {
                            links.push(link);
                        }
                        if(nodes.indexOf(link.source) == -1) {
                            nodes.push(link.source);
                        } 
                        if(nodes.indexOf(link.target) == -1) {
                            nodes.push(link.target);
                        } 
                    }
                }
            }
            if(this.props.selectedTables.length) {
                for(let j = 0; j < this.props.selectedTables.length; j++) {
                    const selected = this.props.selectedTables[j];
                    if(link.target == selected) {
                        if(links.indexOf(link) == -1) {
                            links.push(link);
                        }
                        if(nodes.indexOf(link.source) == -1) {
                            nodes.push(link.source);
                        } 
                        if(nodes.indexOf(link.target) == -1) {
                            nodes.push(link.target);
                        } 
                    }
                }
            }
            if(this.props.selectedTeams.length) {
                for(let j = 0; j < this.props.selectedTeams.length; j++) {
                    const selected = this.props.selectedTeams[j];
                    if(link.target == selected) {
                        if(links.indexOf(link) == -1) {
                            links.push(link);
                        }
                        if(nodes.indexOf(link.source) == -1) {
                            nodes.push(link.source);
                        } 
                        if(nodes.indexOf(link.target) == -1) {
                            nodes.push(link.target);
                        } 
                    }
                }
            }
            if(this.props.selectedUsers.length) {
                for(let j = 0; j < this.props.selectedUsers.length; j++) {
                    const selected = this.props.selectedUsers[j];
                    if(link.target == selected) {
                        if(links.indexOf(link) == -1) {
                            links.push(link);
                        }
                        if(nodes.indexOf(link.source) == -1) {
                            nodes.push(link.source);
                        } 
                        if(nodes.indexOf(link.target) == -1) {
                            nodes.push(link.target);
                        } 
                    }
                }
            }
            if(this.props.selectedRelationTypes.length) {
                for(let j = 0; j < this.props.selectedRelationTypes.length; j++) {
                    const type = this.props.selectedRelationTypes[j];
                    if(link.name != type) {
                        continue;
                    }
                    if(links.indexOf(link) == -1) {
                        links.push(link);
                    }
                    if(nodes.indexOf(link.source) == -1) {
                        nodes.push(link.source);
                    } 
                    if(nodes.indexOf(link.target) == -1) {
                        nodes.push(link.target);
                    } 
                }
            }
        }

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
                            {this.renderGraph(graphData.nodes, graphData.links)}
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
            graphData={{nodes, links}}
            width={window.innerWidth * .7}
            height={window.innerHeight}
            nodeAutoColorBy="type"
            onNodeClick={(n) => {
                if(n.type == "storedProc" && this.props.selectedStoredProcedures.indexOf(n) == -1) {
                    this.handleStoredProcSelectionChanged([...(this.props.selectedStoredProcedures || []), n])
                }
                else if(n.type == "table" && this.props.selectedTables.indexOf(n) == -1) {
                    this.handleTableSelectionChanged([...(this.props.selectedTables || []), n])
                }
                else if(n.type == "team" && this.props.selectedTeams.indexOf(n) == -1) {
                    this.handleTeamSelectionChanged([...(this.props.selectedTeams || []), n])
                }
                else if(n.type == "user" && this.props.selectedUsers.indexOf(n) == -1) {
                    this.handleUserSelectionChanged([...(this.props.selectedUsers || []), n])
                }
            }}
            />
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
                                .filter(x => x.type == "storedProc")}
                                selected={this.props.selectedStoredProcedures}/>
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
                        <FormGroup controlId="teamSelection">
                            <ControlLabel>Teams</ControlLabel>
                            <Typeahead
                                labelKey="name"
                                multiple
                                onChange={this.handleTeamSelectionChanged}
                                options={this
                                    .props
                                    .nodes
                                    .filter(x => x.type == "team")}
                                    selected={this.props.selectedTeams}/>
                        </FormGroup>
                        <FormGroup controlId="userSelection">
                            <ControlLabel>Users</ControlLabel>
                            <Typeahead
                                labelKey="name"
                                multiple
                                onChange={this.handleUserSelectionChanged}
                                options={this
                                    .props
                                    .nodes
                                    .filter(x => x.type == "user")}
                                    selected={this.props.selectedUsers}/>
                        </FormGroup>
                        
                        <FormGroup controlId="graphTableView">
                            <ControlLabel>Graph/Table</ControlLabel>
                            <Switch onChange={(el, state) => this.handleGraphDataViewToggle(!this.props.isGraphView)}/>
                        </FormGroup>
                        <FormGroup controlId="clearSelections">
                            <Button onClick={(e,s) => {
                                this.handleStoredProcSelectionChanged([]);
                                this.handleRelationTypesSelectionChanged([]);
                                this.handleTableSelectionChanged([]);
                                this.handleTeamSelectionChanged([]);
                                this.handleUserSelectionChanged([]);
                            }}>Clear</Button>
                        </FormGroup>
                    </div>
                </div>
            </form>
        )
    }

    columnFormatterProc(col, row) {
        return (
            <Button bsStyle="link" 
            onClick={() => {
                const exists = this.props.selectedStoredProcedures.indexOf(row.proc) != -1;
                if(!exists) {
                    const existingAndNew = [...(this.props.selectedStoredProcedures || [])]
                    existingAndNew.push(row.proc);
                    this.handleStoredProcSelectionChanged(existingAndNew)
                }
            }}>{col}</Button>
        )
    }

    columnFormatterRel(col, row) {
        return (
            <Button bsStyle="link" 
            onClick={() => {
                const exists = this.props.selectedRelationTypes.indexOf(col) != -1;
                if(!exists) {
                    const existingAndNew = [...(this.props.selectedRelationTypes || [])]
                    existingAndNew.push(col);
                    this.handleRelationTypesSelectionChanged(existingAndNew);
                }
            }}>{col}</Button>
        )
    }

    columnFormatterTable(col, row) {
        return (
            <Button bsStyle="link" 
            onClick={() => {
                const exists = this.props.selectedTables.indexOf(row.table) != -1;
                if(!exists) {
                    const existingAndNew = [...(this.props.selectedTables || [])]
                    existingAndNew.push(col);
                    this.handleTableSelectionChanged(existingAndNew)
                }
            }}>{col}</Button>
        )
    }

    renderTable() {
        const columns = [{
            dataField: 'procName',
            text: 'Stored Proc',
            sort: true,
            filter: textFilter(),
            formatter: this.columnFormatterProc
        },{
            dataField: 'relName',
            text: 'Relation',
            sort: true,
            filter: textFilter(),
            formatter: this.columnFormatterRel
        },{
            dataField: 'tableName',
            text: 'Table',
            sort: true,
            filter: textFilter(),
            formatter: this.columnFormatterTable
        }]
        const graphData = this.getGraphData();
        const tableData = graphData.links.map(l => {
        {
            const id = v4();
            return {
                id,
                proc: l.source,
                procName: l.source.name,
                rel: l,
                relName: l.name,
                table: l.target,
                tableName: l.target.name,
            }   
        }
        })
        return <BootstrapTable keyField='id' data={tableData} columns={columns} filter={filterFactory()} />
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
        selectedRelations: state.allDb.selectedRelations,
        selectedUsers: state.allDb.selectedUsers,
        selectedTeams: state.allDb.selectedTeams
    };
}

export default connect(mapStateToProps)(AllDb);
