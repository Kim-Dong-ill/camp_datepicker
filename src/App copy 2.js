import axios from 'axios';
import React, { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const fetchUsers = async () => {
    console.log("버튼 클릭");
    try {
      const response = await axios.get('http://localhost:8082/test?id=1');
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchUsers}>클릭</button>
      <h2>User List</h2>
      <div>{users.title} - {users.content}</div>
    </div>
  )
}

export default App