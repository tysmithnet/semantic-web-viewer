import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { login } from 'actions/index';

export class Home extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  handleClickLogin = (e) => {

  };

  render() {

    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Home);
