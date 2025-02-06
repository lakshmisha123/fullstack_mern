import React, { useState } from "react";
import axios from "axios";
import Login from "../pages/Login";
import Profile from "../pages/Profile";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [sessionData, setSessionData] = useState({
    email: sessionStorage.getItem('email') || '',
    username: sessionStorage.getItem('username') || ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    axios({
      url: `${process.env.REACT_APP_API_URL}/signup`, // Using environment variable for API URL
      method: "POST",
      headers: {
        authorization: "your token comes here",
      },
      data: formData,
    })
      .then((res) => {
        setIsCreated(true);
      })
      .catch((err) => {
        if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage(err.response.data.error);
        }
      });
  };

  // Redirect logic based on sessionData and isCreated
  if (isCreated) {
    return <Login />;
  }

  if (sessionData.email && sessionData.username) {
    return <Profile fullName={sessionData.username} email={sessionData.email} />;
  }

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>
                    {errorMessage && <p className="alert alert-danger text-center">{errorMessage}</p>}
                    <form className="mx-1 mx-md-4" method="post" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="form3Example1a"
                            className="form-control"
                            placeholder="First name"
                            name="firstName"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="form3Example1c"
                            className="form-control"
                            placeholder="Last name"
                            name="lastName"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            name="email"
                            onChange={(event) => setEmail(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            id="form3Example4c"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-check d-flex justify-content-center mb-5">
                        <label className="form-check-label">
                          Already have an account? <a href="/login">Click here to Login</a>
                        </label>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg">Register</button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
