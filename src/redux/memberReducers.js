import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    memberId: 0,
    members: [],
    isLoading: false,
    error: null,
    newCreatedMembersIds: [],
    deletedMembersIds: [],
    updatedMembersIds: [],
};

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        setAllMembers: (state, action) => {
            state.isLoading = true;
            state.members = action.payload;
            let maxMemberId = 0;
            for (let index = 0; index < action.payload?.length; index++) {
                const element = action.payload[index];
                if (element.memberId > maxMemberId) {
                    maxMemberId = element.memberId
                }
            }
            state.memberId = maxMemberId || 0
            state.isLoading = false;
        },

        addMember: (state, action) => {
            const newMemberData = {
                memberId: state.memberId + 1,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                email: action.payload.email,
                number: action.payload.number,
                groupId: action.payload.groupId
            }
            state.newCreatedMembersIds = [...state.newCreatedMembersIds, state.memberId + 1]
            state.members.push(newMemberData)
            state.memberId = state.memberId + 1
        },

        editMember: (state, action) => {
            const updateId = action.payload.memberId

            const memberData = {
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                email: action.payload.email,
                number: action.payload.number,
                groupId: action.payload.groupId
            };
            const memberIndex = state.members?.findIndex(
                (member) => member.memberId === action.payload.memberId
            );
            if (memberIndex !== -1) {
                state.members[memberIndex] = { ...memberData, memberId: action.payload.memberId };
            }
            state.updatedMembersIds.push(updateId)

        },

        deleteMember: (state, action) => {
            const membersId = action.payload;
            state.deletedMembersIds = [...state.deletedMembersIds, ...membersId];
            state.members = state.members.filter(
                (member) => !membersId.includes(member.memberId)
            );
            for (let index = 0; index < state.deletedMembersIds.length; index++) {
                const deleteId = state.deletedMembersIds[index];
                for (let j = 0; j < state.newCreatedMembersIds.length; j++) {
                    const newId = state.newCreatedMembersIds[j];

                    if (newId === deleteId) {
                        state.newCreatedMembersIds.splice(j, 1)
                        state.deletedMembersIds.splice(index, 1)
                        state.memberId = state.memberId - 1
                    }
                }
            }
        },

        resetAllMembersIds: (state, action) => {
            state.newCreatedMembersIds = []
            state.updatedMembersIds = []
            state.deletedMembersIds = []
        }
    },
});

export const { members, setAllMembers, addMember, editMember, deleteMember, newCreatedMembersIds, updatedMembersIds, deletedMembersIds, resetAllMembersIds } = membersSlice.actions;

export default membersSlice.reducer;
