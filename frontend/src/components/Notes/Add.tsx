import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField,
    Theme,
    withStyles,
    WithStyles
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { addNote } from '../../actions/notes'

const styles = (theme: Theme) => createStyles({
    fab: {
        margin: theme.spacing(1)
    }
})

interface UiNotesAddProps extends WithStyles<typeof styles> {
    addNote: (name: string) => void
}

interface UiNotesAddState {
    open: boolean,
    name: string
}


class UiNotesAdd extends React.PureComponent<UiNotesAddProps, UiNotesAddState> {
    state: UiNotesAddState = {
        open: false,
        name: ''
    }

    handleClose = () => {
        this.setState({
            open: false
        })
    }

    handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.handleClose()
        const { name } = this.state
        const { addNote } = this.props
        if (name) {
            addNote(name)
        }
    }

    onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value
        })
    }

    onClickAddNote = () => {
        this.setState({
            open: true,
            name: ''
        })
    }

    render() {
        const { open } = this.state
        const { classes } = this.props

        return (
            <React.Fragment>
                <Fab color="secondary" aria-label="add" size="small" className={classes.fab}
                     onClick={this.onClickAddNote}>
                    <AddIcon/>
                </Fab>

                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create a new note:</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            onChange={this.onChangeName}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addNote: (name: string) => dispatch(addNote(name))
})

export const NotesAdd = connect(
    null,
    mapDispatchToProps
)(withStyles(styles)(UiNotesAdd))