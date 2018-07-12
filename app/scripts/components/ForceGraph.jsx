import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from 'constants';
import {toggleGraphView, setStoredProcedureSelection} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';


export default class ForceGraph extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    nodes: PropTypes.array,
    links: PropTypes.array,
    selectedNodes: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.graph = null;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("ForceGraph.componentDidUpdate");
    console.dir(prevProps, prevState, snapshot);
  }

  componentDidMount(){
    if(this.props.nodes) {
      
      this.graph = new ForceGraph3D();
      this
          .graph(this.graphRef.current)
          .nodeAutoColorBy(n => n.type)
          .linkAutoColorBy(l => l.type)
          .width(this.props.width) // from styless
          .height(this.props.height)
          .graphData({nodes: this.props.nodes, links: this.props.links});
      console.dir(this.graph);
    }
  }

  render() {
    return (
      <div ref={this.graphRef}></div>
    );
  }
}
