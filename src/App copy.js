import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import axios from 'axios';

// import {addDays, isWithinInterval} from 'date-fns'

//css 적용
import "./css/datepicker.css"
import "react-datepicker/dist/react-datepicker.css";

// 한글 적용
import { ko } from 'date-fns/locale';
import { addDays, format } from 'date-fns';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //시작일, 마지막일 저장
  const handleReservation = async () => {
    if (startDate && endDate) {
      await axios.post('http://localhost:8082/api/reservations', { startDate, endDate });
      fetchReservations();
      setStartDate(null);
      setEndDate(null);
    }
  };

  const isDateDisabled = (date) => {
    return reservations.some(reservation =>
      date >= new Date(reservation.startDate) && date <= new Date(reservation.endDate)
    );
  };

  return (
    <div>
      <h1>예약 시스템</h1>
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        minDate={new Date()}
      // filterDate={date => !isDateDisabled(date)}
      />
      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      // filterDate={date => !isDateDisabled(date)}
      />
      <button onClick={handleReservation}>예약</button>
    </div>
  );
}


export default App