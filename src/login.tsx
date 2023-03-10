import "bootstrap-icons/font/bootstrap-icons.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import ForgetPAssword from "./Forgetpassword";
import { Modal } from "react-bootstrap";

const Login: React.FC = (props) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
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
    formState: { errors },
  } = useForm(formOptions);
  const emailError: any = errors.email?.message;
  const passwordError: any = errors.password?.message;
  const handleLogin = async (data: any) => {
    try {
      setLoading(true);
      const postdata = { email: data.email, password: data.password };
      const response = await fetch("http://localhost:8080/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postdata),
      });
      const res = await response.json();
      if (res.success === true) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "light",
        });
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("username", res.data.name);
        localStorage.setItem("userid", res.data.userId);
        setLoading(false);
        navigate("/dashboard");
        window.location.reload();
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
    <section>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forget Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ForgetPAssword setModal={setShow} />
        </Modal.Body>
      </Modal>
      <ToastContainer />
      <div className="container-fluid h">
        <div className="row d-flex justify-content-center align-items-center m-5">
          <div className="col-7">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            ></img>
          </div>
          <div className="col-5">
            <form>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="username">
                  email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  className="form-control form-control-md"
                />

                <div className="text-danger">{emailError}</div>
              </div>

              <div className="form-outline mb-3">
                <label className="form-label">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  className="form-control form-control-md"
                />

                <div className="text-danger">{passwordError}</div>
              </div>
              <div
                onClick={() => setShow(true)}
                className="d-flex justify-content-end"
              >
                <a href="#!">Forgot password?</a>
              </div>
              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  onClick={handleSubmit(handleLogin)}
                  type="button"
                  className="btn btn-primary btn-md btn-block"
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm mr-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Login
                </button>
                <Link to="/sign-up" className="small fw-bold  mt-2 pt-1 mb-0">
                  <div className="d-flex justify-content-center">
                    <p className="small fw-bold  mt-2 pt-1 mb-0">
                      Don't have an account?{" "}
                      <a href="#" className="link-danger">
                        Register
                      </a>
                    </p>
                  </div>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
