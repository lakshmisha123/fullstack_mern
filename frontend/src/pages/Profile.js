import React, { useState } from "react";
import Login from "../pages/Login";

const ProfileData = (props) => {
  const [sessionData, setSessionData] = useState({
    email: sessionStorage.getItem("email") || "",
    username: sessionStorage.getItem("username") || ""
  });

  const handleLogout = () => {
    sessionStorage.clear();
    setSessionData({ email: "", username: "" });
  };

  if (!sessionData.username) {
    return <Login />;
  }

  return (
    <section className="bg-light py-5">
      <div className="container" style={{ height: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg mb-4 text-center">
              <div className="card-body">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle img-fluid shadow-sm mb-3"
                  style={{ width: "150px" }}
                />
                <h5 className="fw-bold text-primary">{props.fullName}</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Software Training Institute Bangalore</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <a className="btn btn-primary shadow" href="https://www.instagram.com/it.defined/" target="_blank" rel="noreferrer">Instagram</a>
                  <a className="btn btn-outline-primary shadow" href="https://api.whatsapp.com/send?phone=+919740672537&amp;text=Hi..." target="_blank" rel="noreferrer">WhatsApp</a>
                </div>
                <button className="btn btn-danger shadow-sm" onClick={handleLogout}>Log out</button>
              </div>
            </div>

            <div className="card shadow-lg border-0 rounded-lg p-4 text-center">
              <h5 className="fw-bold text-primary">Latest Activity</h5>
              <hr />
              <ul className="list-group">
                <li className="list-group-item">Completed a project on React</li>
                <li className="list-group-item">Attended a DevOps workshop</li>
                <li className="list-group-item">Published a new blog post</li>
                <li className="list-group-item">Started a YouTube series on CICD</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-lg mb-4 p-4">
              <h5 className="fw-bold text-primary">Profile Information</h5>
              <hr />
              <p><strong>Full Name:</strong> {props.fullName}</p>
              <p><strong>Email:</strong> {props.email}</p>
              <p><strong>Phone:</strong> +91-6363730986</p>
              <p><strong>Mobile:</strong> +91-9740672537</p>
              <p><strong>Address:</strong> Software Training Institute Bangalore</p>
            </div>
            <div className="card shadow-lg border-0 rounded-lg mb-4 p-4">
              <h5 className="fw-bold text-primary">Bar Chart (Dummy Data)</h5>
              <hr />
              <div className="progress mb-3" style={{ height: "20px" }}>
                <div className="progress-bar bg-primary fw-bold" role="progressbar" style={{ width: "30%" }}>Jan (30%)</div>
              </div>
              <div className="progress mb-3" style={{ height: "20px" }}>
                <div className="progress-bar bg-success fw-bold" role="progressbar" style={{ width: "45%" }}>Feb (45%)</div>
              </div>
              <div className="progress mb-3" style={{ height: "20px" }}>
                <div className="progress-bar bg-warning fw-bold" role="progressbar" style={{ width: "60%" }}>Mar (60%)</div>
              </div>
              <div className="progress" style={{ height: "20px" }}>
                <div className="progress-bar bg-danger fw-bold" role="progressbar" style={{ width: "80%" }}>Apr (80%)</div>
              </div>
            </div>
            <div className="card shadow-lg border-0 rounded-lg mb-4 p-4 text-center">
              <h5 className="fw-bold text-primary">Pie Chart (Dummy Data)</h5>
              <hr />
              <div className="d-flex justify-content-center">
                <div className="chart-pie shadow-sm" style={{ width: "200px", height: "200px", borderRadius: "50%", background: "conic-gradient(#0088FE 40%, #00C49F 70%, #FFBB28 85%, #FF8042 100%)" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileData;