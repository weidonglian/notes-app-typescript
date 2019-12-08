import React, { SyntheticEvent } from 'react'
import clsx from 'clsx'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import { amber, green } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { messageActions } from '../../actions/message'
import { getMessageState } from '../../selectors/message'
import { AppState } from '../../reducers'
import { Dispatch } from 'redux'
import { MessageState } from '../../reducers/message'
import { connect } from 'react-redux'


const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

interface Props {
  messageState: MessageState
  hideMessage: () => void
}

export const AppMessageView: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { message, variant, visible: open } = props.messageState
  const Icon = variantIcon[variant]
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    props.hideMessage()
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes[variant]}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}


const mapState = (appState: AppState) => ({
  messageState: getMessageState(appState)
})

const mapAction = (dispatch: Dispatch) => ({
  hideMessage: () => dispatch(messageActions.hideMessage())
})

export const AppMessage = connect(
  mapState,
  mapAction
)(AppMessageView)