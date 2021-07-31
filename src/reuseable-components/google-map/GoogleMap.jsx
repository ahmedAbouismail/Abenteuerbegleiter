import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';


const GoogleMap = ({ children, ...props }) => (
  // <Wrapper>
    <GoogleMapReact 
      style={{ height: '100%', width: '100%', zIndex:"-1"}}
      bootstrapURLKeys={{
        key:process.env.REACT_APP_MAP_KEYs,
      }}
      {...props}
    >
      {children}
    </GoogleMapReact>
  // </Wrapper>
);

GoogleMap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

GoogleMap.defaultProps = {
  children: null,
};

export default GoogleMap;
