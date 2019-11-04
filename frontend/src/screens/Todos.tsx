import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core'
import { TodosList } from '../components/Todos/List'
import { TodosAdd } from '../components/Todos/Add'

const styles = ({ spacing }: Theme) => createStyles({
    root: {
      padding: spacing(3, 2),
    },
})

interface ScreenTodosProps extends WithStyles<typeof styles> {

}

class ScreenTodos extends React.PureComponent<ScreenTodosProps> {
    render() {
        const { classes } = this.props
        return (
            <Paper className={classes.root}>
                <Typography variant='h5' component='h3'>My Todo List</Typography>
                <TodosList></TodosList>
                <TodosAdd></TodosAdd>
            </Paper>
        )
    }
}

export default withStyles(styles)(ScreenTodos)