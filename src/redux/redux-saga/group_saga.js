import { call, put, takeEvery } from 'redux-saga/effects';
import { getAllGroupsSuccess, getAllGroupsFailure } from '../groupReduser';
import { setAllMembers } from '../memberReducers';

function fetchGroupsApi() {
  return fetch('http://localhost:8080/api/groups', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

function fetchMempersApi(id) {
  return fetch(`http://localhost:8080/api/group/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

function* fetchGroups() {
  try {
    const response = yield call(fetchGroupsApi);
    if (response.ok) {
      let count = 0;
      const data = yield response.json();
      const filterData = []

      for (const index in data) {
        const member = yield fetchMempersApi(data[index]?.groupId)
        const members = yield member.json()

        members.map((row, rowIndex) => {
          filterData.push({ ...row, groupId: data[count]?.groupId})
        })
        count++
      }
      yield put(setAllMembers(filterData))

      yield put(getAllGroupsSuccess(data));
    } else {
      yield put(getAllGroupsFailure(`HTTP error! status: ${response.status}`));
    }
  } catch (error) {
    yield put(getAllGroupsFailure(error.message));
  }
}

function* groupsSaga() {
  yield takeEvery('groups/getAllGroups', fetchGroups);
}

export default groupsSaga;
