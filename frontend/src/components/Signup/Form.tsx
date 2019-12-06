import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Link as RouterLink} from 'react-router-dom'
import { Copyright } from '../UI/Copyright'
import * as yup from 'yup'
import { TextField } from 'formik-material-ui'
import { FormikProps, Form, Field, withFormik } from 'formik'
import { History } from 'history'
import { auth } from '../../services/auth'

const formValuesSchema = yup.object({
  username: yup
    .string()
    .required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8)
    .max(16)
})

type FormValues = yup.InferType<typeof formValuesSchema>

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const FormView = (props: FormikProps<FormValues>) => {
  const classes = useStyles()
  const { submitForm, isSubmitting } = props
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field
                id="username"
                label="User name"
                name="username"
                component={TextField}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="password"
                name="password"
                label="Password"
                type="password"
                component={TextField}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={submitForm}
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to='/login' component={RouterLink} variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

interface SignupFormProps {
  histroy: History
}

export const SignupForm =withFormik<SignupFormProps, FormValues>({
  mapPropsToValues: () => ({
    username: '',
    password: ''
  }),
  handleSubmit: (values, {props, setSubmitting}) => {
    console.log('submitting')
    auth.signup(values).then(data => {
      props.histroy.push('/')
    }).finally(() => {
      setSubmitting(false)
    })
  },
  validationSchema: formValuesSchema
})(FormView)