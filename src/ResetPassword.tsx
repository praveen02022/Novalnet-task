import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const ResetPassword = () => {
  const [password, SetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const navigate = useNavigate();

  const resetPassword = async () => {
    setLoading(true);
    let data = {
      password: password,
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/password-reset/${param.id}/${param.token}`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      let res = await response.json();
      if (res.success === true) {
        setLoading(false);
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/sign-in");
      } else {
        setLoading(false);
        toast.error(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="p-3 d-flex justify-content-center align-items-center"
        style={{ height: "30rem" }}
      >
        <div className="card" style={{ width: "25rem" }}>
          <div className="card-body">
            <div className="mb-3">
              <h5>ResetPassword</h5>
            </div>
            <input
              type="password"
              className="form-control"
              onChange={(e) => SetPassword(e.target.value)}
              id="exampleFormControlInput1"
              placeholder="Password"
            />
            <button
              onClick={resetPassword}
              type="button"
              className="btn btn-primary btn-sm btn-block mt-3"
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm mr-4"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
