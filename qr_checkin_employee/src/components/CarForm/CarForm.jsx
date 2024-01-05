import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

const CarForm = ( props ) => {
    const [selectedCartype, setSelectedCartype] = useState('company');
    const handleCartypeChange = (event) => {
        setSelectedCartype(event.target.value);
    }

    const [carOptions, setCarOptions] = useState([]);
    const [numberPlate, setNumberPlate] = useState('');
    const [registerDate, setRegisterDate] = useState('');
    
    const navigate = useNavigate();

    const baseUrl = process.env.REACT_APP_BASE_API_URL;

    useEffect(() => {
        const getCompanyCars = async () => {
            try {
                const response = await axios.get(
                    baseUrl + '/api/employee/get-car',
                );
                setCarOptions(response?.data?.message);
            } catch (error) {
                console.error('Cannot get company cars!');
            }
        }

        getCompanyCars();

    }, []);

    const [formData, setFormData] = useState({
        car_type: selectedCartype,
        car_name: '',
        car_number: '',
        register_date: '',
        check_in_km: '',
        check_out_km: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };
    
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                baseUrl + `/api/employee/update-attendance?attendanceID=${ props.attendance_id }`,
                formData,
            );
            alert("Successfully update!");
            navigate('/schedule');
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };   

    return (
        <>
        {/* Manually open the Form */}
        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#autofahrerForm">
            Open auto form
        </button> */}

        <div 
            style={{ display: props.position === 'Autofahrer' ? 'block' : 'none' }}
            className={`modal fade ${props.position === 'Autofahrer' ? 'show' : ''}`} 
            id="autofahrerForm" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" 
            aria-labelledby="autofahrerFormLabel" aria-hidden="true"
        >
            <div className="modal-dialog">
                {/* Header */}
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="autofahrerFormLabel">Autofahrer</h1>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <label className="form-label">Car type</label>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="car_type" 
                            value="company" 
                            checked={selectedCartype === "company"} 
                            onChange={handleCartypeChange}
                            id="companyCar"
                        />
                        <label className="form-check-label" htmlFor="companyCar">
                            Company
                        </label>
                    </div>
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="radio" name="car_type" 
                            value="private"
                            checked={selectedCartype === "private"} 
                            onChange={handleCartypeChange}
                            id="privateCar"
                        />
                        <label className="form-check-label" htmlFor="privateCar">
                            Private
                        </label>
                    </div>

                    <div className={selectedCartype !== "company" ? 'd-none' : ''}>
                        <label className="form-label">Car name</label>
                        <select 
                            className="form-select mb-3" 
                            id="inputGroupSelect01"
                            name="car_name"
                            onChange={ handleInputChange }
                        >
                            <option value="">Choose...</option>
                            {carOptions?.map(option => (
                                <option key={ option._id } value={ option.car_name }>
                                    { option.car_name }
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={selectedCartype !== "private" ? 'd-none' : ''}>
                        <label className="form-label">Number plate</label>
                        <input 
                            type="text" className="form-control mb-3" 
                            id="" placeholder="Enter car's number plate"
                            name="car_number"
                            value={ formData.car_number }
                            onChange={ handleInputChange }
                        />
                    </div>
                    <div className={selectedCartype !== "private" ? 'd-none' : ''}>
                        <label className="form-label">Register date</label>
                        <input 
                            type="text" className="form-control mb-3" 
                            placeholder="Enter car's register date" 
                            name="register_date" 
                            value={ formData.register_date }
                            onChange={ handleInputChange }
                        />
                    </div>
                    <div  className={`mb-3 ${ props.check_out ? 'd-none' : '' }`}>
                        <label className="form-label">Number of kilometers (check-in)</label>
                        <div className="input-group mb-3">
                            <input 
                                type="number" className="form-control" 
                                placeholder="Enter number of kilometers" 
                                name="check_in_km" 
                                value={ formData.check_in_km }
                                onChange={ handleInputChange }
                            />
                            <span className="input-group-text" >kilometer(s)</span>
                        </div>
                    </div>
                    <div className={`mb-3 ${ props.check_out ? '' : 'd-none' }`}>
                        <label className="form-label">Number of kilometers (check-out)</label>
                        <div className="input-group">
                            <input 
                                type="number" className="form-control" 
                                placeholder="Enter number of kilometers"
                                name="check_out_km" 
                                value={ formData.check_out_km }
                                onChange={ handleInputChange }
                            />
                            <span className="input-group-text" >kilometer(s)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button 
                        type="button" className="btn btn-secondary" 
                        data-bs-dismiss="modal"
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

export default CarForm;
