import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";

export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
        this.handleGraphDataViewToggle = this.handleGraphDataViewToggle.bind(this);
        this.handleStoredProcedureSelected = this.handleStoredProcedureSelected.bind(this);
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST}); // todo: make action
    }

    componentDidUpdate() {
        if (this && this.props && this.props.loaded && this.graphRef && !this.graph) {
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

            this.graph = new ForceGraph3D();
            this
                .graph(this.graphRef.current)
                .width(window.innerWidth * .7) // from styless
                .height(window.innerHeight)
                .graphData({nodes: this.nodes, links: this.links});
        }
    }


    handleGraphDataViewToggle(event) {
        this.props.dispatch(toggleGraphView(event.target.checked));
    }

    handleStoredProcedureSelected(event) {
        const options = event.target.options;
        const values = options.filter(o => o.selected).map(o => o.value);
        this.props.dispatch(setStoredProcedureSelection(values));
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
                            <div ref={this.graphRef}></div>
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
            <div>
                Graph View: <input type="checkbox" onChange={this.handleGraphDataViewToggle} defaultChecked={this.props.isGraphView} /><br />
                Stored Procs: 
                <select multiple autocomplete onChange={this.handleStoredProcedureSelected}>
                    {this.props.storedProcs.map(createProcOption)}
                </select><br/>
                Relation: 
                <select multiple autocomplete>
                    <option value="http://example.com/rel/select">Select</option>
                    <option value="http://example.com/rel/insert">Insert</option>
                    <option value="http://example.com/rel/update">Update</option>
                    <option value="http://example.com/rel/delete">Delete</option>
                </select><br/>
                Tables: 
                <select multiple autocomplete>
                    {this.props.tables.map(createTableOption)}
                </select>
            </div>
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
    return {storedProcs: state.allDb.storedProcs, loaded: state.allDb.loaded, tables: state.allDb.tables, relations: state.allDb.relations, isGraphView: state.allDb.isGraphView};
}

export default connect(mapStateToProps)(AllDb);
