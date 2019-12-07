import React from 'react';
import { Typography, Link } from '@material-ui/core';


export const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
      <Link color="inherit" href="https://biosave.org">
        Biosave
      </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)