import React from 'react';

import "./_button.styles.scss"

const Button = ({desc, backcolor, color, ...otherProps}) => {
    return (
        <button 
            className="button" 
            style={{backgroundColor: backcolor, color: color}} 
            {...otherProps}
        >
            {desc}
        </button>
    );
};

export default Button;