import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomSearch = ({ handleSearchResult }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        toast.error('Error fetching room types:'+ error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  /**THis is going to be used to fetch available rooms from database base on search data that'll be passed in */
  const handleInternalSearch = async () => {
    if (!startTime || !endTime || !roomType) {
      toast.error('Please select all fields');
      return false;
    }
    if (startTime >= endTime) {
      toast.error('Start time must be before end time');
      return false;
    }
    try {
      // Convert startTime to the desired format
      const formattedStartTime = startTime ? startTime.toISOString() : null;
      const formattedEndTime = endTime ? endTime.toISOString() : null;
      
      // Call the API to fetch available rooms
      const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartTime, formattedEndTime, roomType);

      // Check if the response is successful
      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          toast.error('Room not currently available for this date, time and time range on the selected rom type.');
          window.scrollTo({ top: 0, behavior: 'smooth' });

          return
        }
        handleSearchResult(response.roomList);
      }
    } catch (error) {
      toast.error("Unknown error occurred: " + error.response.data.message);
    }
  };

  return (
    <section>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick/>
      <div className="search-container">
        <div className="search-field">
          <label>Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={(dateTime) => setStartTime(dateTime)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={15}
            placeholderText="Select Start Date & Time"
          />
        </div>
        <div className="search-field">
          <label>End Time</label>
          <DatePicker
            selected={endTime}
            onChange={(dateTime) => setEndTime(dateTime)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={15}
            placeholderText="Select End Date & Time"
          />
        </div>

        <div className="search-field">
          <label>Room Type</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option disabled value="">
              Select Room Type
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>
        <button className="home-search-button" onClick={handleInternalSearch}>
          Search Rooms
        </button>
      </div>
    </section>
  );
};

export default RoomSearch;