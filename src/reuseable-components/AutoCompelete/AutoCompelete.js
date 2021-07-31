import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from '../Marker/Marker';

// examples:
import GoogleMap from '../google-map/GoogleMap';


// consts
import LOS_ANGELES_CENTER from '../../const/la_center';

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
    };
  }

  apiHasLoaded = (map, maps) => {
    this.props.getLoaded(true, map,maps)
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
  };

  addPlace = (place) => {
    this.setState({ places: [place] });
  };

  render() {
    // const {
    //   places, mapApiLoaded, mapInstance, mapApi,
    // } = this.state;
    return (
      <>
      <div>

        <GoogleMap
          defaultZoom={10}
          defaultCenter={LOS_ANGELES_CENTER}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            libraries: ['places', 'geometry'],
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
        >
          {!isEmpty(this.props.location)
            && 
           
              <Marker
                key={this.props.location.id}
                text={this.props.location.name}
                lat={this.props.location.lat}
                lng={this.props.location.lng}
              />
            
            }
        </GoogleMap>

        {/* {mapApiLoaded && (
          <AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
        )} */}

      </div>
      </>
    );
  }
}

export default Autocomplete;
