import React from 'react';

import "./_button.styles.scss"

const Button = ({desc, backcolor, color, fontSize, ...otherProps}) => {

    const btnStyles = {
        backgroundColor: backcolor,
        color: color,
        fontSize: fontSize
    }

    return (
        <button 
            className="button" 
            style={btnStyles} 
            {...otherProps}
        >
            {desc}
        </button>
    );
};

export default Button;