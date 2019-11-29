import { makeStyles, Theme, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { notesReqActions } from '../../actions/notes-req'
import { Note } from '../../models'
import { AppState } from '../../reducers'
import { getNotes } from '../../selectors/notes'
import { TkDispatch } from '../../utils/redux-utils'
import { TodosAddView } from '../Todos/AddView'
import { TodosListView } from '../Todos/ListView'

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

interface NotesListViewProps {
    notes: Note[],
    reinitNotes: () => void,
    toggleTodo: (noteId: number, todoId: number) => void,
    addTodo: (noteId: number, todoName: string) => void
}

const NotesListView = ({ notes, toggleTodo, addTodo, reinitNotes }: NotesListViewProps) => {

    const classes = useStyles()
    const [editingNoteId, setEditingNoteId] = React.useState(-1)

    useEffect(() => {
        reinitNotes()
    }, [reinitNotes]);

    return (
        <Grid container spacing={2} className={classes.root}>
            {notes.map(note => (
                <Grid key={note.id} item xs={4}>
                    <Paper className={classes.paper} onMouseEnter={() => setEditingNoteId(note.id)}
                           onMouseLeave={() => setEditingNoteId(-1)}>
                        <Typography variant='h5'>
                            {note.name}
                        </Typography>
                        <TodosListView todos={note.todos}
                                       toggleTodo={(todoId: number) => toggleTodo(note.id, todoId)}/>
                        {editingNoteId === note.id &&
                        <TodosAddView addTodo={(todoName: string) => addTodo(note.id, todoName)}/>}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

const mapStateToProps = (appState: AppState) => ({
    notes: getNotes(appState)
})

const mapDispatchToProps = (dispatch: TkDispatch) => ({
    reinitNotes: () => dispatch(notesReqActions.reinitNotes()),
    addTodo: (noteId: number, todoName: string) => dispatch(notesReqActions.addTodo(noteId, todoName)),
    toggleTodo: (todoId: number) => dispatch(notesReqActions.toggleTodo(todoId))
})

export const NotesList = connect(
    mapStateToProps,
    mapDispatchToProps
)(NotesListView)