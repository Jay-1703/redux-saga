import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { connect, useSelector, useDispatch } from 'react-redux';
import { resetAllMembersIds } from '../../redux/memberReducers';
import { handleToogleDrawer, resetAllGroupIds } from '../../redux/groupReduser';

import { CreateRecords, DeleteRecords, UpdateRecords } from '../../Api/groupActionRecords';
import { CreateMembersRecords, UpdateMembersRecords, DeleteMembersRecords } from '../../Api/membersActionsRecords';

import ReorderIcon from '@mui/icons-material/Reorder';
import { IconButton } from '@mui/material';

import Model from '../model/Model';
import Snackbar from '../snackbar/Snackbar'

const Header = () => {
  const path = useLocation()
  const navigate = useNavigate()
  const [model, setModel] = useState({ open: false, title: '', description: '' })
  const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })

  const groups = useSelector((state) => state.groups.groups);
  const newCreatedGroupsIds = useSelector((state) => state.groups.newCreatedGroupsIds);
  const updatedGroupsIds = useSelector((state) => state.groups.updatedGroupsIds);
  const deletedGroupsIds = useSelector((state) => state.groups.deletedGroupsIds);

  const members = useSelector((state) => state.members.members);

  const newCreatedMembersIds = useSelector((state) => state.members.newCreatedMembersIds);
  const updatedMembersIds = useSelector((state) => state.members.updatedMembersIds);
  const deletedMembersIds = useSelector((state) => state.members.deletedMembersIds);

  const dispatch = useDispatch()

  let apiCount = 0;

  const handleSaveData = async () => {
    try {
      // -------------- Save groups data ---------------
      const newData = groups?.filter(row => newCreatedGroupsIds?.includes(row.groupId))
        .map(item => ({ group_name: item.group_name }));

      for (const data of newData) {
        await CreateRecords(data);
        apiCount++;
      }

      const updatedGroups = groups?.filter(row => updatedGroupsIds?.includes(row.groupId));

      for (const group of updatedGroups) {
        await UpdateRecords(group.groupId, group);
        apiCount++;
      }

      for (const id of deletedGroupsIds) {
        await DeleteRecords(id);
        apiCount++;
      }

      // -------------- Save members data ---------------
      const newMembers = members?.filter(row => newCreatedMembersIds.includes(row.memberId));
      const newMembersDataGroupIds = newMembers.map(item => parseInt(item.groupId));

      const newMembersData = newMembers?.map(item => ({
        email: item.email,
        lastname: item.lastname,
        firstname: item.firstname,
        number: parseInt(item.number)
      }));
      if (newMembersData?.length > 0) {
        for (let i = 0; i < newMembersData.length; i++) {
          await CreateMembersRecords(newMembersDataGroupIds[i], newMembersData[i]);
          apiCount++;
        }
      }

      const updatedMembers = members?.filter(row => updatedMembersIds.includes(row.memberId));
      const updatedMembersDataIds = updatedMembers.map(item => parseInt(item.memberId));
      const updatedMembersData = updatedMembers.map(item => ({
        email: item.email,
        lastname: item.lastname,
        firstname: item.firstname,
        number: parseInt(item.number)
      }));
      if (updatedMembersData?.length > 0) {
        for (let i = 0; i < updatedMembersData.length; i++) {
          await UpdateMembersRecords(updatedMembersDataIds[i], updatedMembersData[i]);
          apiCount++;
        }
      }

      if (deletedMembersIds?.length > 0) {
        for (const id of deletedMembersIds) {
          await DeleteMembersRecords(id);
          apiCount++;
        }
      }

      if (apiCount == 0) {
        handleCloseLogoutModel();
        setSnackBar({ open: true, message: 'There is no changes to save into database', type: 'info' });
        return
      }
      handleCloseLogoutModel();
      setSnackBar({ open: true, message: 'Data saved successfully into database', type: 'info' });
      dispatch(resetAllGroupIds());
      dispatch(resetAllMembersIds())
      navigate('/dashboard/groups');

    } catch (error) {
      console.error('Error saving data:', error);
      setSnackBar({ open: true, message: 'Failed to save data', type: 'error' });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(resetAllGroupIds())
    dispatch(resetAllMembersIds())
    setModel({ open: false, title: '', description: '' })
    navigate('/login')
  }

  const handleCloseLogoutModel = () => {
    setModel({ open: false, title: '', description: '' })
  }

  const handleOpenLogoutModel = () => {
    setModel({ open: true, title: 'Logout', description: 'Are you sure! Do you want to Logout?' })
  }

  const handleCloseSnackBar = () => {
    setSnackBar({ open: false, message: '', type: '' })
  }

  return (
    <div className='text-black py-3 shadow w-full'>
      <div className='flex items-center'>
        <div className='grow ml-2 '>
          <div className='block md:hidden'>
            <IconButton onClick={() => dispatch(handleToogleDrawer())}>
              <ReorderIcon />
            </IconButton>
          </div>
        </div>

        <div className='px-5'>
          <ul className='flex justify-center items-center gap-3'>
            <li>
              <NavLink to='/dashboard' className={`text-sm md:text-md font-medium ${path.pathname.endsWith('dashboard') ? 'text-blue-600' : ''}`}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/dashboard/groups' className={`text-sm md:text-md font-medium ${path.pathname.endsWith('groups') ? 'text-blue-600' : ''}`}>Groups</NavLink>
            </li>
            <li>
              <button onClick={handleOpenLogoutModel} className="px-5 py-1 md:font-medium">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Model open={model.open} title={model.title} description={model.description} handleClose={handleCloseLogoutModel} actionFunction={handleLogout} handleSaveData={handleSaveData} />
      <Snackbar open={snackbar.open} message={snackbar.message} type={snackbar.type} onclose={handleCloseSnackBar} />

    </div>
  )
}

// const mapStateToProps = (state) => ({
//   drawer: state.drawer
// })

// const mapDispatchToProps = {
//   handleToogleDrawer
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Header);
export default Header