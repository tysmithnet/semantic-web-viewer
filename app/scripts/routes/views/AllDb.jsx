import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from '../../constants';

export class AllDb extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
        this.state = {
          isGraphView: true
        }
    }

    componentWillMount() {
        this
            .props
            .dispatch({type: ActionTypes.ALL_DB_LOAD_REQUEST});
    }

    componentDidUpdate() {
        if (this.props.loaded && this.graphRef && !this.graph) {
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
                .width(this.graphRef.current.getBoundingClientRect().width)
                .height(window.innerHeight)
                .graphData({nodes: this.nodes, links: this.links});
        }
    }

    loadData() {}

    handleGraphDataViewToggle(event) {
        this.setState({...this.state, isGraphView: event.target.checked});
    }

    render() {
        if (this.props.loaded) {
            let output;
            if(this.state.isGraphView) {
                output = (
                    <div className="graph" >
                    <div ref={this.graphRef}></div>
                    </div>
                )
            }
            else {
                output = (
                    <div className="data">datatataat</div>
                )
            }
            return (
                <div className="all-db">
                    <div className="controls">
                       Graph View: <input type="checkbox" onChange={this.handleGraphDataViewToggle} />
                    </div>
                    <div className="output">
                       {output}
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
    return {storedProcs: state.allDb.storedProcs, loaded: state.allDb.loaded, tables: state.allDb.tables, relations: state.allDb.relations};
}

export default connect(mapStateToProps)(AllDb);
