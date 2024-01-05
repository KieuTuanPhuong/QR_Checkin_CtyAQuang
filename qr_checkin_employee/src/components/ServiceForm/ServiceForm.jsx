import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceForm = ( props ) => {
    const [formData, setFormData] = useState({
        bar: '',
        gesamt: '',
        trinked_ec: '',
        trink_geld: '',
        auf_rechnung: '',
    });

    const [formValid, setFormValid] = useState({
        bar: false,
        gesamt: false,
        trinked_ec: false,
        trink_geld: false,
        auf_rechnung: false,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };
    
        setFormData(newFormData);
        setFormValid({
            ...formValid,
            [name]: value !== '',
        });
    };
    const navigate = useNavigate();
    const isFormValid = Object.values(formValid).every((field) => field);

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                baseUrl + `/api/employee/update-attendance?attendanceID=${ props.attendance_id }`,
                formData,
            );
            alert("Successfully update checkout!");
            navigate('schedule');
        } catch (error) {
            alert(error.response?.data?.message);
        }

        console.log('Form submitted:', formData);
    };    
    
    return (
        <>
        {/* Manually open the Form */}
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#serviceForm">
            Open service form
        </button> */}

        <div 
            style={{ display: props.position === 'Service' ? 'block' : 'none' }}
            className={`modal fade ${props.position === 'Service' ? 'show' : ''}`} 
            id="serviceForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="serviceFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="serviceFormLabel">Service</h1>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="form-floating mb-3">
                        <input 
                            type="number" placeholder="Enter bar"
                            className={`form-control ${isFormValid ? '' : 'is-invalid'}`} 
                            name='bar'
                            value={ formData.bar }
                            onChange={ handleInputChange }
                        />
                        <label>BAR</label>
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="input-group has-validation mb-3">
                        <div className={`form-floating ${isFormValid ? '' : 'is-invalid'}`}>
                            <input   
                                type="number" placeholder="Username"
                                className={`form-control ${isFormValid ? '' : 'is-invalid'}`} 
                                name='gesamt'
                                value={ formData.gesamt }
                                onChange={ handleInputChange }
                            />
                            <label >Gesamt</label>
                        </div>
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <div className={`form-floating ${isFormValid ? '' : 'is-invalid'}`}>
                            <input   
                                type="number" placeholder="Username" 
                                className={`form-control ${isFormValid ? '' : 'is-invalid'}`} 
                                name='trinked_ec'
                                value={ formData.trinked_ec }
                                onChange={ handleInputChange }
                            />
                            <label>Trinkgeld EC</label>
                        </div>
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <div className={`form-floating ${isFormValid ? '' : 'is-invalid'}`}>
                            <input   
                                type="number" placeholder="Username" 
                                className={`form-control ${isFormValid ? '' : 'is-invalid'}`} 
                                name='trink_geld'
                                value={ formData.trink_geld }
                                onChange={ handleInputChange }
                            />
                            <label>Trinkgeld Gutschein</label>
                        </div>
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <div className={`form-floating ${isFormValid ? '' : 'is-invalid'}`}>
                            <input   
                                type="number" placeholder="Username" 
                                className={`form-control ${isFormValid ? '' : 'is-invalid'}`} 
                                name='auf_rechnung'
                                value={ formData.auf_rechnung }
                                onChange={ handleInputChange }
                            />
                            <label>Auf Rechnung</label>
                        </div>
                        <div className="invalid-feedback">
                            This field is required.
                        </div>
                    </div> 

                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button 
                        type="button" className="btn btn-secondary" 
                        data-bs-dismiss="modal"
                        disabled={ !isFormValid }
                        onClick={ handleSubmit }
                    >
                        Submit
                    </button>
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ServiceForm;
