import { makeStyles, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { addTodo, toggleTodo } from '../../actions/notes'
import { Note } from '../../models'
import { AppState } from '../../reducers'
import { getNotes } from '../../selectors/notes'
import { UiTodosAdd } from '../Todos/Add'
import { UiTodosList } from '../Todos/List'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    paper: {
        minWidth: '120px',
        padding: theme.spacing(2),
        '&:hover': {
            borderStyle: 'solid'
        }
    },
    control: {
        padding: theme.spacing(2)
    }
}))

interface UiNotesListProps {
    notes: Note[],
    toggleTodo: (noteId: number, todoId: number) => void,
    addTodo: (noteId: number, todoName: string) => void
}

const UiNotesList = ({ notes, toggleTodo, addTodo }: UiNotesListProps) => {

    const classes = useStyles()
    const [editingNoteId, setEditingNoteId] = React.useState(-1)

    return (
        <Grid container spacing={2} className={classes.root}>
            {notes.map(note => (
                <Grid key={note.id} item xs={4}>
                    <Paper className={classes.paper} onMouseEnter={() => setEditingNoteId(note.id)} onMouseLeave={() => setEditingNoteId(-1)}>
                        <Typography variant='h5'>
                            {note.name}
                        </Typography>
                        <UiTodosList todos={note.todos}
                                     toggleTodo={(todoId: number) => toggleTodo(note.id, todoId)}/>
                        {editingNoteId === note.id && <UiTodosAdd addTodo={(todoName: string) => addTodo(note.id, todoName)}/>}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

const mapStateToProps = (appState: AppState) => ({
    notes: getNotes(appState)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleTodo: (noteId: number, todoId: number) => dispatch(toggleTodo(noteId, todoId)),
    addTodo: (noteId: number, todoName: string) => dispatch(addTodo(noteId, todoName))
})

export const NotesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(UiNotesList)