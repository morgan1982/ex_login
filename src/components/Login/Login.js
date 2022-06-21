import React, { useState, useEffect, useContext, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, { type, payload }) => {
  switch(type) {
    case 'USER_INPUT':
      return {
        value: payload,
        isValid: payload.includes('@')
      };
    case 'ON_BLUR':
      return state;
    default:
      return state
  }
}

const passwordReducer = (state, { type, payload }) => {
  switch(type) {
    case 'USER_INPUT':
      return {
        value: payload,
        isValid: payload.trim().length > 6
      };
    case 'ON_BLUR':
      return state;
    default:
      return state
  }
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const authCtx = useContext(AuthContext)

  const [email, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  })

  const [password, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  })

  useEffect(() => {
    console.log(password.isValid)
    const timerID = setTimeout(() => {
      setFormIsValid(email.isValid && password.isValid);
    }, 500)
    return () => {
      clearTimeout(timerID)
    }
  }, [email.isValid, password.isValid])

  const emailChangeHandler = ({ target: { value }}) => {
    dispatchEmail({ type: 'USER_INPUT', payload: value})
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', payload: event.target.value})
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'ON_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'ON_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(email.value, password.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            email.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={email.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            password.value === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
