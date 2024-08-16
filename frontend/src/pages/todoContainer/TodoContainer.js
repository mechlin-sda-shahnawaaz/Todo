import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../env";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Todo from "../../components/todo/Todo";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { userActions } from "../../redux/slice/users.slice";

function TodoContainer() {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector(
    (state) => state.userReducer
  );
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [todos, setTodos] = useState([]);
  const { handleSubmit, reset, register, watch } = useForm({
    defaultValues: { searchData: "" },
  });
  const searchData = watch("searchData");

  const handleClose = () => {
    setShow(false);
    reset({});
  };

  const handleShow = (item) => {
    setShow(true);
    reset(item || {});
  };

  async function toggleTodo(value, id) {
    try {
      await axios.put(`${url}todos/${id}`, value, {
        headers: { Authorization: accessToken },
      });
      toast.success("Todo Toggled Successfully");
      fetchTodos();
    } catch (error) {
      if (error.response.data.message === "Token Expired") {
        handleRefreshToken();
      } else {
        toast.error("Network Error");
      }
    }
  }

  async function handleRefreshToken() {
    try {
      const response = await axios.post(
        `${url}users/refresh-token`,
        { refreshToken },
        { headers: { Authorization: accessToken } }
      );
      const { accessToken: token } = response.data;
      dispatch(userActions.storeAccessToken({ accessToken: token }));
    } catch (error) {
      dispatch(userActions.clearAccessToken());
      dispatch(userActions.clearRefreshToken());
      navigate("/users/signin");
    }
  }
  async function fetchTodos() {
    try {
      const response = await axios.get(
        `${url}todos?pageNum=${currentPage}&limit=${pageLimit}&search=${searchData}`,
        {
          headers: { Authorization: accessToken },
        }
      );
      const { todos } = response.data;
      setTodos(todos);
    } catch (error) {
      if (error.response.data.message === "Token Expired") {
        handleRefreshToken();
      } else {
        toast.error("Network Error");
      }
    }
  }
  useEffect(() => {
    if (!accessToken) {
      navigate("/users/signin");
      return;
    }
    fetchTodos();
  }, [currentPage, searchData, accessToken]);

  useEffect(() => {
    reset({ searchData: "" });
  }, [currentPage]);

  async function onsubmit(data) {
    handleClose();
    if (data._id) {
      updateTodo(data);
    } else {
      addTodo(data);
    }
  }

  async function addTodo(data) {
    try {
      const response = await axios.post(`${url}todos`, data, {
        headers: { Authorization: accessToken },
      });
      if (response.data.success) {
        toast.success("Todo Created Successfully");
        fetchTodos();
      }
    } catch (error) {
      if (error.response.data.message === "Token Expired") {
        handleRefreshToken();
      } else {
        toast.error("Network Error");
      }
    }
  }
  async function updateTodo(data) {
    try {
      const response = await axios.put(`${url}todos/${data._id}`, data, {
        headers: { Authorization: accessToken },
      });
      if (response.data.success) {
        toast.success("Todo updated Successfully ");
        fetchTodos();
      }
    } catch (error) {
      if (error.response.data.message === "Token Expired") {
        handleRefreshToken();
      } else {
        toast.error("Network Error");
      }
    }
  }
  function onUpdateBtnClick(data) {
    handleShow(data);
  }

  async function deleteTodo(id) {
    try {
      const response = await axios.delete(`${url}todos/${id}`, {
        headers: { Authorization: accessToken },
      });
      if (response.data.success) {
        fetchTodos();
      }
    } catch (error) {
      if (error.response.data.message === "Token Expired") {
        handleRefreshToken();
      } else {
        toast.error("Network Error");
      }
    }
  }
  async function onDeleteBtnClick(id) {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await deleteTodo(id);
        toast.success("Todo has been Deleted");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mt-3 p-2 pb-5 border">
        <h1 className="ms-4">Todo</h1>
        <div className="text-end">
          <Button
            variant="primary"
            className="me-3"
            onClick={() => handleShow()}
          >
            Add Todo
          </Button>
        </div>
        <div className="my-3">
          <Form.Control
            type="text"
            {...register("searchData")}
            placeholder="Search Data"
          />
        </div>
        <div className="container">
          {todos.map((value, index) => (
            <Todo
              {...value}
              key={index}
              onDeleteBtnClick={onDeleteBtnClick}
              onUpdateBtnClick={onUpdateBtnClick}
              toggleTodo={toggleTodo}
            />
          ))}
        </div>
        <div className="text-center mt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
            <span
              className="me-1"
              key={index}
              onClick={() => setCurrentPage(value)}
              style={{
                cursor: "pointer",
                fontWeight: value == currentPage ? 550 : 100,
              }}
            >
              {value}
            </span>
          ))}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div></div>
          <Form>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              hidden
              {...register("_id")}
            />
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                autoFocus
                {...register("title")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Description"
                {...register("description")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" {...register("dueDate")} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(onsubmit)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TodoContainer;
