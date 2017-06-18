import axios from "axios";

export const createGroupRequest = (groupData) => {
  return (dispatch) => {
    return axios.post('/api/groups', groupData);
  };
};

export const isGroupExist = (ident) => {
  return (dispatch) => {
    return axios.get(`/api/groups/${ ident }`);
  };
};