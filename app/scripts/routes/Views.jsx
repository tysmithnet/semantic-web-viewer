import React from 'react';
import { Link } from 'react-router-dom';
import {Jumbotron, Button, Well} from "react-bootstrap";

export default class Views extends React.PureComponent {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Jumbotron>
            <h1>Domain Data Views</h1>
            <p>
              This is a growing collection of various ways in which our collective knowledge can 
              sewn together and visualized to gain insight into our domain.
            </p>
            </Jumbotron>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <Well>
              <Link to="/views/all-db">All Database Objects</Link><br/>
              See how all of our database objects are connected.
            </Well>
          </div>
        </div>
      </div>
    );
  }
}
