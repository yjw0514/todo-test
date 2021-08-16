import React from 'react';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../context/auth-context';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  toolBar: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: 30,
  },

  navLink: {
    color: 'black',
    textDecoration: 'none',
    paddingTop: 3,
    marginRight: 30,
  },
  active: {
    borderColor: 'black',
  },
}));

export default function Header() {
  const classes = useStyles();

  const { currentUser } = useAuth();

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        style={{
          backgroundColor: 'rgb(248, 249, 250)',
          color: 'black',
        }}
        elevation={2}
      >
        <Toolbar className={classes.toolBar}>
          <Typography>
            <img
              src='https://www.ikea.com/kr/ko/static/ikea-logo.f7d9229f806b59ec64cb.svg'
              alt='logo'
            />
          </Typography>
          <Typography variant='h6' className={classes.title}>
            <NavLink
              to='/'
              exact
              className={classes.navLink}
              activeStyle={{
                fontWeight: 'bold',
                color: 'dodgerblue',
              }}
            >
              FUTURELIFE
            </NavLink>
          </Typography>
          <NavLink
            to='/category'
            exact
            className={classes.navLink}
            activeStyle={{
              fontWeight: 'bold',
              color: 'dodgerblue',
            }}
          >
            <Button color='inherit' className={classes.myPage}>
              모든제품
            </Button>
          </NavLink>
          {currentUser ? (
            <NavLink
              to='/users/profile'
              className={classes.navLink}
              activeStyle={{
                fontWeight: 'bold',
                color: 'dodgerblue',
              }}
            >
              <Button color='inherit'>마이페이지</Button>
            </NavLink>
          ) : (
            <NavLink
              to='/auth'
              className={classes.navLink}
              activeStyle={{
                fontWeight: 'bold',
                color: 'dodgerblue',
              }}
            >
              <Button color='inherit'>로그인</Button>
            </NavLink>
          )}
          <NavLink
            to='/new'
            className={classes.navLink}
            activeStyle={{
              fontWeight: 'bold',
              color: 'dodgerblue',
            }}
          >
            <Button color='inherit'>업로드</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
}