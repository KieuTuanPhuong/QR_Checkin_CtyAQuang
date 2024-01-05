import { useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";
import Navigation from "../../components/Navigation/Navigation";
import RequestHistory from "../../components/RequestHistory/RequestHistory";

const VacationRequest = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        request_dayOff_start: '',
        request_dayOff_end: '',
        request_content: '',
    });

    const {
        user: {id: userID}
    } = useContext(AuthContext);

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                baseUrl + `/api/employee/create-request?employeeID=${userID}`,
                formData,
            );
            alert("Successfully sent the request!");
            setIsLoading(false);
        } catch (err) {
            alert(err.response?.data?.message);
            setIsLoading(false);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    return (
        <>
        <Navigation />
        <div className="container p-4 mt-5">
            <h4 className="mb-3">Request vacation form</h4>
            <label className="form-label">Start day</label>
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="mm/dd/yyyy"
                    name="request_dayOff_start"
                    value={ formData.request_dayOff_start }
                    onChange={ handleInputChange }
                    disabled={isLoading} 
                />
            </div>

            <label className="form-label">End day</label>
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="mm/dd/yyyy"
                    name="request_dayOff_end"
                    value={ formData.request_dayOff_end }
                    onChange={ handleInputChange } 
                    disabled={isLoading}
                />
            </div>

            <label className="form-label">Reason</label>
            <div className="input-group mb-3">
                <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="3"
                    name="request_content"
                    value={ formData.request_content }
                    onChange={ handleInputChange }
                    disabled={isLoading}
                ></textarea>
            </div>

            <div className="">
                <button 
                    className="btn btn-primary"
                    onClick={ handleFormSubmit }
                    disabled={isLoading}
                >
                    <span name="loading" aria-hidden="true" 
                        className={
                            `spinner-border spinner-border-sm me-2
                            ${isLoading ? '' : 'd-none'}`
                        }
                    ></span>
                    <span name="loading" className={`${isLoading ? '' : 'd-none'}`} role="status">Sending...</span>
                    <span name="submitBtn" className={`${isLoading ? 'd-none' : ''}`}>Send request</span>
                </button>

                <RequestHistory />
            </div>
        </div>
        </>
    );
}

export default VacationRequest;
