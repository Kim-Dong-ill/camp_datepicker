import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import axios from 'axios';

//css 적용
import "./css/datepicker.css"
import "react-datepicker/dist/react-datepicker.css";

// 한글 적용
import { ko } from 'date-fns/locale';
import { format, isWithinInterval } from 'date-fns';

registerLocale("ko", ko);

function App() {
  const [dateRange, setDataRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [reservations, setReservations] = useState([]);
  const [reservationed, setReservationed] = useState([]);

  var formattedStartDate;
  var formattedEndDate;

  if (startDate) {
    formattedStartDate = format(startDate, 'yyyy년 MM월 dd일', { locale: ko });
  }
  if (endDate) {
    formattedEndDate = format(endDate, 'yyyy년 MM월 dd일', { locale: ko });
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  //DB에서 예약 리스트 가져오기
  const fetchReservations = async () => {
    try {
      console.log("fetchReservations 시작");
      const response = await axios.get('http://localhost:8082/reservations');
      console.log(response.data);
      setReservationed(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //시작일, 마지막일 저장
  const handleReservation = async () => {
    if (startDate && endDate) {
      if (isReservationOverlap(startDate, endDate)) {
        alert('선택한 날짜 범위에 이미 예약된 날짜가 포함되어 있습니다.');
        return;
      }

      const adjustedStartDate = new Date(startDate.setHours(23, 0, 0, 0)).toISOString();
      const adjustedEndDate = new Date(endDate.setHours(23, 0, 0, 0)).toISOString();

      console.log("시작일 = " + adjustedStartDate);
      console.log("마지막일 = " + adjustedEndDate);

      const response = await axios.post('http://localhost:8082/reservation',
        {
          startDate: adjustedStartDate,
          endDate: adjustedEndDate
        });
      console.log(response);
      setReservations(response.data)
      fetchReservations();
      alert("<캠핑 예약 선택일> \n" + response.data.startDate + " ~ " + response.data.endDate + "\n" + response.data.message)
    }
  };

  //예약 불가 날짜 지정
  const isDateDisabled = (date) => {
    return reservationed.some(reservation =>
      isWithinInterval(date, {
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      }) || date.toDateString() === new Date(reservation.startDate).toDateString()
    );
  };

  //예약 가능한지 확인
  const isReservationOverlap = (start, end) => {
    return reservationed.some(reservation =>
      isWithinInterval(start, {
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      }) ||
      isWithinInterval(end, {
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      }) ||
      (start <= new Date(reservation.startDate) && end >= new Date(reservation.endDate))
    );
  };

  return (
    <div>
      <h1>예약 시스템</h1>
      <div>{startDate ? formattedStartDate : ""} ~ {endDate ? formattedEndDate : ""}</div>
      <DatePicker
        selectsRange={true}
        dateFormat="yyyy년 MM월 dd일"
        dateFormatCalendar="yyyy년 MM월"
        locale="ko"
        selected={startDate}
        onChange={(update) => setDataRange(update)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        minDate={new Date()}
        excludeDates={startDate ? [startDate] : []}
        filterDate={date => !isDateDisabled(date)}
        inline={true}
        isClearable={true}
      />

      <button onClick={handleReservation}>예약</button>
      <div>캠핑 시작일 : {reservations.startDate}</div>
      <div>캠핑 마감일 : {reservations.endDate}</div>
      <br></br>
      <h3>예약된 예약일</h3>
      {reservationed.map((item, idx) => {
        return (<div key={idx}>{idx + 1}. {item.startDate} ~ {item.endDate}</div>)
      })}
    </div>
  );
}


export default App