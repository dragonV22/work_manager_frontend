import AuthContext from "../context/AuthContext";
import { useState } from "react";
import axiosApi, { axiosTokenApi } from "../utils/axios";
import PropTypes from 'prop-types';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: null,
    password: null
  });

  const signup = (newUser, callback) => {
    return axiosApi
      .post(`/api/auth/register/`, newUser)
      .then(res => {
        setUser({
          email: newUser.email,
          password: ''
        });

        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);

        callback();
        return true;
      })
      .catch(() => {
        setUser({
          email: null,
          password: null
        });
        return false;
      });
  };

  const signin = (newUser, callback) => {
    return axiosApi
      .post(`/api/auth/login/`, newUser)
      .then(res => {
        setUser({
          email: newUser.email,
          password: ''
        });

        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);

        callback();
        return true;
      })
      .catch(() => {
        setUser({
          email: null,
          password: null
        });
        return false;
      });
  };

  const signout = (callback) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser({
      email: null,
      password: null
    });
    callback();
  };

  const checkToken = async () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (access_token === null || refresh_token === null) {
      return false;
    }

    const resetUserAndTokens = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser({
        email: null,
        password: null
      });
    };

    const payload = {
      access_token: access_token
    };

    return axiosTokenApi
      .post(`api/auth/user/`, payload)
      .then(res => {
        setUser(res.data);
        return true;
      })
      .catch(err => {
        if (err.response && err.response.status !== 403) {
          axiosApi
            .post(`api/auth/refresh_token/`, { refresh_token })
            .then(res => {
              axiosTokenApi
                .post(`api/auth/user/`, {access_token: res.data.access_token})
                .then(res => {
                  setUser(res.data);
                  return true;
                })
                .catch(() => {
                  resetUserAndTokens();
                  return false;
                });
            })
            .catch(() => {
              resetUserAndTokens();
              return false;
            });
        } else {
          resetUserAndTokens();
          return false;
        }
      });
  }

  const checkAdminToken = async () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (access_token === null || refresh_token === null) {
      return false;
    }

    const resetUserAndTokens = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser({
        email: null,
        password: null
      });
    };

    const payload = {
      access_token: access_token
    };

    return axiosTokenApi
      .post(`api/auth/user/`, payload)
      .then(res => {
        setUser(res.data);
        return res.data.isAdmin;
      })
      .catch(err => {
        if (err.response && err.response.status !== 403) {
          axiosApi
            .post(`api/auth/refresh_token/`, { refresh_token })
            .then(res => {
              axiosTokenApi
                .post(`api/auth/user/`, {access_token: res.data.access_token})
                .then(res => {
                  setUser(res.data);
                  return res.data.isAdmin;
                })
                .catch(() => {
                  resetUserAndTokens();
                  return false;
                });
            })
            .catch(() => {
              resetUserAndTokens();
              return false;
            });
        } else {
          resetUserAndTokens();
          return false;
        }
      });
  }

  const value = { user, signup, signin, signout, checkToken, checkAdminToken };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.any,
};

export default AuthProvider;