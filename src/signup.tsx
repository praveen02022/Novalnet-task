import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [msg, setmsg] = useState();
  const [loading, setLoading] = useState(false);
  const phoneRegExp =
    /^((\\+[5-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val: any) =>
          val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required("This field is required!"),

    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    mobileNo: Yup.string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("this filed is required"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val: any) =>
          val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(formOptions);
  const usernameError: any = errors.username?.message;
  const mobileError: any = errors.mobileNo?.message;
  const emailError: any = errors.email?.message;
  const passwordError: any = errors.password?.message;
  const handleSignup = async (data: any) => {
    setLoading(true);
    try {
      const postdata = {
        name: data.name,
        email: data.email,
        mobile: data.mobileNo,
        password: data.password,
      };
      const response = await fetch("http://localhost:8080/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
      });
      const res = await response.json();
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
        setmsg(res.message);
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
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="container-fluid">
        <div
          className="row d-flex justify-content-center align-items-center m-5"
          style={{ background: "#f7f7f7" }}
        >
          <div className="col-8">
            <img
              src="images/1.png"
              className="img-fluid"
              alt="Sample image"
            ></img>
          </div>
          <div className="col-4">
            <form className="">
              {/* <!-- 2 column grid layout with text inputs for the first and last names --> */}
              <div className="form-outlin">
                <label className="form-label">Username</label>
                <input
                  {...register("name")}
                  type="text"
                  id="form3Example1"
                  className="form-control"
                />
              </div>
              <div className="text-danger">{usernameError}</div>
              <div className="form-outline mt-4 mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  id="form3Example3"
                  className="form-control"
                />
                <div className="text-danger">{emailError}</div>
              </div>
              <div className="form-outline">
                <label className="form-label">Mobile No</label>
                <input
                  type="number"
                  {...register("mobileNo")}
                  id="form3Example2"
                  className="form-control"
                />
              </div>
              <div className="text-danger">{mobileError}</div>

              <div className="form-outline mb-4 mt-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  {...register("password")}
                  id="form3Example4"
                  className="form-control"
                />
                <div className="text-danger">{passwordError}</div>
              </div>
              <button
                onClick={handleSubmit(handleSignup)}
                className="btn btn-primary btn-block mb-4"
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm mr-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Sign up
              </button>
            </form>

            {msg && (
              <div className="card bg-success">
                <div className="card-body p-2">
                  <p className="card-text text-light">{msg}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Signup;
