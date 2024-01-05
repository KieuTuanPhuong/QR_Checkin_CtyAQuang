import axios from "axios";
import { useEffect, useState } from "react";

import RequestLog from "./RequestLog";

const RequestHistory = () => {
    const [requestLogs, setRequestLogs] = useState([]);

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const getRequestHistory = async () => {
        try {
            const response = await axios.get(
                baseUrl + `/api/employee/get-all-request?employeeID=${userObject.id}`
            );
            setRequestLogs(response?.data?.message);
        } catch (error) {
            alert(error.response?.data?.message);
            console.log(error);
        }
    }
    
    const requestList = requestLogs.map((request) => {
        return (
            <RequestLog 
                request={request} key={request._id} 
                createdAt={request.createdAt.slice(0, 10)}
                answer_status={request.answer_status}
                request_dayOff_start={request.request_dayOff_start.slice(0, 10)}
                request_dayOff_end={request.request_dayOff_end.slice(0, 10)}
                request_content={request.request_content}
            />
        );
    });

    return (
        <>
        <button 
            type="button" className="btn btn-secondary ms-3" 
            data-bs-toggle="modal" data-bs-target="#requestHistory"
            onClick={ getRequestHistory }
        >
            Request History
        </button>

        <div className="modal fade" id="requestHistory" tabIndex="-1" aria-labelledby="historyLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="historyLabel">Request History</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <ul className="list-group">
                    { requestList }
                </ul>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>        
        </>
    );
}

export default RequestHistory;
