import axios from 'axios';

export const fetchUserEvents = () => {
  return (dispatch) => {
    return axios.get('/api/events');
  };
};

export const updateEventStatus = (eventId, status) => {
  return (dispatch) => {
    return axios.put(`/api/events/${ eventId }/status`, status);
  };
};

export const joinUserRequest = (eventId, userData) => {
  return (dispatch) => {
    return axios.put(`/api/events/${ eventId }`, userData);
  };
};

export const createEventRequest = (eventData) => {
  return (dispatch) => {
    return axios.post('/api/events', eventData);
  };
};