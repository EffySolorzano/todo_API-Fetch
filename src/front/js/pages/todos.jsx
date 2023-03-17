import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const ToDo = () => {
    const { store, actions } = useContext(Context);
    const [refresh, setRefresh] = useState(false);
    const [tasksToDelete, setTasksToDelete] = useState([]);
    const [newTaskLabel, setNewTaskLabel] = useState("");
  
    useEffect(() => {
      const cargaDatos = async () => {
        let { respuestaJson, response } = await actions.useFetch(
          "/apis/fake/todos/user/stephtest"
        );
        if (response.ok) {
          actions.setTodoList(respuestaJson);
        } else {
          actions.setTodoList([]);
        }
      };
      cargaDatos();
    }, [store.user, refresh]);
  
    const handleDeleteAll = async () => {
      const deleteOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([]),
      };
      const deleteResponse = await fetch(
        "/apis/fake/todos/user/stephtest",
        deleteOptions
      );
  
      if (deleteResponse.ok) {
        const putOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ label: "Add New ToDos", done: false }]),
        };
        const putResponse = await fetch(
          "/apis/fake/todos/user/stephtest",
          putOptions
        );
  
        if (putResponse.ok) {
          actions.setTodoList([{ label: "Add New ToDos", done: false }]);
          setRefresh(!refresh);
        } else {
          alert("There was an error, try again");
        }
      } else {
        alert("There was an error, try again");
      }
    };
  
    const handleAddTask = async (e) => {
        if (e.key === "Enter") {
          const newTask = {
            label: inputValue,
            done: false,
          };
          const { respuestaJson, response } = await actions.useFetch(
            `/apis/fake/todos/user/${store.user}`,
            [newTask],
            "POST"
          );
          if (response.ok) {
            setInputValue("");
            setRefresh(!refresh);
          } else {
            alert("There was an error, try again");
          }
        }
      };
  
    const handleDeleteTask = async (index) => {
      const newTaskList = store.todoList.filter((_, i) => i !== index);
      setTasksToDelete([...tasksToDelete, store.todoList[index]]);
      let { respuestaJson, response } = await actions.useFetch(
        `/apis/fake/todos/user/${store.user}`,
        newTaskList,
        "PUT"
      );
  
      if (response.ok) {
        actions.setTodoList(newTaskList);
        setRefresh(!refresh);
      } else {
        alert("There was an error, try again");
      }
    };
  
    return (
        <div className="text-center mt-5">
            <h1>What do you need to do</h1>
            <br />
            <input
            className="text"
               onChange={(e) => setNewTaskLabel(e.target.value)}
               value={newTaskLabel}
               onKeyPress={handleAddTask}
               placeholder="Add a new task"
            />
            <br />
            {store.todoList && store.todoList.length > 0 ? (
                <ul>
                    {store.todoList.map((item, index) => (
                        <li key={index}>
                            {item.label}
                            <button
                                type="button"
                                onClick={() => {
                                    handleDeleteTask(index);
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                
                <p> No tasks to show </p>
            )}
            <br />
            
            <button className="btn btn-danger" onClick={handleDeleteAll}>Delete all tasks</button>
        </div>
    );
 }      