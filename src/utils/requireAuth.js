import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { addFlashMessage } from '../actions/flashMessages';

export default (ComposedComponent) => {
  class Authentication extends Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      addFlashMessage: PropTypes.func.isRequired
    };

    componentWillMount() {
      if(!this.props.isAuthenticated) {
        this.props.addFlashMessage({
          type: 'error',
          text: 'You need to login to access this page'
        });
      }
    }

    render() {
      const { isAuthenticated } = this.props;
      return (
        <div>
          { isAuthenticated ? <ComposedComponent {...this.props} /> :
            <Redirect to={{ pathname: '/' }} />
          }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  };

  return connect(mapStateToProps, { addFlashMessage })(Authentication);
};