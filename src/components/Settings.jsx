// Settings.js
import React from 'react';

export default function Settings() {
  return (
    <div className="settings-panel">
      <h3>הגדרות עיצוב</h3>
      <div className="setting-option">
        <label>בחר צבע רקע:</label>
        <input type="color" onChange={(e) => document.body.style.backgroundColor = e.target.value} />
      </div>
      <div className="setting-option">
        <label>בחר נושא:</label>
        <select onChange={(e) => document.body.className = e.target.value}>
          <option value="">ברירת מחדל</option>
          <option value="dark-theme">כהה</option>
          <option value="light-theme">בהיר</option>
        </select>
      </div>
    </div>
  );
}
