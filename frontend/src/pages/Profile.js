import React, { useState } from "react";
import Login from "../pages/Login";

const ProfileData = (props) => {
  const [sessionData, setSessionData] = useState({
    email: sessionStorage.getItem('email') || '',
    username: sessionStorage.getItem('username') || ''
  });

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    setSessionData({ email: '', username: '' }); // Update state after clearing session
  };

  // If sessionData is empty, you might want to redirect to Login page
  // This logic can also be handled in a higher-level component or with React Router
  if (!sessionData.username) {
    return <Login />;
  }

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="container py-5" style={{ height: '100vh' }}>
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                  className="rounded-circle img-fluid" style={{ width: "150px" }} />
                <h5 className="my-3">{props.fullName}</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Software Training Institute Bangalore</p>
                <div className="d-flex justify-content-center mb-2">
                  <a type="button" className="btn btn-primary" href='https://www.instagram.com/it.defined/' target="_blank" rel="noreferrer">Instagram</a>
                  <a type="button" className="btn btn-outline-primary ms-1" href="https://api.whatsapp.com/send?phone=+919740672537&amp;text=Hi..." target="_blank" rel="noreferrer">WhatsApp</a>
                </div>
                <a type="button" className="btn btn-primary" onClick={handleLogout}>Log out</a>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{props.fullName}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{props.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Phone</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">+91-6363730986</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Mobile</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">+91-9740672537</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Address</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">Software Training Institute Bangalore</p>
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

export default ProfileData;
