import React from 'react'
import { Button, Grid, Link, makeStyles } from '@material-ui/core'
import { TextField, CheckboxWithLabel } from 'formik-material-ui'
import { Form, Field, FormikProps, withFormik } from 'formik'
import * as yup from 'yup'
import { auth } from '../../services/auth'

const formValuesSchema = yup.object({
  username: yup
    .string()
    .required(),
  password: yup
    .string()
    .required(),
  remember: yup
    .boolean()
    .notRequired(),
})

type FormValues = yup.InferType<typeof formValuesSchema>

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

interface FormViewProps extends FormikProps<FormValues> {

}

const FormView = (props: FormViewProps) => {
  const classes = useStyles()
  const { submitForm } = props

  return (
    <Form className={classes.form}>
      <Field
        type='text'
        label='User name'
        name="username"
        component={TextField}
        autoComplete="username"
        autoFocus
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <Field
        type="password"
        label="Password"
        name="password"
        component={TextField}
        variant="outlined"
        margin="normal"
        fullWidth
        autoComplete="current-password"
      />
      <Field
        name='remember'
        Label={{label: "Remember me"}}
        component={CheckboxWithLabel}
        color="primary"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={submitForm}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            Forgot password?
        </Link>
        </Grid>
        <Grid item>
          <Link href="#" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Form>
  )
}

interface LoginFormProps {

}

export const LoginForm = withFormik<LoginFormProps, FormValues>({
  mapPropsToValues: props => ({
    username: '',
    password: '',
    remember: true
  }),
  handleSubmit: async (values, {setSubmitting}) => {
    await auth.login(values)
  },
  validationSchema: formValuesSchema
})(FormView)