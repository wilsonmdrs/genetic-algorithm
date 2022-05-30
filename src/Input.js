import React from "react";

const Input = ({ label, value, onChange }) => {
    return (
      <div className="app__form-content">
        <p>{label}</p>
        <input type="text" value={value}
          onChange={onChange}
        />
      </div>
    )
  }

  export default Input