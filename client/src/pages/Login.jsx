import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set axios defaults
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
const { setIsLoggedin, getUserData, backendUrl } = useContext(AppContext);
  // const backendUrl = 'http://localhost:4000';

  const [state, setState] = useState('Sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleState = () => {
    setState(state === 'Sign up' ? 'Login' : 'Sign up');
    setName('');
    setEmail('');
    setPassword('');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = state === 'Sign up' ? 'register' : 'login';
      const requestBody =
        state === 'Sign up'
          ? { name, email, password }
          : { email, password };

      console.log(`Making request to: ${backendUrl}/api/auth/${endpoint}`);

      const res = await axios.post(
        `${backendUrl}/api/auth/${endpoint}`,
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (res.status === 200 || res.status === 201) {
        setIsLoggedin(true);
        toast.success(
          state === 'Sign up'
            ? 'Registration successful!'
            : 'Login successful!'
        );
        await getUserData();
        navigate('/');
      } else {
        toast.error(res.data?.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error during authentication:', error);

      if (error.response) {
        if (error.response.status === 409) {
          toast.error('User already exists!');
        } else {
          toast.error(error.response.data?.message || 'Server error occurred!');
        }
      } else if (error.request) {
        toast.error('Network error - please check if server is running!');
      } else {
        toast.error('An unexpected error occurred!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === 'Sign up' ? 'Create your account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='Person icon' />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                disabled={loading}
                className="placeholder-indigo-300 bg-transparent text-indigo-300 outline-none flex-1"
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='Mail icon' />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Id"
              required
              disabled={loading}
              className="placeholder-indigo-300 bg-transparent text-indigo-300 outline-none flex-1"
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='Lock icon' />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              disabled={loading}
              className="placeholder-indigo-300 bg-transparent text-indigo-300 outline-none flex-1"
            />
          </div>

          <p
            onClick={() => !loading && navigate('/reset-password')}
            className={`mb-4 text-indigo-500 cursor-pointer ${loading ? 'opacity-50' : 'hover:text-indigo-400'}`}
          >
            Forgot password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium transition-opacity ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Please wait...' : state}
          </button>
        </form>

        {state === 'Sign up' ? (
          <div className='text-center mt-4'>
            <p className='text-gray-400 text-xs'>Already have an Account?</p>
            <span
              className={`text-blue-400 cursor-pointer underline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-300'}`}
              onClick={() => !loading && toggleState()}
            >
              Login here
            </span>
          </div>
        ) : (
          <div className='text-center mt-4'>
            <p className='text-gray-400 text-xs'>Don't have an Account?</p>
            <span
              className={`text-blue-400 cursor-pointer underline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-300'}`}
              onClick={() => !loading && toggleState()}
            >
              Signup
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
