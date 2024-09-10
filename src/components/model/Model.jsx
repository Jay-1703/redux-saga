import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Model(props) {
   
    return (
        <React.Fragment>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                maxWidth='sm'
                onClose={props.handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {
                        props.title?.toLowerCase() === "logout" && (
                            <Button onClick={props.handleSaveData} variant='contained' color='info'>Save to Database</Button>
                        )
                    }
                    {
                        props.title?.toLowerCase() === "logout" && (
                            <Button onClick={props.actionFunction} variant='contained' color='error'>Logout</Button>
                        )
                    }
                    {
                        (props.title?.toLowerCase() === "delete group" || props.title?.toLowerCase() === "delete members") && (
                            <Button onClick={props.actionFunction} variant='contained' color='error'>Delete</Button>
                        )
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
