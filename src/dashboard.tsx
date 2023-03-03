import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UpdateModal from "./updatemodal";

const Dashoard: React.FC = () => {
    const [users, setUsers] = useState<any>([])
    const [departmnet, setDepartment] = useState<any>([])
    const [taks, setTask] = useState<any>([])
    const [projects, setProjects] = useState<any>([])
    const [historys, setHistorys] = useState<any>([])
    const username = localStorage.getItem('username')



    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear()
        navigate("/")

    }
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        const [departments, projects, tasks, taskhistorys]: any = await Promise.all([
            fetch('http://localhost:8080/api/user/selectdepartments'),
            fetch('http://localhost:8080/api/user/selectproject'),
            fetch('http://localhost:8080/api/user/selecttask'),
            fetch('http://localhost:8080/api/user/selecthistory'),
        ]);
        const getdepartment = await departments.json()


        const getproject = await projects.json()
        const gettask = await tasks.json()
        const gethistory = await taskhistorys.json()
        setDepartment(getdepartment.data)
        setTask(gettask.data)
        setProjects(getproject.data)
        setHistorys(gethistory.data)
    }




    return (
        <div>
            <div>
                <div className="modal fade" id="exampleModalScrollable" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">profile</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <UpdateModal aira-label={"Close"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                <a className="nav-link" href="#">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Team</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Projects</a>
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
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a className="dropdown-item" data-toggle="modal" data-target="#exampleModalScrollable">Edit Profile</a>
                                <a className="dropdown-item" onClick={logout}>logout</a>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
            <div className="p-3">
                <div>
                    <div className="form-outline">
                        <input type="search" id="form1" className="form-control" placeholder="Fillter" aria-label="Search" />
                    </div>
                </div>
                <div className="p-5" style={{ display: 'flex' }}>
                    <div className="card mr-3" style={{ width: '25rem' }}>
                        <h5 className="card-title p-3">Departments</h5>
                        {departmnet.map((items: any, index: any) => <div key={items._id} className="card-body" style={{ display: 'flex' }}>
                            <h5 className="card-title mr-3">{index + 1}</h5>
                            <p className="card-text text-capitalize">{items.departmentName}</p>

                        </div>)}
                    </div>
                    <div className="card mr-3" style={{ width: '25rem' }}>
                        <h5 className="card-title p-3">Projects</h5>
                        {projects.map((items: any, index: any) => <div key={items._id} className="card-body" style={{ display: 'flex' }}>
                            <h5 className="card-title mr-3">{index + 1}</h5>
                            <p className="card-text text-capitalize">{items.projectName}</p>

                        </div>)}
                    </div>
                    <div className="card mr-3" style={{ width: '25rem' }}>
                        <h5 className="card-title p-3">Tasks</h5>
                        {taks.map((items: any, index: any) => <div key={items._id} className="card-body" style={{ display: 'flex' }}>
                            <h5 className="card-title mr-3">{index + 1}</h5>
                            <p className="card-text text-capitalize">{items.tasks}</p>

                        </div>)}
                    </div>
                    <div className="card mr-3 " style={{ width: '25rem' }}>
                        <h5 className="card-title p-3">Histoys</h5>
                        {historys.map((items: any, index: any) => <div key={items._id} className="card-body" style={{ display: 'flex' }}>
                            <h5 className="card-title mr-3">{index + 1}</h5>
                            <p className="card-text text-capitalize">{items.task_historys}</p>

                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashoard;