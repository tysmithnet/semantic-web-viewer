import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView, setStoredProcedureSelection, setTableSelection, setRelationSelection} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, ButtonGroup, Button} from 'react-bootstrap';
import ForceGraph from 'components/ForceGraph';
import { isThisHour } from 'date-fns';
import { Map } from 'core-js';

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
        this.highlightHotspots = this.highlightHotspots.bind(this);
        this.procLookup = new Map();
        this.tableLookup = new Map();
        this.nodeDegree = new Map();
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST}); // todo: make action
    }

    handleGraphDataViewToggle(isGraph) {
        this.props.dispatch(toggleGraphView(isGraph));
    }

    render() {
        if (this.props.loaded) {
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
        if(!this.nodes) {
            const procNodes = this
                .props
                .storedProcs
                .map(x => {
                    return {key: v4(), id: x.sp.value, name: x.title.value, type: "storedProc"}; // todo: constant value
                });
            procNodes.forEach(p => this.procLookup.set(p.id, p));

            const tableNodes = this
                .props
                .tables
                .map(x => {
                    return {key: v4(), id: x.tb.value, name: x.title.value, type: "table"}; // todo: constant value
                });
                tableNodes.forEach(t => this.tableLookup.set(t.id, t));

            const links = this
                .props
                .relations
                .map(x => {
                    return {key: v4(), source: x.sp.value, target: x.tb.value, type: x.rel.value}
                });

            links.forEach(l => {
                const sourceDegree = this.nodeDegree.get(l.source) || 0;
                const targetDegree = this.nodeDegree.get(l.target) || 0;
                this.nodeDegree.set(l.source, sourceDegree + 1);
                this.nodeDegree.set(l.target, targetDegree + 1);
            })

            this.nodes = [
                ...procNodes,
                ...tableNodes
            ];
            this.links = links;
        }
        if(this.forceGraphRef.current && this.nodes) {
            for(let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                let found = false;
                for(let j = 0; this.props.selectedStoredProcedures && j < this.props.selectedStoredProcedures.length && !found; j++) {
                    const selectedProc = this.props.selectedStoredProcedures[j];
                    if(selectedProc == node.id) {
                        this.forceGraphRef.current.highlightNode(node, 0xffff00, 1.5);
                        found = true;
                    }
                }
                for(let j = 0; this.props.selectedTables && j < this.props.selectedTables.length && !found; j++) {
                    const selectedTable = this.props.selectedTables[j];
                    if(selectedTable == node.id) {
                        this.forceGraphRef.current.highlightNode(node, 0x00ffff, 1.5);
                        found = true;
                    }
                }
                if(!found) {
                    this.forceGraphRef.current.unhighlightNode(node);
                }
            }
        }

        if(this.forceGraphRef.current && this.links) {
            for(let i = 0; i < this.links.length; i++) {
                const link = this.links[i];
                if(this.props.selectedRelations && this.props.selectedRelations.some(r => link.type.indexOf(r) > -1)){
                    if(link.type.indexOf("select") > -1){
                        this.forceGraphRef.current.highlightLink(link, 0xfff000, 1.25)
                    }
                    else if(link.type.indexOf("update") > -1) {
                        this.forceGraphRef.current.highlightLink(link, 0x000fff, 1.25)
                    }
                    else if(link.type.indexOf("delete") > -1) {
                        this.forceGraphRef.current.highlightLink(link, 0xf0f0f0, 1.25)
                    }
                    else if(link.type.indexOf("insert") > -1) {
                        this.forceGraphRef.current.highlightLink(link, 0xff00ff, 1.25)
                    }
                    else
                {
                    this.forceGraphRef.current.unhighlightLink(link);
                }
                }
                else
                {
                    this.forceGraphRef.current.unhighlightLink(link);
                }
            }
        }

        return <ForceGraph ref={this.forceGraphRef} nodes={this.nodes} links={this.links} width={window.innerWidth * .7} height={window.innerHeight} />
    }

    handleStoredProcSelectionChanged(event) {
        const selected = [];
        if(event && event.target && event.target.options) {
            for(let i = 0; i < event.target.options.length; i++) {
                const option  = event.target.options[i];
                if(option.selected)
                    selected.push(option.value);
            }
        }
        this.props.dispatch(setStoredProcedureSelection(selected));
    }

    handleTableSelectionChanged(event) {
        const selected = [];
        if(event && event.target && event.target.options) {
            for(let i = 0; i < event.target.options.length; i++) {
                const option  = event.target.options[i];
                if(option.selected)
                    selected.push(option.value);
            }
        }
        this.props.dispatch(setTableSelection(selected));
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
                    <ButtonGroup>
                        <Button onClick={(e) => this.handleGraphDataViewToggle(true)}>Graph</Button>
                        <Button onClick={(e) => this.handleGraphDataViewToggle(false)}>Table</Button>
                    </ButtonGroup>
                    <FormGroup controlId="storedProceduresSelection">
                        <ControlLabel>Stored Procedures</ControlLabel>
                        <FormControl componentClass="select" multiple onChange={this.handleStoredProcSelectionChanged}>
                            {this.props.storedProcs.map(createProcOption)}
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="tableSelection">
                        <ControlLabel>Tables</ControlLabel>
                        <FormControl componentClass="select" multiple onChange={this.handleTableSelectionChanged}>
                            {this.props.tables.map(createTableOption)}
                        </FormControl>
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
                    <Button onClick={(e) => this.highlightHotspots(true)}>Highlight Hotspots</Button>
                </div>
                </div>
          </form>       
        )
    }

    highlightHotspots(isOn) {
        if(isOn) {
            for(let a of this.nodeDegree.entries()) {
                const id = a[0];
                const num = a[1];

                if(num > 5) {
                    const node = this.procLookup.get(id) || this.tableLookup.get(id);
                    if(!node)
                        return;
                    this.forceGraphRef.current.highlightNode(node, 0xff0000, 3);
                }
            }
        }
        else {
            ;
        }
    }

    renderTable() {
        const seenProcs = {};
        const seenTables = {};
        const rows = [];
        
        for(let i = 0; i < this.props.relations.length; i++){
            const rel = this.props.relations[i];
            seenProcs[rel.sp.value] = true;
            seenTables[rel.tb.value] = true;
            rows.push([rel.sp.value, rel.rel.value, rel.tb.value]);
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

        for(let i = 0; i < rows.count; i++) {
            rows[i].key = v4();
        }

        function renderRow(row, index) {
            return (<tr key={row.key}>
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
    return {storedProcs: state.allDb.storedProcs, 
        loaded: state.allDb.loaded, 
        tables: state.allDb.tables, 
        relations: state.allDb.relations, 
        isGraphView: state.allDb.isGraphView, selectedStoredProcedures: state.allDb.selectedStoredProcedures, selectedTables: state.allDb.selectedTables, selectedRelations: state.allDb.selectedRelations};
}

export default connect(mapStateToProps)(AllDb);
