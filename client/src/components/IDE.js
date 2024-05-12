import React, { useEffect, useRef, useState } from 'react';
import pym from 'pym.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const IDE = ({ userID, problemID }) => {
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState("c");
  const [py, setPy] = useState();
  let pymParent;
  
  useEffect(()=>{

    const handleMessage = async (event) => {
      if (event.origin === "https://www.jdoodle.com" && event.data.languages) {
        const languages = JSON.parse(event.data.languages);
        setLanguages(languages);
      }
      if (event.origin === "https://www.jdoodle.com" && event.data.script) {
        const script = event.data.script;
        try {
          // Send script, language, userID, and problemID to backend
          const response = await axios.post('https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/match/submitCode', {
            script,
            language,
            userID,
            problemID
          });

          const { passedTestcases, totalTestcases } = response.data;
    
          let toastType = 'info'; // Default to info (blue) color
          let verdict = "Wrong answer";
    
          if (passedTestcases === totalTestcases) {
            toastType = 'success'; // Green color if all tests passed
            verdict = "Correct answer"
          } else if (passedTestcases === 0) {
            toastType = 'error'; // Red color if no tests passed
          } else {
            toastType = 'warning'; // Yellow color for other cases
          }
    
          toast[toastType](
            <div>
              <div>Test Cases Passed: {passedTestcases}/{totalTestcases}</div>
              <div>Verdict: {verdict}</div>
            </div>,
            { autoClose: 10000 }
          );
    
        } catch (error) {
          console.error('Error submitting code:', error);
        }
      }
    };

    const setupListeners = () => {
      window?.addEventListener("message", handleMessage);
    };

    setupListeners();

    const cleanup = () => {
      window?.removeEventListener("message", handleMessage);
    };

    return cleanup;

  },[language])

  useEffect(() => {
    let script;
    let getLanguageListTimeout;

    const cleanup = () => {
      pymParent?.remove();
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      clearTimeout(getLanguageListTimeout);
    };

    pymParent = new pym.Parent('jdoodle-container', 'https://www.jdoodle.com/embed/v1/8a810479c72723bb', {});
    setPy(pymParent);
    pymParent.sendMessage('setLanguage', 0);

    script = document.createElement('script');
    script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
    script.async = true;
    document.body.appendChild(script);

    getLanguageListTimeout = setTimeout(getLanguageList, 7000);

    return cleanup;
  }, []);

  const getLanguageList = () => {
    if (pymParent) {
      pymParent.sendMessage('getLanguageList');
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguageId = e.target.value;
    const lang = languages.find(lan => lan.id == selectedLanguageId);
    setLanguage(lang.language);
    if (py) {
      py.sendMessage('setLanguage', selectedLanguageId);
    }
  };

  const submitCode = () => {
    if (py) {
      py.sendMessage('getCode');
    }
  };

  return (
    <div>
      <ToastContainer />
        <div
        style={{ marginTop:"3rem",fontFamily: 'Arial, sans-serif', width:"90%",marginLeft:"auto", marginRight:"auto", padding: "20px",
        borderRadius: "8px", // Rounded corners for a softer look
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }}
        >
        <center style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>Code Editor</center>
        <div 
          id="language-dropdown-container" style={{ display: "flex", // Make the container flex
          alignItems: "center", // Align items vertically in the center
          justifyContent: "center", // Center items horizontally
          textAlign: "center",
          marginBottom:"1rem",
          marginTop:"2rem"
        }}>
        <h3 style={{ margin: "0 10px 0 0" }}>Select Language:</h3>
        <select id="languageDropdown" onChange={handleLanguageChange} style={{
          padding: "8px", // Adding padding to make it visually pleasing
          fontSize: "16px", // Increasing font size for better readability
          borderRadius: "4px", // Rounded corners for select box
          border: "1px solid #ccc", // Adding a border
          backgroundColor: "#fff", // Setting a white background
          boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.1)", // Adding a subtle box shadow
          width: "100px",
        }}>
          {languages?.map((language, index) => (
            <option key={index} value={language.id}>
              {language.language}
            </option>
          ))}
        </select>
      </div>
      <div id="jdoodle-container"></div>
      <div id="note-container" style={{
          marginTop:"2rem",
          backgroundColor: "#2c3e50", // Dark blue background
          color: "#fff", // White text color
          padding: "20px", // Padding for spacing
          borderRadius: "8px", // Rounded corners for a softer look
          maxWidth: "400px", // Limiting the width for better readability
          margin: "0 auto", // Centering the container horizontally
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Note:</div> {/* Bold text */}
          <ul style={{ marginBottom: "10px" }}>
            <li>Latest submission is taken into consideration while comparing.</li>
            <br></br>
            <li>You need to write something in the Code Editor before submitting, otherwise you won't get any results.</li>
          </ul>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={{
              marginTop: "2rem",
              marginBottom:"1.5rem",
              textDecoration: "none",
              color: "#fff", /* Change text color to white */
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
              padding: "1rem",
              backgroundColor: "#16a085",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              display: "inline-block",
              marginLeft:"auto",
              marginRight:"auto"
            }} onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1abc9c";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#16a085";
              e.target.style.transform = "scale(1)";
            }} onClick={submitCode}>Submit Code</button>
          </div>
      </div>
    </div>
  );
};

export default IDE;
