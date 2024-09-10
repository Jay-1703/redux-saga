import { createSlice } from "@reduxjs/toolkit";

const initialStates = {
    groupId: 1,
    groups: [],
    memberId: 1,
    isLoading: false,
    drawer: true
}

const groupSlice = createSlice({
    name: 'groups',
    initialStates,
    reducers: {
        addGroup: (state, action) => {
            const newGroup = {
                groupId: state.groupId,
                groupname: action.payload.groupname,
                members: []
            };
            state.groups.push(newGroup)
            state.groupId += 1
        },
        editGroup: (state, action) => {
            const group = {
                groupname: action.payload.groupname,
                members: action.payload.members,
            };
            const filterGroup = state.groups.findIndex((row) => row.groupId === action.payload.groupId)
            if (filterGroup !== -1) {
                state.groups[filterGroup] = { ...group, groupId: action.payload.groupId, };
            }
        },
        deleteGroup: (state, action) => {
            const groupIds = action.payload;
            state.groups = state.groups.filter(
                (group) => !groupIds.includes(group.groupId)
            );
        },
        addMember: (state, action) => {
            const id = action.payload.groupId
            const newMemberData = {
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                email: action.payload.email,
                number: action.payload.number,
            }
            const group = state.groups.find((row) => row.groupId === id)
            if (group) {
                const newMember = {
                    ...newMemberData, memberId: state.memberId,
                };
                group.members.push(newMember);
                state.memberId += 1;
            }
        },
        editMember: (state, action) => {
            const memberData = {
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                email: action.payload.email,
                number: action.payload.number,
            };
            const group = state.groups.find((group) => group.groupId === action.payload.groupId);
            if (group) {
                const memberIndex = group?.members?.findIndex(
                    (member) => member.memberId === action.payload.memberId
                );
                if (memberIndex !== -1) {
                    group.members[memberIndex] = { ...memberData, memberId: action.payload.memberId };
                }
            }
        },
        deleteMember: (state, action) => {
            const membersId = action.payload.selectedMembers;
            const group = state.groups.find((group) => group.groupId === action.payload.groupId);
            if (group) {
                group.members = group.members.filter(
                    (member) => !membersId.includes(member.memberId)
                );
            }
        },
        handleToogleDrawer: (state, action) => {
            state.drawer = !state.drawer
        },
        getAllGroups: (state, action) => {
            state.isLoading = true
        },
        getAllGroupsSuccess: (state, action) => {
            state.groups = action.payload.groups
            state.isLoading = false
        }
    }
})
export const {
    getAllGroups,
    getAllGroupsSuccess,
    addGroup,
    editGroup,
    deleteGroup,
    addMember,
    editMember,
    deleteMember,
    handleToogleDrawer
} = groupSlice.actions

export default groupSlice.reducer;
