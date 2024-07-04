import React, { useEffect } from 'react'
import "./Login.css"
// import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { loginUser, setTenant } from '../../redux';
import { connect, useDispatch } from "react-redux"
import { useSelector } from 'react-redux';

function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleSubmit = async (event) => {
    console.log("eve", event.target.username.value)

    event.preventDefault()
    await fetch('/admin/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value,
      }),
    }).then(response => response.json())
      .then(user => {
        console.log(user, "ddddd");
        const { username } = user;
        props.loginUser(user.username, user => {
          localStorage.setItem('user', user)
        })
        // or 
        // dispatch(loginUser(user))
        dispatch(setTenant(user.tenant_name, tenant => {
          localStorage.setItem('tenant', tenant)

        }))
        console.log("user", props.user)

        navigate("/tag")
      })

  }

  useEffect(() => {
    if (localStorage.getItem('user') != "") {
      console.log("usee", localStorage.getItem('user'))
      navigate("/tag")
    }
  }, [])

  return (
    <>
      <main>
        <section>
          <form onSubmit={handleSubmit} id="signin-form">
            <fieldset>
              <legend>Sign Into Your Account</legend>

              <label for="username">Username</label>
              <input type="text" name="username" id="username" placeholder="username" />

              <label for="password">Your password</label>
              <input type="password" name="password" id="password" placeholder="•••••••" />

              <p><small>Don't remember your password? <a href="#">Reset it</a>.</small></p>

              <input type="checkbox" name="remember-me-input" id="remember-me-input" />
              <label for="remember-me-input">Remember me</label>
            </fieldset>

            <input type="submit" value="Sign in" />
          </form>

          <p class="center lead">Don't have an account? <a href="#">Sign up</a>.</p>
        </section>
      </main>
    </>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loginUser: (user, callback) => { dispatch(loginUser(user, callback)) }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)
// export default Login