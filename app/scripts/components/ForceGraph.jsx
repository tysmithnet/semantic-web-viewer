import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ForceGraph3D from '3d-force-graph';
import {ActionTypes} from 'constants';
import {toggleGraphView, setStoredProcedureSelection} from 'actions/views/all-db';
import cx from 'classnames';
import {v4} from "uuid";
import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import {Color, ShaderMaterial, Mesh, FrontSide, AdditiveBlending} from 'three';

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
    this.vertexShader = document.getElementById( 'vertexShader'   ).textContent
    this.fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentDidMount(){
    if(this.props.nodes) {
      
      const factory = new ForceGraph3D();
      this.graph = factory(this.graphRef.current)
          .nodeAutoColorBy(n => n.type)
          .linkAutoColorBy(l => l.type)
          .width(this.props.width) // from styless
          .height(this.props.height)
          .graphData({nodes: this.props.nodes, links: this.props.links})
      }
  }

  sayHi(){
    console.log("hi!")
  }

  unhighlightNode(node) {
    if(node.highlight) {
      node.__threeObj.remove(node.highlight);
      node.highlight = null;
    }
  }

  highlightNode(node, color, scale) {
      this.unhighlightNode(node);
      const geometry = node.__threeObj.geometry;
      const camera = this.graph.camera();
      var customMaterial = new ShaderMaterial( 
        {
            uniforms: 
          { 
            "c":   { type: "f", value: 1.0 },
            "p":   { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new Color(color) },
            viewVector: { type: "v3", value: camera.position }
          },
          vertexShader: this.vertexShader,
          fragmentShader: this.fragmentShader,
          side: FrontSide,
          blending: AdditiveBlending,
          transparent: true
        }   );
          
        const glow = new Mesh(geometry.clone(), customMaterial.clone() );
        glow.scale.multiplyScalar(scale);
        node.__threeObj.add(glow);
        node.highlight = glow;
  }

  render() {
    return (
      <div ref={this.graphRef}></div>
    );
  }
}
