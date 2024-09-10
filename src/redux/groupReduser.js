import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groupId: 0,
  groups: [],
  isLoading: false,
  error: null,
  drawer: true,
  newCreatedGroupsIds: [],
  deletedGroupsIds: [],
  updatedGroupsIds: [],
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    getAllGroups: (state) => {
      state.isLoading = true;
    },

    getAllGroupsSuccess: (state, action) => {
      state.groups = action.payload;
      let maxGroupId = 0;
      for (let index = 0; index < action.payload?.length; index++) {
        const element = action.payload[index];
        if (element.groupId > maxGroupId) {
          maxGroupId = element.groupId
        }
      }
      state.groupId = maxGroupId || 0
      state.isLoading = false;
    },

    getAllGroupsFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    addGroup: (state, action) => {
      const newGroup = {
        groupId: state.groupId + 1,
        group_name: action.payload.group_name,
      };
      state.newCreatedGroupsIds = [...state.newCreatedGroupsIds, state.groupId + 1]
      state.groups.push(newGroup)
      state.groupId = state.groupId + 1
    },

    editGroup: (state, action) => {
      const updateId = action.payload.groupId
      const group = {
        group_name: action.payload.group_name,
      };
      const filterGroup = state.groups.findIndex((row) => row.groupId === action.payload.groupId)
      if (filterGroup !== -1) {
        state.groups[filterGroup] = { ...group, groupId: action.payload.groupId, };
      }
      state.updatedGroupsIds.push(updateId)
    },

    deleteGroup: (state, action) => {
      const groupIds = action.payload;
      state.deletedGroupsIds = [...state.deletedGroupsIds, ...groupIds];
      state.groups = state.groups.filter(
        (group) => !groupIds.includes(group.groupId)
      );
      for (let index = 0; index < state.deletedGroupsIds.length; index++) {
        const deleteId = state.deletedGroupsIds[index];
        for (let j = 0; j < state.newCreatedGroupsIds.length; j++) {
          const newId = state.newCreatedGroupsIds[j];

          if (newId === deleteId) {
            state.newCreatedGroupsIds.splice(j, 1)
            state.deletedGroupsIds.splice(index, 1)
            state.groupId = state.groupId - 1
          }
        }
      }
    },

    resetAllGroupIds: (state, action) => {
      state.newCreatedGroupsIds = []
      state.updatedGroupsIds = []
      state.deletedGroupsIds = []
    },

    handleToogleDrawer: (state, action) => {
      state.drawer = !state.drawer
    },
  },
});

export const { handleToogleDrawer, getAllGroups, getAllGroupsSuccess, getAllGroupsFailure, addGroup, editGroup, deleteGroup, newCreatedGroupsIds, updatedGroupsIds, deletedGroupsIds, drawer, resetAllGroupIds } = groupsSlice.actions;

export default groupsSlice.reducer;
