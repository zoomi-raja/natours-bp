import React from 'react';
import classes from './style.module.scss';
import Button from '../../UI/Button/Button';
const Form = (prop) => {
  return (
    <form className={classes.form}>
      <h1>Sign in form</h1>
      <div className={classes.form__group}>
        <input
          placeholder="Email Address"
          autoComplete="off"
          className={classes.form__input}
          type="email"
          required
          nme="email"
          id="email"
        />
        <label className={classes.form__label} htmlFor="email">
          Email Address
        </label>
      </div>
      <div className={classes.form__group}>
        <input
          placeholder="Password"
          autoComplete="off"
          className={classes.form__input}
          type="password"
          required
          name="password"
          id="password"
        />
        <label className={classes.form__label} htmlFor="password">
          Password
        </label>
      </div>
      <div className={classes.form__groupv}>
        <Button btnType="btn--primary">Sign In</Button>
        <div className={classes.form__radioInput}>
          <input name="keeplog" id="keeplog" type="checkbox" />
          <label
            htmlFor="keeplog"
            className={classes['form__radioInput--label']}
          >
            <span className={classes['form__radioInput--button']}></span>
            Keep logged in..!
          </label>
        </div>
      </div>
    </form>
  );
};
export default Form;
