import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import '@renderer/styles/login.css'

const Login = () => {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  const auth = useAuth();
  const handleSubmitEvent = (e: any) => {
    e.preventDefault();
    if (input.username !== '' && input.password !== '') {
      auth.loginAction(input);
      return;
    }
    alert('please provide a valid input');
  };

  const handleInput = (e: any) => {
    const { name, value }: any = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <section className='left-sec'>&nbsp;</section>
      <section className='right-sec'>
        <div className='top-titles'>
            <h1>Verial Software</h1>
            <p>Sign up and manage your tires enterprise</p>
        </div>
        <form onSubmit={handleSubmitEvent} className="">
          <div className="form_control">
            <label htmlFor="Username">Username:</label>
            <input
              type="username"
              id="username"
              name="username"
              placeholder="Enter username"
              aria-describedby="user"
              aria-invalid="false"
              onChange={handleInput}
            />
          </div>
          <div className="form_control">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*********"
              aria-describedby="user-password"
              aria-invalid="false"
              onChange={handleInput}
            />
          </div>
          <button className="btn-submit">Login</button>
          <p>Forgot password ? <span id='reset'>Reset</span></p>
        </form>
      </section>
    </div>
  );
};

export default Login;
