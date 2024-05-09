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
          const response = await axios.post('http://localhost:5000/api/tournament/match/submitCode', {
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
      window.addEventListener("message", handleMessage);
    };

    setupListeners();

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
    };

    return cleanup;

  },[language])

  useEffect(() => {
    let script;
    let getLanguageListTimeout;

    const cleanup = () => {
      if (script) {
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

    getLanguageListTimeout = setTimeout(getLanguageList, 5000);

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
      <div id="language-dropdown-container">
        <h3>Select Language:</h3>
        <select id="languageDropdown" onChange={handleLanguageChange}>
          {languages?.map((language, index) => (
            <option key={index} value={language.id}>
              {language.language}
            </option>
          ))}
        </select>
      </div>
      <div id="jdoodle-container"></div>
      <div>Note:</div>
      <div>1. Latest submission is taken into consideration while comparing.</div>
      <div>2. You need to write something in the IDE before submitting.</div>
      <center><button onClick={submitCode}>Submit Code</button></center>
    </div>
  );
};

export default IDE;
