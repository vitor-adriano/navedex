import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../services/api";

import Modal from "../modal";
import NaverActions from "../naver-actions";

import StyledNaverModal from "./style";

const initialState = {
  id: "",
  name: "",
  admission_date: "",
  job_role: "",
  user_id: "",
  project: "",
  birthdate: "",
  url: ""
};

const NaverModal = () => {
  const params = useParams();
  const history = useHistory();
  const currentNaverState = useSelector(state =>
    state.navers.navers.find(naver => naver.id === params.id)
  );

  const [control, setControl] = useState({
    isFetching: true,
    errorMessage: ""
  });
  const [state, setState] = useState(() => {
    return currentNaverState || initialState;
  });

  useEffect(() => {
    const init = async () => {
      setControl({
        isFetching: true,
        errorMessage: ""
      });

      try {
        const response = await api.get(`/navers/${params.id}`);

        setState(response.data);
        setControl({
          isFetching: false,
          errorMessage: ""
        });
      } catch (e) {
        setControl({
          isFetching: false,
          errorMessage: "Naver não encontrado."
        });
      }
    };

    init();
  }, [params.id]);

  return (
    <Modal isActive handleClose={history.goBack}>
      <StyledNaverModal thumb={state.url}>
        <div className="thumb" />

        <main>
          <header>
            <strong>{state.name}</strong>

            <span>{state.job_role}</span>
          </header>

          {!control.isFetching ? (
            <>
              <section>
                <strong>Idade</strong>

                <span>{state.birthdate}</span>
              </section>

              <section>
                <strong>Data de admissão</strong>

                <span>
                  {new Date(state.admission_date).toLocaleDateString()}
                </span>
              </section>

              <section>
                <strong>Projetos que participou</strong>

                <span>{state.project}</span>
              </section>

              <NaverActions id={state.id} />
            </>
          ) : (
            <span>Carregando...</span>
          )}
        </main>
      </StyledNaverModal>
    </Modal>
  );
};

export default NaverModal;