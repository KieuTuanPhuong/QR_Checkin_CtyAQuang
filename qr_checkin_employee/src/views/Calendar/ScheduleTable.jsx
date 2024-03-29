import { useState, useEffect, useContext } from 'react';

import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import axios from 'axios';
// import { format } from "date-fns-tz";
import { shiftType } from '../../assets/data/data';

import Navigation from '../../components/Navigation/Navigation';
import { AuthContext } from '../../context/AuthContext';

const ScheduleTable = (props) => {
    const { id, name, departmentDefined, role } = props
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [FormState, setFormState] = useState(false);
    const [addShiftFormState, setAddShiftFormState] = useState(true);
    const [inforShiftFormState, setInforShiftFormState] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [dateFormDb, setDateFormDb] = useState("")
    const [loading, setLoading] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [attendanceDataByDate, setAttendanceDataByDate] = useState()
    const [scheduleDataByDate, setScheduleDataByDate] = useState()
    const [scheduleEmployee, setScheduleEmployee] = useState()
    const [shiftDataByDate, setShiftDataByDate] = useState()
    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState('');
    const [selectedPositionEmployee, setSelectedPositionEmployee] = useState('');
    const [selectedShiftType, setSelectedShiftType] = useState()
    const [shiftList, setShiftList] = useState()
    const [positionList, setPositionList] = useState()
    const [selectedShiftAddShiftForm, setSelectedShiftAddShiftForm] = useState()
    const [positionsByDepartment, setPositionsByDepartment] = useState({});
    // const [userObject, setUserObject] = useState()

    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const handleShiftClick = (shift) => {
        setSelectedShift(shift);
    };

    const {
        user: { id: userID }
    } = useContext(AuthContext)

    
    const baseUrl = process.env.REACT_APP_BASE_API_URL;
    
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;
    const fetchScheduleEmployyee = async () => {
        try {
            const response = await axios.get(
                baseUrl + `/api/employee/get-schedules?employeeID=${userID}&employeeName=${userObject.name}`,
                { withCredentials: true }
            );
            setScheduleEmployee(response.data);
            // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    // useEffect(() => {
    //     setUserObject(userObject)
    //     console.log(userObject);
    // }, [])

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            setSelectedDepartmentEmployee(userObject?.department_name)
            setCheckInhaber(true)
            setCheckManager(false)
        }
    }, [userObject?.role, userObject?.department_name]);

    useEffect(() => {
        const getAllShifts = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get(
                        baseUrl + '/api/admin/manage-shift/get-all', 
                        { withCredentials: true }
                    );
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get(
                        baseUrl + '/api/inhaber/manage-shift/get-all',
                        { withCredentials: true }
                    );
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        getAllShifts()

        fetchScheduleEmployyee();

        const fetchScheduleDataByDate = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const year = selectedDate.substring(0, 4);
                    const month = selectedDate.substring(5, 7);
                    const day = selectedDate.substring(8, 10)
                    const date = `${month}/${day}/${year}`
                    const response = await axios.get(
                        baseUrl `/api/admin/manage-date-design/get-by-specific?employeeID=${id}&year=${year}&month=${month}&date=${date}`,
                        { withCredentials: true }
                    );

                    setScheduleDataByDate(response.data.message);
                } catch (error) {
                    if (error.response && error.response.status) {
                        if (error.response.status === 404) {
                            setScheduleDataByDate([])
                        }
                    } else {
                        console.error("Error fetching schedule data:", error.message);
                    }
                }
            }

            if (userObject?.role === "Inhaber") {
                try {
                    const year = selectedDate.substring(0, 4);
                    const month = selectedDate.substring(5, 7);
                    const day = selectedDate.substring(8, 10)
                    const date = `${month}/${day}/${year}`
                    const response = await axios.get(
                        baseUrl + `/api/inhaber/manage-date-design/get-by-specific?employeeID=${id}&year=${year}&month=${month}&date=${date}&inhaber_name=${userObject?.name}`,
                        { withCredentials: true }
                    );

                    setScheduleDataByDate(response.data.message);
                } catch (error) {
                    if (error.response && error.response.status) {
                        if (error.response.status === 404) {
                            setScheduleDataByDate([])
                        }
                    } else {
                        console.error("Error fetching schedule data:", error.message);
                    }
                }
            }
        };
        fetchScheduleDataByDate();
    }, [id, selectedDate, dateFormDb, role, userObject?.role]);

    if (shiftDataByDate) {
        console.log("sdfdfsfd", shiftDataByDate);
    }

    const renderTileContent = ({ date }) => {
        if (!scheduleEmployee || !scheduleEmployee.message) return null;
        const dataForDate = scheduleEmployee?.message
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === date.toDateString();
            })
            .map((schedule) => ({
                departmentName: schedule.department_name,
                shiftCode: schedule.shift_code,
                position: schedule.position,
                start_time: schedule.time_slot.start_time,
                end_time: schedule.time_slot.end_time,
            }));

        return (
            <div className={`font-Changa calendar-tile ${dataForDate?.length > 0 ? "scheduled" : ""}`}>
                {/* You can customize the content of the tile here */}
                {dataForDate?.length > 0 ? (
                    dataForDate.map(({ departmentName, shiftCode, position, end_time, start_time }, index) => (
                        <div key={index} className="d-flex flex-column gap-2 border-secondary py-2 rounded-3 mt-2 bg-light align-items-center justify-content-center fw-bold">
                            <div className='d-flex flex-row gap-2'>
                                <div className="border border-danger bg-danger ms-2 rounded-circle" style={{ width: "0.6rem", height: "0.6rem" }}></div>
                                <div className="text-dark">{departmentName}: {shiftCode}-{position}</div>
                            </div>
                            <div className="text-dark">({start_time}-{end_time})</div>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        );
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const [formData, setFormData] = useState({
        data: {
            dates: [],
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If the field is 'dates', split the input into an array
        const updatedValue = name === "dates" ? value.split(",") : value;

        setFormData((prevData) => ({
            data: {
                ...prevData.data,
                [name]: updatedValue,
            },
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const { data } = await axios.post(
                baseUrl + `/api/employee/get-attendance?employeeID=${userID}&employeeName=${userObject.name}`,
                {
                    dates: formData.data.dates,
                    shift_code: selectedShiftAddShiftForm,
                    position: selectedPositionEmployee

                },
                { withCredentials: true }
            );
            fetchScheduleEmployyee()
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (error) {
            // Handle error
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
            setFormState(false)
            setFormData({
                dates: []
            })
            setSelectedShiftAddShiftForm("")
            setSelectedDepartmentEmployee("")
            setSelectedPositionEmployee("")
        }
    }

    // const handleClickDay = (value, event) => {

    //     setFormState(true);

    //     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     // const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
    //     const localDate = timeZone;
    //     const inputDate = new Date(localDate);
    //     const outputDateFormDb = inputDate.toISOString();
    //     setSelectedDate(localDate);
    //     setDateFormDb(outputDateFormDb);

    //     console.log("Selected date:", localDate);
    //     console.log("loclDate", localDate);
    //     console.log("dateformDB", dateFormDb);

    //     setSelectedShift(null)
    // };  

    return (
        <>
            <Navigation />
            <div className="flex flex-col justify-center items-center w-full gap-4 font-Changa text-textColor mt-3">
                <h2 className="text-2xl font-bold">Schedule Calendar</h2>
                {selectedYear && (
                    <Calendar
                        onChange={handleMonthChange}
                        // onClickDay={handleClickDay}
                        value={selectedMonth}
                        view="month"
                        showNeighboringMonth={false}
                        tileContent={renderTileContent}
                    />
                )}

                {/* //---------------------------------------------------------------- ADD SHIFT FOR EMPLOYEE ----------------------------------------------------------------// */}
                {FormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                    <div
                        onClick={() => setFormState(false)}
                        className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                    <div className="absolute w-[750px] top-0 right-0 bottom-0 z-30 bg-white">
                        <div className="w-full h-full">
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row justify-between px-8 items-center">
                                    <div className="flex flex-row items-center gap-4">
                                        <div
                                            onClick={() => {
                                                setAddShiftFormState(true)
                                                setInforShiftFormState(false)
                                            }}
                                            className={`cursor-pointer font-bold text-xl ${addShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Add Shift</div>
                                        <div
                                            onClick={() => {
                                                setAddShiftFormState(false)
                                                setInforShiftFormState(true)
                                            }}
                                            className={`cursor-pointer font-bold text-xl ${inforShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Shift Information</div>
                                    </div>
                                    <div
                                        onClick={() => setFormState(false)}
                                        className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                </div>
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                {addShiftFormState && (<div className="flex flex-col px-8 w-full mt-7">
                                    <form
                                        className="flex flex-col gap-6 w-full justify-center items-center"
                                        onSubmit={handleSubmit}>
                                        {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                            <div className="loader"></div>
                                        </div>)}
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Shift Code</span>
                                            </div>
                                            <select
                                                id="department"
                                                name="department"
                                                className="w-full cursor-pointer"
                                                value={selectedShiftAddShiftForm}
                                                onChange={(e) => setSelectedShiftAddShiftForm(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Shift Code*</option>
                                                {shiftList?.map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.code}>
                                                        {item.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {checkAdmin ? (<div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Department</span>
                                            </div>
                                            <select
                                                id="department"
                                                name="department"
                                                className="w-full cursor-pointer"
                                                value={selectedDepartmentEmployee}
                                                onChange={(e) => setSelectedDepartmentEmployee(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Department*</option>
                                                {departmentDefined?.map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>) : (
                                            <div></div>
                                        )}
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Position</span>
                                            </div>
                                            <select
                                                id="department"
                                                name="department"
                                                className="w-full cursor-pointer"
                                                value={selectedPositionEmployee}
                                                onChange={(e) => setSelectedPositionEmployee(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Position*</option>
                                                {employeeData.message[0]?.department
                                                    ?.filter((item) => item.name === selectedDepartmentEmployee)
                                                    .map((dept) =>
                                                        dept.position.map((item, index) => (
                                                            <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                                {item}
                                                            </option>
                                                        ))
                                                    )}
                                            </select>
                                        </div>
                                        <div className="w-full h-auto flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Dates</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="dates"
                                                required
                                                value={formData.data?.dates?.join(",")}
                                                onChange={handleChange}
                                                placeholder="Enter date (format: MM/DD/YYYY) and separate by commas ..."
                                            />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Shift Type</span>
                                            </div>
                                            <select
                                                id="shift-type"
                                                name="shift-type"
                                                className="w-full cursor-pointer"
                                                value={selectedShiftType}
                                                onChange={(e) => setSelectedShiftType(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Shift Type*</option>
                                                {shiftType?.map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div
                                            className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                            <button type="submit" className="w-full">Add</button>
                                        </div>
                                    </form>
                                </div>)}
                                {/* //----------------------------------------------------------------  SHIFT INFORMATION ----------------------------------------------------------------// */}
                                {inforShiftFormState && (<div className="flex flex-col px-8 w-full mt-7 gap-2 font-Changa text-textColor">
                                    <div className="font-bold text-2xl">Shift Information</div>
                                    <div className="flex flex-row gap-3">
                                        {scheduleDataByDate?.length === 0 ? (
                                            <div className="font-bold text-red-600 text-xl">No shift for this day</div>
                                        ) : (
                                            scheduleDataByDate?.map((item) => (
                                                <div key={item._id} className="flex flex-row gap-4">
                                                    <span className={`cursor-pointer ${selectedShift === item.shift_code ? 'text-buttonColor1 underline decoration-buttonColor1' : ''}`} onClick={() => handleShiftClick(item?.shift_code)}>
                                                        {item?.shift_code}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {selectedShift && (
                                        <div>
                                            {attendanceDataByDate
                                                ?.filter((item) => item?.shift_info?.shift_code === selectedShift)
                                                .map((filteredItem) => (
                                                    <div key={filteredItem._id}>
                                                        {filteredItem?.status === "missing" ? (
                                                            <div className="text-center font-bold text-red-600 text-xl" key={filteredItem._id}>STATUS: MISSING</div>
                                                        ) : (
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex flex-row justify-between mt-5">
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                        <div>CHECKIN TIME</div>
                                                                        <div>{filteredItem?.shift_info?.time_slot?.check_in_time}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                        <div>WORKING TIME</div>
                                                                        <div>{`${filteredItem?.shift_info?.total_hour}h ${filteredItem?.shift_info?.total_minutes}m`}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center font-bold text-red-600 text-xl">
                                                                        <div>CHECKOUT TIME</div>
                                                                        <div>{filteredItem?.shift_info?.time_slot?.check_out_time}</div>
                                                                    </div>
                                                                </div>
                                                                {filteredItem?.position === "Autofahrer" ? (<div className="flex flex-row justify-between mt-5">
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                        <div>CHECKIN KM</div>
                                                                        <div>{filteredItem?.check_in_km}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                        <div>TOTAL KM TIME</div>
                                                                        <div>{filteredItem?.total_km}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center font-bold text-red-600 text-xl">
                                                                        <div>CHECKOUT KM</div>
                                                                        <div>{filteredItem?.check_out_km}</div>
                                                                    </div>
                                                                </div>) : (<div></div>)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.10)] mt-4"></div>
                                    {selectedShift && (
                                        <div>
                                            {scheduleDataByDate
                                                ?.filter((item) => item?.shift_code === selectedShift)
                                                .map((filteredItem) => (
                                                    <div className="w-full flex flex-col justify-center items-center gap-3 mt-3 text-base">
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Employee's Name</span>
                                                            <span className="w-2/3">{name}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Employee's ID</span>
                                                            <span className="w-2/3">{id}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Department</span>
                                                            <span className="w-2/3">{filteredItem?.department_name}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Role</span>
                                                            <span className="w-2/3">{role}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Position</span>
                                                            <span className="w-2/3">{filteredItem?.position}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Date</span>
                                                            <span className="w-2/3">{selectedDate.substring(0, 10)}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Shift's Code</span>
                                                            <span className="w-2/3">{selectedShift}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>
        </>
    );
}

export default ScheduleTable;
