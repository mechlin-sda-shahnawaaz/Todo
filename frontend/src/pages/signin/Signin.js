import React from "react";
import styles from "./signin.module.css";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { url } from "../../env";
import { Link, useNavigate } from "react-router-dom";
import { userActions } from "../../redux/slice/users.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function Signin() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function onsubmit(data) {
    try {
      const response = (await axios.post(`${url}users/signin`, data)).data;

      if (response.success) {
        reset({});
      }
      dispatch(userActions.storeToken({ token: response.token }));
      navigate("/");
    } catch (error) {
      console.log(error);
      const { message } = error?.response?.data || error;
      if (!message) {
        toast.error("Internal Server Error !!");
        return;
      }
      toast.error(message);
    }
  }
  return (
    <div className={`${styles.signinContainer} m-auto mt-5`}>
      <h2 className="text-center mb-2">Signin</h2>
      <Form onSubmit={handleSubmit(onsubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            {...register("email", {
              required: { value: true, message: "Required" },
            })}
          />
          {errors["email"] && (
            <div className="alert alert-danger p-1 ps-3">
              {errors["email"].message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Required" },
            })}
          />
          {errors["password"] && (
            <div className="alert alert-danger  p-1 ps-3">
              {errors["password"].message}
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Signin
        </Button>

        <div className="text-end">
          Create Account <Link to="/users/signup">Signup Here</Link>
        </div>
      </Form>
    </div>
  );
}

export default Signin;
