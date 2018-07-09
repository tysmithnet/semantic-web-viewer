import React from 'react';
import { Link } from 'react-router-dom';

export default class Views extends React.PureComponent {
  render() {
    return (
      <ul>
        <li><Link to="/views/all-db">All DB Objects</Link></li>
      </ul>
    );
  }
}
