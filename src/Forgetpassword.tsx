import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ForgetPAssword = (props: any) => {
  const { setModal } = props;
  const [email, Setemail] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
  }, [fileContents]);

  const verifyEmail = async () => {
    setLoading(true);
    let data = {
      email: email,
    };
    const response: any = await fetch(
      "http://localhost:8080/api/user/forgetpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    let res = await response.json();
    if (res.success === true) {
      setLoading(false);
      setModal(false);
      toast.success(res.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setLoading(false);
      setModal(false);
      toast.error(res.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "colored",
      });
      // setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <ToastContainer />
      <input
        type="email"
        className="form-control"
        onChange={(e) => Setemail(e.target.value)}
        id="exampleFormControlInput1"
        placeholder="email"
      />
      <div className="d-flex justify-content-end">
        <button
          onClick={verifyEmail}
          type="button"
          className="btn btn-primary btn-sm mt-3 "
        >
          {loading && (
            <span
              className="spinner-border spinner-border-sm mr-4"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Verify
        </button>
      </div>
    </div>
  );
};

export default ForgetPAssword;
