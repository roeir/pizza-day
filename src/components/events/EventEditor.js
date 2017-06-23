import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateEventStatus } from '../../actions/eventActions';
import { addFlashMessage } from '../../actions/flashMessages';

class EventEditor extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    updateEventStatus: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
  };

  state = {
    status: 'ordering',
    redirect: false,
    isLoading: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      isLoading: true
    });

    const { params: { id } } = this.props.match;
    const { status } = this.state;

    this.props.updateEventStatus(id, { status })
      .then(({data}) => {
        if (data.success) {
          this.props.addFlashMessage({
            type: 'success',
            text: 'Done!'
          });
          this.setState({
            isLoading: false,
            redirect: true
          });
        }
      })
      .catch(({response: {data}}) => {
        this.props.addFlashMessage({
          type: 'error',
          text: 'Failed to send data'
        });
        this.setState({
          isLoading: false
        });
      });
  };

  render() {
    const { status, isLoading, redirect } = this.state;

    return (
      <div className="container">
        {
          redirect ? (
            <Redirect to="/events" />
          ) : (
            <div className="row">
              <div className="col-md-4 col-md-offset-4">
                <form onSubmit={ this.handleSubmit }>
                  <div className="form-group">
                    <label className="control-label">Status</label>
                    <select
                      name="status"
                      onChange={ this.handleChange }
                      className="form-control"
                      disabled={ false }
                      value={ status }
                    >
                      <option value="ordering">Ordering</option>
                      <option value="ordered">Ordered</option>
                      <option value="delivering">Delivering</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <button disabled={ isLoading } className="btn btn-primary btn-lg" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default connect(null, {
  addFlashMessage,
  updateEventStatus
})(EventEditor);