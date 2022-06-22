import React, { useState, useEffect, useContext, useReducer, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
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
  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [email, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  })

  const [password, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  })

  useEffect(() => {
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
    if (formIsValid) {
      authCtx.onLogin(email.value, password.value)
    } else if (!email.isValid) {
      emailInputRef.current.focus(); 
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          label='Email'
          value={email.value} 
          isValid={email.isValid} 
          onBlur={validateEmailHandler} 
          onChange={emailChangeHandler}
          type='email'
          id='email'
          htmlFor='email'  
          />
        
        <Input
          ref={passwordInputRef}
          label='Password'
          value={password.value}
          id='password'
          htmlFor='password'
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          type='password'
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
