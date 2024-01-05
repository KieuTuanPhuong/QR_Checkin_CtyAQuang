const Navigation = () => {
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/schedule">Navigate</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="schedule">Schedule</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="attendance-history" >Attendance history</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="check-in" >Scan QR</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="vacation-request" >Vacation request</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
}

export default Navigation;
