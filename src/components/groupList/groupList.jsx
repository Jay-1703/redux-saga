import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteGroup } from '../../redux/groupReduser'
import { deleteMember } from '../../redux/memberReducers'

import { Add, Delete, EditNote } from '@mui/icons-material'
import { Checkbox } from '@mui/material'

import Snackbar from '../snackbar/Snackbar'
import GroupModel from '../model/GroupModel'
import Model from '../model/Model'

const GroupList = ({ groups }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [selectedGroup, setSelectedGroup] = useState([])
  const [model, setModel] = useState({ open: false, title: '', id: '' })
  const [deleteModel, setDeleteModel] = useState({ open: false, title: '', description: '' })
  const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })
  const [allGroupSelected, setAllGroupSelected] = useState(false)

  const members = useSelector((state) => state.members.members)
  const dispatch = useDispatch()

  const handleCheckAll = (event) => {
    const checked = event.target.checked
    if (!checked) {
      setSelectedGroup([])
      setAllGroupSelected(checked)
      return
    }
    setAllGroupSelected(checked)
    groups?.map((row, index) => {
      setSelectedGroup((prev) => {
        const data = [...prev]
        if (!data.includes(row.groupId)) {
          data.push(row.groupId)
        }
        return data || []
      })
    })
  }

  const handleSelectGroups = (id) => {
    setSelectedGroup((prev) => {
      const data = [...prev]
      if (data.includes(id)) {
        data.splice(data.indexOf(id), 1)
        return data
      }
      data.push(id)
      return data
    })
  }

  const handleOpenGroupModel = (type) => {
    if (type === 'add') {
      setModel({ open: true, title: 'Create' })
      return
    }
    if (type === 'delete') {
      setDeleteModel({ open: true, title: 'Delete Group', description: 'Are you sure! Do you want to Delete Group?' })
      return
    }
    else {
      setModel({ open: true, title: 'Update', id: selectedGroup[0] })
      return
    }
  }

  const handleCloseGroupModel = () => {
    setModel({ open: false, title: '', id: '' })
  }

  const handleCloseDeleteModel = () => {
    setDeleteModel({ open: false, title: '', description: '' })
  }

  const handleDeleteGroups = async () => {
    const membersId = members?.filter((row) => selectedGroup.includes(row.groupId)).map((item) => { return item.memberId })
    dispatch(deleteMember(membersId))
    dispatch(deleteGroup(selectedGroup))
    setSelectedGroup([])
    setAllGroupSelected(false)

    setDeleteModel({ open: false, title: '', description: '' })
    setSnackBar({ open: true, message: 'Group deleted successfully', type: 'success' })
    navigate('/dashboard/groups')
  }

  const handleCloseSnackBar = () => {
    setSnackBar({ open: false, message: '', type: '' })
  }

  useEffect(() => {
    if (selectedGroup?.length > 0) {
      if (selectedGroup.length === groups.length) {
        setAllGroupSelected(true)
      } else {
        setAllGroupSelected(false)
      }
      return
    }
    setAllGroupSelected(false)
  }, [selectedGroup])

  return (
    <div className='w-full overflow-x-hidden h-[40rem] z-10 border'>
      {/* ========  Add , Delete, Update Buttons for groups =========*/}
      <div className='flex justify-start items-center p-2 gap-2'>
        <div className='grow w-full'>
          {
            groups?.length > 0 ? (
              <Checkbox checked={allGroupSelected} onClick={(e) => handleCheckAll(e)} sx={{
                color: 'black',
              }} />
            ) : null
          }
        </div>
        {
          selectedGroup?.length > 0 ? null : (
            <button onClick={() => handleOpenGroupModel('add')} className="p-2 rounded-full font-medium bg-blue-600 text-sm cursor-pointer">
              <Add />
            </button>
          )
        }
        {
          selectedGroup?.length > 0 && selectedGroup?.length <= 1 && (
            <button className="p-2 rounded-full font-medium bg-green-600 text-sm cursor-pointer">
              <EditNote onClick={() => handleOpenGroupModel('update')} />
            </button>
          )
        }
        {
          selectedGroup?.length > 0 && (
            <div className="p-2 rounded-full font-medium bg-red-600 text-sm cursor-pointer">
              <Delete onClick={() => handleOpenGroupModel('delete')} />
            </div>
          )
        }
      </div>

      {/* ========  List of groups =========*/}
      <div className='chat-body p-2 flex-1 overflow-y-auto'>
        {
          groups?.length > 0 ?
            groups?.map((group, index) => (
              <div key={index} className={`flex justify-start items-center gap-2 hover:bg-gray-100 rounded-lg relative cursor-pointer mb-3 ${group.groupId === parseInt(id) ? 'bg-gray-100' : ''}`}>
                <div>
                  <Checkbox checked={selectedGroup?.includes(group.groupId)} onClick={() => handleSelectGroups(group.groupId)} sx={{
                    color: 'black',
                  }} />
                </div>

                <div className='w-full'>
                  <NavLink to={`/dashboard/groups/${group.groupId}`}>
                    <div className={`w-full flex items-center py-1 text-black`}>
                      <div className="min-w-0 ml-2 mr-6 text-start flex items-center">
                        <p className="font-bold">{group.group_name}</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            )) :
            <div className='text-center text-black text-lg font-semibold mt-56'>
              <p>No groups</p>
            </div>
        }
      </div>

      <GroupModel open={model.open} handleClose={handleCloseGroupModel} title={model.title} id={model.id} setSelectedGroup={setSelectedGroup} />
      <Model open={deleteModel.open} title={deleteModel.title} description={deleteModel.description} handleClose={handleCloseDeleteModel} actionFunction={handleDeleteGroups} />
      <Snackbar open={snackbar.open} message={snackbar.message} type={snackbar.type} onclose={handleCloseSnackBar} />
    </div>
  )
}

// const mapStateToProps = (state) => ({
//   groups: state.groups
// })

// const mapDispatchToProps = {
//   deleteGroup
// };

// export default connect(mapStateToProps, mapDispatchToProps)(GroupList);

export default GroupList