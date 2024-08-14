import React from "react";
import styles from "./signup.module.css";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../../env";
import { toast } from "react-toastify";

function Signup() {
  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm();
  const navigate = useNavigate();

  async function onsubmit(data) {
    try {
      const response = (await axios.post(`${url}users/signup`, data)).data;
      if (response.success) {
        reset({});
        navigate("/users/signin");
        window.alert("Account Created Successfully !!s");
      }
    } catch (error) {
      console.log(error);
      const { message } = error.response.data;
      if (!message) {
        toast.error("Internal Server Error");
        return;
      }
      toast.error(message);
    }
  }
  return (
    <div className={`${styles.signupContainer} m-auto mt-5`}>
      <h2 className="text-center mb-2">Signup</h2>
      <Form onSubmit={handleSubmit(onsubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("name", {
              required: { value: true, message: "Required" },
            })}
          />
          {errors["name"] && (
            <div className="alert alert-danger p-1 ps-3">
              {errors["name"].message}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            {...register("email", {
              required: { value: true, message: "Required" },
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Incorrect Email",
              },
            })}
          />
          {errors["email"] && (
            <div className="alert alert-danger p-1 ps-3">
              {errors["email"].message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enter Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone"
            {...register("phone", {
              required: { value: true, message: "Required" },
              maxLength: { value: 10, message: "Incorrect Phone" },
              minLength: { value: 10, message: "Incorrect Phone" },
            })}
          />
          {errors["phone"] && (
            <div className="alert alert-danger p-1 ps-3">
              {errors["phone"].message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enter Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Age"
            {...register("age", {
              required: { value: true, message: "Required" },
              min: {
                value: 18,
                message: "Minimum 18 years is Required",
              },
              max: {
                value: 150,
                message: "Maximum 150 years is Required",
              },
            })}
          />
          {errors["age"] && (
            <div className="alert alert-danger p-1 ps-3">
              {errors["age"].message}
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
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/,
                message:
                  "Password Must be Combination of Alphanumeric Characters & UpperCase and LowerCase",
              },
            })}
          />
          {errors["password"] && (
            <div className="alert alert-danger  p-1 ps-3">
              {errors["password"].message}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: { value: true, message: "Required" },
              validate: (value) => {
                if (value !== watch("password")) {
                  return "Password & Confirm Password should be matched";
                }
              },
            })}
          />
          {errors["confirmPassword"] && (
            <div className="alert alert-danger  p-1 ps-3">
              {errors["confirmPassword"].message}
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Signup
        </Button>

        <div className="text-end">
          Already have an Account <Link to="/users/signin">Login Here</Link>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
