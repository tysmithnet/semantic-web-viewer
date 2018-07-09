import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from '../../constants';
import {toggleGraphView} from 'actions/views/all-db';
import cx from 'classnames';

export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
        this.handleGraphDataViewToggle = this.handleGraphDataViewToggle.bind(this);
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST});
    }

    componentDidUpdate() {
        if (this && this.props && this.props.loaded && this.graphRef && !this.graph) {
            const procNodes = this
                .props
                .storedProcs
                .map(x => {
                    return {id: x.sp.value, name: x.title.value, type: "storedProc"}; // todo: constant value
                });

            const tableNodes = this
                .props
                .tables
                .map(x => {
                    return {id: x.tb.value, name: x.title.value, type: "table"}; // todo: constant value
                });

            const links = this
                .props
                .relations
                .map(x => {
                    return {source: x.sp.value, target: x.tb.value, type: x.rel.value}
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

    loadData() {}

    handleGraphDataViewToggle(event) {
        this.props.dispatch(toggleGraphView(!event.target.checked));
    }

    render() {
        if (this.props.loaded) {
            let output;
            return (
                <div className="all-db">
                    <div className="controls">
                       Graph View: <input type="checkbox" onChange={this.handleGraphDataViewToggle} defaultChecked={this.props.isGraphView} />
                    </div>
                    <div className="output">
                        <div className={cx('graph', {'hidden': this.props.isGraphView})} >
                            <div ref={this.graphRef}></div>
                        </div>
                        <div className={cx('data', {'hidden': !this.props.isGraphView})}>datatataat</div>
                    </div>
                </div>
            );
        } else {
            return <span>Loading..</span>
        }
    }
}

/* istanbul ignore next */
function mapStateToProps(state) {
    return {storedProcs: state.allDb.storedProcs, loaded: state.allDb.loaded, tables: state.allDb.tables, relations: state.allDb.relations, isGraphView: state.allDb.isGraphView};
}

export default connect(mapStateToProps)(AllDb);
