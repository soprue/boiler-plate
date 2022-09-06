import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
        .then(response => { 
          console.log(response);
        })
        .catch(err => { 
          console.log(err); 
        });
  }, []);

  const onClickHandler = () => {
    axios.get(`http://localhost:5000/api/users/logout`)
        .then(response => {
          if(response.data.success) {
            navigate("/login");
          } else {
            alert("로그아웃하는 데 실패했습니다.");
          }
        });
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh"
    }}>
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;