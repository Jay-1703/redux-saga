import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getAllGroups } from '../redux/groupReduser';
import { deleteMember, getAllMembers, setAllMembers } from '../redux/memberReducers';

import Auth from '../utils/auth'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Add, Delete, EditNote } from '@mui/icons-material'

import Snackbar from '../components/snackbar/Snackbar'
import GroupList from '../components/groupList/groupList'
import MemberModel from '../components/model/MemberModel'
import Model from '../components/model/Model'
import Table from '../components/table/table'

const Groups = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [members, setMembers] = useState([])

  const rowPerPage = [5, 6, 7]
  const [selectedRowPerPage, setSelectedRowPerPage] = useState(5)
  const [filterDataTotalPage, setFilterDataTotalPage] = useState(0)
  const [startShowRecords, setStartShowRecords] = useState(0)
  const [filterDataCount, setFilterDataCount] = useState(selectedRowPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedMembers, setSelectedMembers] = useState([])
  const [allMembersSelected, setAllMembersSelected] = useState(false)

  const [model, setModel] = useState({ open: false, title: '', id: '' })
  const [deleteModel, setDeleteModel] = useState({ open: false, title: '', description: '' })
  const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })

  const groups = useSelector((state) => state.groups.groups)
  const loading = useSelector(state => state.groups.isLoading)
  const drawer = useSelector((state) => state.groups.drawer)

  const membersData = useSelector((state) => state.members.members)

  const dispatch = useDispatch()

  const handleOpenMembersModel = (type) => {
    if (type === 'add') {
      setModel({ open: true, title: 'Add member' })
      return
    }
    if (type === 'delete') {
      setDeleteModel({ open: true, title: 'Delete members', description: 'Are you sure! Do you want to Delete Member?' })
      return
    }
    else {
      setModel({ open: true, title: 'Update member', id: selectedMembers[0] })
      return
    }
  }

  const handleCloseMembersModel = () => {
    setModel({ open: false, title: '', id: '' })
  }

  const handleCloseSnackBar = () => {
    setSnackBar({ open: false, message: '', type: '' })
  }

  const handleCloseDeleteModel = () => {
    setDeleteModel({ open: false, title: '', description: '' })
  }

  const handleDeleteMembers = () => {
    dispatch(deleteMember(selectedMembers))
    setSnackBar({ open: true, message: 'Member deleted successfully', type: 'success' })
    setSelectedMembers([])
    setAllMembersSelected(false)
    handleCloseDeleteModel()
  }

  const handleCheckAll = (event) => {
    const checked = event.target.checked
    if (!checked) {
      setSelectedMembers([])
      setAllMembersSelected(checked)
      return
    }
    setAllMembersSelected(checked)
    members?.map((row, index) => {
      setSelectedMembers((prev) => {
        const data = [...prev]
        if (!data.includes(row.memberId)) {
          data.push(row.memberId)
        }
        return data || []
      })
    })
  }

  const handleSelectGroups = (index) => {
    setSelectedMembers((prev) => {
      const data = [...prev]
      if (data.includes(index)) {
        data.splice(data.indexOf(index), 1)
        return data
      }
      data.push(index)
      return data
    })
  }

  const CreatePagination = () => {
    const pages = [];
    for (let index = 0; index < filterDataTotalPage; index++) {
      pages.push(
        <p
          role='button'
          onClick={(e) => handlePagination(index + 1)}
          className={`${currentPage - 1 === index ? 'border border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-black'} -ml-px relative inline-flex items-center px-4 py-2 border  text-sm leading-5 font-medium focus:z-10 transition ease-in-out duration-150 hover:bg-tertiary`}
        >
          {index + 1}
        </p>
      );
    }
    return pages;
  }

  const handlePagination = (e) => {
    setCurrentPage(e)
    if (parseInt(e) === currentPage) {
      setStartShowRecords(startShowRecords)
      setFilterDataCount(filterDataCount)
    } else {
      setStartShowRecords(parseInt(e) > currentPage ? startShowRecords + selectedRowPerPage : startShowRecords - selectedRowPerPage)
      setFilterDataCount(parseInt(e) > currentPage ? filterDataCount + selectedRowPerPage : filterDataCount - selectedRowPerPage)
    }
  }

  const handleChangeSelectedRows = (count) => {
    setSelectedRowPerPage(count);

    setCurrentPage(1)
    setStartShowRecords(0)
    setFilterDataCount(count)
    setFilterDataTotalPage(Math.ceil(members?.length / count))
  }

  const handleGetMembers = async () => {
    setSelectedMembers([])
    setStartShowRecords(0)
    setCurrentPage(1)
    setSelectedRowPerPage(5)
    setFilterDataCount(5)
    setFilterDataTotalPage(Math.ceil(members?.length / 5))
    setAllMembersSelected(false)

    if (id) {
      const isGroupExites = groups?.findIndex((row) => row.groupId === parseInt(id))
      if (isGroupExites !== -1) {
        const filterData = membersData?.filter((row) => row.groupId === parseInt(id))
        setMembers(filterData)
        setFilterDataTotalPage(Math.ceil(filterData?.length / selectedRowPerPage))
        return
      }
      navigate('/dashboard/groups')
    }
  }

  useEffect(() => {
    const isAuth = Auth()
    if (!isAuth) {
      navigate('/login')
    }
    handleGetMembers()
  }, [id, membersData])

  useEffect(() => {
    if (selectedMembers?.length > 0) {
      if (selectedMembers?.length === members.length) {
        setAllMembersSelected(true)
      } else {
        setAllMembersSelected(false)
      }
      return
    }
    setAllMembersSelected(false)
  }, [selectedMembers])

  return (
    <div className={`w-full flex antialiased text-gray-200 overflow-hidden`}>
      <div className="flex-1 flex flex-row">
        {/* ========  Group List =========*/}
        <div className={`w-[35rem] md:w-80 overflow-x-hidden ${drawer ? 'block' : 'hidden md:block'}`}>
          <GroupList groups={groups} />
        </div>

        <div className='w-full'>
          {/* ======== Show Seleted Group Members =========*/}
          {
            id && (
              <div className='flex justify-center mt-5'>
                <div className='p-3 border border-gray-300'>
                  <div className='flex justify-end items-center p-1 gap-3 w-full'>
                    {
                      selectedMembers?.length > 0 ? null : (
                        <button onClick={() => handleOpenMembersModel('add')} className="p-2 rounded-full font-medium bg-blue-600 text-sm cursor-pointer">
                          <Add />
                        </button>
                      )
                    }
                    {
                      selectedMembers?.length > 0 && selectedMembers?.length <= 1 && (
                        <button className="p-2 rounded-full bg-green-600 cursor-pointer text-sm text-white">
                          <EditNote onClick={handleOpenMembersModel} />
                        </button>
                      )
                    }
                    {
                      selectedMembers?.length > 0 && (
                        <button className="p-2 rounded-full font-medium bg-red-600 text-sm cursor-pointer">
                          <Delete onClick={() => handleOpenMembersModel('delete')} />
                        </button>
                      )
                    }
                  </div>

                  <div>
                    <Table items={members} startShowRecords={startShowRecords} filterDataCount={filterDataCount} selectedMembers={selectedMembers} handleSelectGroups={handleSelectGroups} allMembersSelected={allMembersSelected} handleCheckAll={handleCheckAll} />
                  </div>

                  <div className="sm:flex-1 sm:flex sm:items-center sm:justify-start mt-3 work-sans gap-3">
                    <div className='w-full grow flex gap-3 items-center'>
                      <div className='text-black'>
                        <span>Rows per page</span>
                      </div>
                      <div>
                        <Autocomplete
                          size='small'
                          disablePortal
                          options={rowPerPage || []}
                          sx={{ width: 100 }}
                          value={selectedRowPerPage}
                          onChange={(_, newValue) => {
                            if (newValue) {
                              handleChangeSelectedRows(newValue)
                              return
                            }
                            setSelectedRowPerPage(5)
                          }}
                          getOptionLabel={(option) => option.toString()}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                    </div>
                    <div className='flex justify-end items-center gap-3 w-full'>
                      <div className='text-black'>
                        <p>
                          {startShowRecords + 1}-{filterDataCount > members?.length ? members?.length : filterDataCount} of {members?.length}
                        </p>
                      </div>

                      <div className="relative z-0 inline-flex shadow-sm">
                        <div>
                          <button
                            disabled={currentPage === 1 ? true : false}
                            onClick={() => handlePagination(currentPage === 1 ? currentPage : currentPage - 1)}
                            className={`${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} -ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`}
                            aria-label="Previous"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        <div>
                          <CreatePagination />
                        </div>

                        <div>
                          <button
                            disabled={currentPage === filterDataTotalPage ? true : false}
                            onClick={() => handlePagination(currentPage + 1)}
                            className={`${currentPage === filterDataTotalPage ? 'cursor-not-allowed' : 'cursor-pointer'} -ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`}
                            aria-label="Next"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <MemberModel open={model.open} handleClose={handleCloseMembersModel} title={model.title} memberId={model.id} setSelectedMembers={setSelectedMembers} membersData={members} />
      <Model open={deleteModel.open} title={deleteModel.title} description={deleteModel.description} handleClose={handleCloseDeleteModel} actionFunction={handleDeleteMembers} />
      <Snackbar open={snackbar.open} message={snackbar.message} type={snackbar.type} onclose={handleCloseSnackBar} />
    </div>
  )
}

// const mapStateToProps = (state) => ({
//   groups: state.groups,
//   drawer: state.drawer
// })

// const mapDispatchToProps = {
//   deleteMember
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Groups);

export default Groups