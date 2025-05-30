import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomName: '',
        roomType: '',
        roomPhotoURL: '',
        capacity: '',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                toast.error('Error fetching room types:', error.message);
            }
        };
        fetchRoomTypes();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value }));
        }
    };


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };


    const addRoom = async () => {
        if (!roomDetails.roomName || !roomDetails.roomType || !roomDetails.capacity ||!roomDetails.description) {
            toast.error('All room details must be provided.');
            return;
        }

        if (!window.confirm('Do you want to add this room?')) {
            return
        }

        try {
            const formData = new FormData();
            formData.append('roomName', roomDetails.roomName);
            formData.append('roomType', roomDetails.roomType);
            formData.append('capacity', roomDetails.capacity);
            formData.append('description', roomDetails.description);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 200) {
                toast.success('Room Added successfully.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                setTimeout(() => {
                    toast.success('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="edit-room-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <h2>Add New Room</h2>
            <div className="edit-room-form">
                <div className="form-group">
                    {preview && (
                        <img src={preview} alt="Room Preview" className="room-photo-preview" />
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Room Name</label>
                    <input
                        type="text"
                        name="roomName"
                        value={roomDetails.roomName}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Room Type</label>
                    <select value={roomDetails.roomType} onChange={handleRoomTypeChange}>
                        <option value="">Select a room type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Other (please specify)</option>
                    </select>
                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Enter new room type"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
                </div>
                <div className="form-group">
                    <label>Room Capacity</label>
                    <input
                        type="number"
                        name="capacity"
                        value={roomDetails.capacity}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Room Description</label>
                    <textarea
                        name="description"
                        value={roomDetails.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button className="update-button" onClick={addRoom}>Add Room</button>
            </div>
        </div>
    );
};

export default AddRoomPage;