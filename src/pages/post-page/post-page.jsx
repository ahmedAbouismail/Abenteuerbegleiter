import React, { useState } from 'react'

import Google_Map from  '../../reuseable-components/google-map/google-map.component'
import LocationSearchInput from '../../reuseable-components/google-autocomplete/google-autocomplete.component'
import './_post-page.scss'
const PostPage = ()=>{
    return(
        <div>
            <div>
                <Google_Map/>
            </div>
            
            <div className="location-input-container">
                <LocationSearchInput/>
            </div>
        </div>  
    );
}

export default PostPage;