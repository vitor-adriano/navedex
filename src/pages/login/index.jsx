import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import immer from "immer";

import { authenticate } from "../../actions/session";
import api from "../../services/api";

const Login = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [control, setControl] = useState({
    isFetching: false,
    errorMessage: ""
  });

  const [state, setState] = useState(() => {
    try {
      return {
        email: location.state.email,
        password: ""
      };
    } catch (e) {
      return {
        email: "testing-user@nave.rs",
        password: "nave1234"
      };
    }
  });

  const handleChange = event => {
    const { name, value } = event.target;

    setState(
      immer(draft => {
        draft[name] = value;
      })
    );
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setControl({
      isFetching: true,
      errorMessage: ""
    });

    try {
      const response = await api.post("/users/login", state);

      dispatch(
        authenticate({
          token: response.data.token,
          user: {
            id: response.data.id,
            email: response.data.email
          }
        })
      );
    } catch (e) {
      setControl({
        isFetching: false,
        errorMessage: "E-mail ou senha inválidos."
      });
    }
  };

  return (
    <div>
      <h3>Conectar</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <strong>E-mail</strong>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <strong>Senha</strong>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
          />
        </div>

        {control.errorMessage && (
          <div>
            <span>{control.errorMessage}</span>
          </div>
        )}

        <div>
          <Link to="/register">Criar conta</Link>

          <button type="submit" disabled={control.isFetching}>
            Conectar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
