import React, { useState, useEffect } from 'react';

function Problem({ problemId }) {
  const [problemStatement, setProblemStatement] = useState('');
  const apiUrl = `https://judgeapi.u-aizu.ac.jp/resources/descriptions/en/${problemId}`;

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const htmlContent = data.html;
        setProblemStatement(htmlContent);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiUrl]);

  const decodeEntities = (html) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  return (
    <div style={{ marginTop:"3rem",fontFamily: 'Arial, sans-serif', width:"80%",marginLeft:"auto", marginRight:"auto", padding: "20px",
    borderRadius: "8px", // Rounded corners for a softer look
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }}>
      <center style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>Problem</center>
      <div style={{ fontSize: '18px', lineHeight: '1.5', color: '#fff' }} dangerouslySetInnerHTML={{ __html: decodeEntities(problemStatement) }} />
    </div>

  );
}

export default Problem;
