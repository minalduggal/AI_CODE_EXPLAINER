import React, { useState } from 'react';

export default function App() {
  const [code, setCode] = useState(`function add(a, b) {
  return a + b;
}`);
  const [language, setLanguage] = useState('JavaScript');
  const [mode, setMode] = useState('detailed');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  async function handleExplain() {
    setLoading(true);
    setExplanation('');
    try {
      const res = await fetch('https://ai-code-1-57le.onrender.com/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, mode })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'API error');
      }
      setExplanation(data.explanation || 'No explanation returned.');
    } catch (err) {
      setExplanation('Error: ' + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="container">
      <header className="header">
        <h1>AI Code Explainer </h1>
    
      </header>

      <div className="controls">
        <label>
          Language:&nbsp;
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
            <option>Go</option>
          </select>
        </label>

       

        <button onClick={handleExplain} disabled={loading}>
          {loading ? 'Explaining...' : 'Explain code'}
        </button>

        
 </div>
      <textarea
        className="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />

      <h3>Explanation</h3>
      <div className="output">{loading ? 'Waiting for explanation...' : explanation || 'No explanation yet.'}</div>
     
      <footer style={{ marginTop: 20, color: '#666', fontSize: 13 }}>
        Tip: For large files, consider splitting into function-level chunks before sending.
      </footer>
    </div>
  );
}
