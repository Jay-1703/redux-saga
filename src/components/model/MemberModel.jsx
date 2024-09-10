import React, { useEffect, useState } from 'react'
import { addMember, editMember } from '../../redux/memberReducers';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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

function MemberModel({ open, title, handleClose, memberId, membersData, setSelectedMembers }) {
    const { id } = useParams()
    const [snackbar, setSnackBar] = useState({ open: false, message: '', type: '' })

    const dispatch = useDispatch()

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            number: '',
        },
    })

    const handleCloseSnackBar = () => {
        setSnackBar({ open: false, message: '', type: '' })
    }
    const handleSubmitData = async (input) => {
        const data = {
            ...input,
            groupId: parseInt(id)
        }
        if (memberId) {
            dispatch(editMember(data))
            setSelectedMembers([])
            reset({
                firstname: '',
                lastname: '',
                email: '',
                number: '',
            })
            handleClose()
            setSnackBar({ open: true, message: 'Member updated successfully', type: 'success' })
            return
        }
        dispatch(addMember(data))
        reset({
            firstname: '',
            lastname: '',
            email: '',
            number: '',
        })
        handleClose()
        setSnackBar({ open: true, message: 'Member added successfully', type: 'success' })
    }

    const handleCloseModel = () => {
        reset({
            firstname: '',
            lastname: '',
            email: '',
            number: '',
        })
        handleClose()
    }

    const handleGetMemberData = () => {
        if (memberId) {
            const member = membersData?.filter((row) => row.memberId === parseInt(memberId))
            reset({ ...member[0] })
        }
    }

    useEffect(() => {
        handleGetMemberData()
    }, [memberId])

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
                <DialogTitle className='font-sans font-bold'>{title}</DialogTitle>
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
                        <div className='flex justify-between gap-4 mb-3'>
                            <div className='w-full'>
                                <label
                                    htmlFor="username"
                                    className="text-sm text-gray-800"
                                >
                                    First name
                                </label>
                                <input
                                    type="text"
                                    name='firstname'
                                    {...register('firstname', { required: 'First name is required' })}
                                    className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                                />
                                {
                                    errors?.firstname?.message && (
                                        <span className='text-red-500'>
                                            {errors?.firstname?.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className='w-full'>
                                <label
                                    htmlFor="username"
                                    className="text-sm text-gray-800"
                                >
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    name='lastname'
                                    {...register('lastname', { required: 'Last name is required' })}
                                    className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                                />
                                {
                                    errors?.lastname?.message && (
                                        <span className='text-red-500'>
                                            {errors?.lastname?.message}
                                        </span>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex justify-between gap-4'>
                            <div className='w-full'>
                                <label
                                    htmlFor="username"
                                    className="text-sm text-gray-800"
                                >
                                    Email
                                </label>
                                <input
                                    // type="email"
                                    name='email'
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: 'Please enter a valid email'
                                        },
                                        validate: (value, { emailValidation }) => {
                                            if (emailValidation) {
                                                return value
                                            }
                                            return true;
                                        },
                                    })}
                                    className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                                />
                                {
                                    errors?.email?.message && (
                                        <span className='text-red-500'>
                                            {errors?.email?.message}
                                        </span>
                                    )
                                }
                            </div>

                            <div className='w-full'>
                                <label
                                    htmlFor="number"
                                    className="text-sm text-gray-800"
                                >
                                    Phone number
                                </label>
                                <input
                                    type="text"
                                    id="number"
                                    {...register('number', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: 'Please enter a valid phone number',                                        
                                        },
                                        validate: (value, { phoneValidation }) => {
                                            if (phoneValidation) {
                                                return value
                                            }
                                            return true;
                                        },
                                    })}
                                    className="w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg outline-none"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                    }}
                                />

                                {errors.number && (
                                    <span className='text-red-500'>
                                        {errors.number.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className='mt-3'>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                            >
                                {
                                    title.toLowerCase() === 'add member' ? 'Add Member' : 'Update Member'
                                }
                            </button>
                            {/* <Button onClick={props.actionFunction} variant='contained' color='error'>{}</Button>                  */}
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
//     addMember,
//     editMember,
// }

// export default connect(mapStateToProps, mapDispatchToProps)(MemberModel)

export default MemberModel;