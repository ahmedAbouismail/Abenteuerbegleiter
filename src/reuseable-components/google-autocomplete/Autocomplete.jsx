import React, { Component } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import {MDCTextField} from '@material/textfield';
// import  "./_google-autocomplete.scss";

const Wrapper = styled.div`
  position: relative;
  padding: 20px 0px
`;
// const Wrapper = styled.div`
//   position: relative;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   padding: 20px;
// `;

const divStyle = {
  border: "1px solid #000",
  fontSize: "18px",
  padding: "15px 0",
  background: "transparent",
  borderRadius: "3px",
  width: "100%",
};
class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    
  }

  
  componentDidMount({ map, mapApi } = this.props) {
    const options = {
      // restrict your search to a specific type of result
      // types: ['geocode', 'address', 'establishment', '(regions)', '(cities)'],
      // restrict your search to a specific country, or an array of countries
      // componentRestrictions: { country: ['gb', 'us'] },
    };
    this.autoComplete = new mapApi.places.Autocomplete(
      this.searchInput,
      options,
    );
    this.autoComplete.addListener('place_changed', this.onPlaceChanged);
    this.autoComplete.bindTo('bounds', map);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlaceChanged = ({ map, addplace } = this.props) => {
    const place = this.autoComplete.getPlace();
    console.log("Print plaqce", place);
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addplace(place);
    this.searchInput.blur();
  };

  clearSearchBox() {
    this.searchInput.value = '';
  }

  render() {
    
    return (
 
      <Wrapper>
          <input
          ref={(ref) => {
            this.searchInput = ref;
          }}
          class="mdc-text-field__input" aria-labelledby="my-label"
          type="text"
          onFocus={this.clearSearchBox}
          placeholder="Enter a location"
          style={divStyle}
        />
       </Wrapper>
    );
  }
}

export default AutoComplete;
