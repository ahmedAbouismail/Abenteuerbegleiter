import React from 'react';

import "./_form-input.styles.scss";

const FormInput = ({ handleChange, label, ...otherProps}) => {
    return (
        <div className="form-auth">
            <input 
                className="form-input" 
                onChange={handleChange} {...otherProps} 
                autoComplete="true"
                style={{backgroundColor: otherProps.backcolor}}
            />
            {
                label && (
                    <label className={`${otherProps.value.length && "shrink"} form-label`}>
                        {label}
                    </label>
                )
            }
        </div>
    );
};

export default FormInput;