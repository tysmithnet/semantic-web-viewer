import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView, setStoredProcedureSelection} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import ForceGraph from 'components/ForceGraph';

export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.forceGraphRef = React.createRef();
        this.handleGraphDataViewToggle = this.handleGraphDataViewToggle.bind(this);
        this.handleStoredProcSelectionChanged = this.handleStoredProcSelectionChanged.bind(this);
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST}); // todo: make action
    }

    componentDidUpdate() {
        if(this.forceGraphRef.current) {
            this.forceGraphRef.current.sayHi();
        }
        if (this && this.props && this.props.loaded && this.graphRef && !this.graph) {
            
        }
    }

    handleGraphDataViewToggle(event) {
        this.props.dispatch(toggleGraphView(event.target.checked));
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

            const tableNodes = this
                .props
                .tables
                .map(x => {
                    return {key: v4(), id: x.tb.value, name: x.title.value, type: "table"}; // todo: constant value
                });

            const links = this
                .props
                .relations
                .map(x => {
                    return {key: v4(), source: x.sp.value, target: x.tb.value, type: x.rel.value}
                });

            this.nodes = [
                ...procNodes,
                ...tableNodes
            ];
            this.links = links;
        }

        const selectedNodes = [...(this.props.selectedStoredProcedures || []), ...(this.props.selectedTables || [])]
        return <ForceGraph ref={this.forceGraphRef} nodes={this.nodes} links={this.links} width={window.innerWidth * .7} height={window.innerHeight} selectedNodes={selectedNodes}/>
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

    renderControls() {
        function createProcOption(storedProc) {
            return (<option key={storedProc.sp.value}>
                {storedProc.title.value}
            </option>);
        }

        function createTableOption(table) {
            return (<option key={table.tb.id}>
                {table.title.value}
            </option>);
        }

        return (
            <form>
                <div className="container">
                    <div className="col-sm-12">
                    <FormGroup controlId="formControlsSelectMultiple">
                        <ControlLabel>Multiple select</ControlLabel>
                        <FormControl componentClass="select" multiple onChange={this.handleStoredProcSelectionChanged}>
                            {this.props.storedProcs.map(createProcOption)}
                        </FormControl>
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
    return {storedProcs: state.allDb.storedProcs, loaded: state.allDb.loaded, tables: state.allDb.tables, relations: state.allDb.relations, isGraphView: state.allDb.isGraphView, selectedStoredProcedures: state.allDb.selectedStoredProcedures, selectedTables: [], selectedRelations: []};
}

export default connect(mapStateToProps)(AllDb);
