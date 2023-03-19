import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  // Los estados no deben estar dentro de llaves, si no dentro de paréntesis rectos, solo el store va en llaves
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState("");

  //added an array with colors to loop as tasks are being added.
  const bgColors = ["#FF69B4", "#40E0D0", "#FEFF38", "#FE18D3", "#39FF14"];

  useEffect(() => {
    const cargaDeDatos = async () => {
      let { respuestaJson, response } = await actions.useFetch(
        `/todos/user/${user}`
      );
      if (response.ok) {
        setTodos(respuestaJson);
      }
    };
    cargaDeDatos();
  }, [user]);

  useEffect(() => {}, [todos]);

  const eliminar = async (i) => {
    let arrTemp = todos.filter((item, index) => {
      return index != i;
    });
    let { respuestaJson, response } = await actions.useFetch(
      `/todos/user/${user}`,
      arrTemp,
      "PUT"
    );

    if (response.ok) {
      setTodos(arrTemp);
    } else {
      alert("No se actualizó la API");
    }
  };

  return (
    <>
      <h1 className="title row d-flex justify-content-center">
        What do you want to do?
      </h1>
      <div className="container">
        <div
          className="container-fluid justify-content-center align-item-center mt-10"
          id="bar"
        >
          <br />
          <div className="row d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center">
              <input
                className="pending form-control"
                placeholder="Username"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setUser(e.target.value);
                  }
                }}
              />
              <input
                type="text"
                className="pending form-control"
                name="search"
                placeholder="What needs to be done?"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.persist();
                    setTodos((current) => [
                      ...current,
                      { label: e.target.value, done: false },
                    ]);
                  }
                }}
              />
            </div>
            <div className="row d-flex justify-content-center task-list">
              {todos && todos.length > 0 ? (
                todos.map((item, index) => {
                  const colorIndex = index % bgColors.length;
                  const style = { backgroundColor: bgColors[colorIndex] };
                  return (
                    <li
                      key={index}
                      className={`task-item task-${colorIndex}`}
                      style={style}
                    >
                      {item.label}
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => {
                          eliminar(index);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </li>
                  );
                })
              ) : (
                <p className="text-center">No pending tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
