import axios from "axios";

export const createGroupRequest = (groupData) => {
  return (dispatch) => {
    return axios.post('/api/groups', groupData);
  };
};

export const fetchUserGroups = () => {
  return (dispatch) => {
    return axios.get('/api/groups');
  };
};

export const joinUserRequest = (groupId, userData) => {
  return (dispatch) => {
    return axios.put(`/api/groups/${ groupId }`, userData);
  };
};

export const isGroupExist = (ident) => {
  return (dispatch) => {
    return axios.get(`/api/groups/${ ident }`);
  };
};