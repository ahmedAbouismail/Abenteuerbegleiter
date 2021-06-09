import React, { useState } from 'react'
import './_post-page.scss'

import Autocomplete from '../../exampels/AutoCompelete'



const pin= {
    lat: null,
    lng: null,
}

const PostPage = ()=>{
    const [mark, setMark] = useState([]);

    const handelMark = (latLngPoint)=>{
        console.log("Top", latLngPoint);
        setMark({...mark, 'lat': latLngPoint.lat, 'lng': latLngPoint.lng})
        console.log("in POst Page ", mark);
    }

    return(
        
        //   <div className="location-input-container">
        //         <LocationSearchInput handelMark = {handelMark}/>
        //     </div> 
            <div className="exm">
                <Autocomplete/>
            </div>
           
    );
}

export default PostPage;