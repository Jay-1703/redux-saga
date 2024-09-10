import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { addGroup, editGroup } from '../../redux/groupReduser';
import { useForm } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Snackbar from '../snackbar/Snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function GroupModel({ open, handleClose, title, id, setSelectedGroup }) {
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            group_name: '',
        },
    })

    const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })

    const groups = useSelector((state) => state.groups.groups)
    const updatedGroupsIds = useSelector((state) => state.groups.updatedGroupsIds)
    const dispatch = useDispatch()


    const handleCloseSnackBar = () => {
        setSnackBar({ open: false, message: '', type: '' })
    }

    const handleSubmitData = async (input) => {
        if (input.groupId) {
            dispatch(editGroup(input))
            reset({ group_name: '' })
            handleClose()
            setSelectedGroup([])
            setSnackBar({ open: true, message: 'Group updated successfully', type: 'success' })
            return
        }
        dispatch(addGroup(input))
        reset({ group_name: '' })
        handleClose()
        setSnackBar({ open: true, message: 'Group created successfully', type: 'success' })
    }

    const handleCloseModel = () => {
        reset({
            group_name: '',
        })
        handleClose()
    }

    const handleGetGroup = () => {
        if (id) {
            const group = groups?.filter((row) => row.groupId === id)
            console.log("group", group)
            if (group) {
                reset({ group_name: group[0].group_name, groupId: group[0].groupId })
            }
        }
    }

    useEffect(() => {
        handleGetGroup()
    }, [id])

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                maxWidth="xs"
                onClose={handleCloseModel}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle className='font-sans font-bold'>{title} Group</DialogTitle>
                <hr />
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModel}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <form className="" onSubmit={handleSubmit(handleSubmitData)}>
                        <div>
                            <label
                                htmlFor="username"
                                className="text-sm text-gray-800"
                            >
                                Group name
                            </label>
                            <input
                                type="text"
                                name='group_name'
                                {...register('group_name', { required: 'Group name is required' })}
                                className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                            />
                            {
                                errors?.group_name?.message && (
                                    <span className='text-red-500'>
                                        {errors?.group_name?.message}
                                    </span>
                                )
                            }
                        </div>
                        <div className='mt-3'>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                            >
                                {
                                    title.toLowerCase() === 'create' ? 'Create' : 'Update'
                                }
                            </button>
                            {/* <Button onClick={actionFunction} variant='contained' color='error'>{}</Button>                  */}
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Snackbar open={snackbar.open} message={snackbar.message} type={snackbar.type} onclose={handleCloseSnackBar} />
        </React.Fragment>
    );
}
// const mapStateToProps = (state) => ({
//     groups: state.groups
// })

// const mapDispatchToProps = {
//     addGroup,
//     editGroup
// };

// export default connect(mapStateToProps, mapDispatchToProps)(GroupModel)

export default GroupModel