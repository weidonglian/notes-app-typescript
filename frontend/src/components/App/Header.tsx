import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'
import { auth } from '../../services/auth'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        title: {
            flexGrow: 1
        }
    })
)

export const AppHeader = () => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl)
    const history = useHistory()

    //const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      //setAuth(event.target.checked);
    //}

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }

    const handleLogin = () => {
        handleClose()
        history.push('/login')
    }

    const handleLogout = () => {
        auth.logout()
        handleLogin()
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Notes
                    </Typography>
                    <IconButton aria-label="account of current user" aria-controls="menu-appbar"
                        aria-haspopup="true" onClick={handleMenu} color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={open} onClose={handleClose}>
                        {
                            !auth.isAuthenticated() ? <MenuItem onClick={handleLogin}>Login</MenuItem> :
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        }
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    )
}

