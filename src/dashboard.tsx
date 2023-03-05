import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import ActivityList from "./activityModal";


const Dashoard: React.FC = () => {
  const [departmnet, setDepartment] = useState<any>([]);
  const [contains, SetContains] = useState<any>("");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const username = localStorage.getItem("username");
  const handleClose = () => setShow(false);

  const logout = () => {
    localStorage.clear();
    navigate("/sign-in");
  };
  useEffect(() => {
    fetchData();
  }, [contains]);
  
  const fetchData = async () => {
    let data = {
      contains: contains,
    };
    fetch("http://localhost:8080/api/user/userdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contains ? data : undefined),
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartment(data.data);
      });
  };  
  return (
    <div>
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Activity File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityList setModal={setShow} />
        </Modal.Body>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Team
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Projects
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <h5 className="text-reset mt-3 m-lg-3 text-capitalize">
              {username}
            </h5>
            <div className="dropleft">
              <a
                className="dropdown-toggle"
                href="#"
                role="button"
                data-toggle="dropdown"
              >
                <img
                  src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                  className="rounded-circle"
                  height="25"
                  alt="Black and White Portrait of a Man"
                  loading="lazy"
                />
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <a
                  className="dropdown-item"
                   onClick={()=>setShow(true)}
                >
                  Activity
                </a>
                <a className="dropdown-item" onClick={logout}>
                  logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="p-3">
        <div className="form-group" >
          <label>Search</label>
          <input type="email" className="form-control" onChange={(e)=>SetContains(e.target.value)} id="exampleFormControlInput1" placeholder="search"/>
        </div>
        <div className="card mt-4">
          <div className="card-body">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">S NO</th>
                  <th scope="col">Departments</th>
                  <th scope="col">Projects</th>
                  <th scope="col">Tasks</th>
                  <th scope="col">TasksHistorys</th>
                </tr>
              </thead>
              {departmnet.map((item: any, index: any) => (
                <tbody>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.department}</td>
                    <td>{item.projectName}</td>
                    <td>{item.taskHistory}</td>
                    <td>{item.taskName}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashoard;
