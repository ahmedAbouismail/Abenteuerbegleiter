import React, { useState } from 'react'
import './_creatPost-page.scss'

import Autocomplete from '../../reuseable-components/AutoCompelete/AutoCompelete'
import CreatePost from '../../reuseable-components/postForm/postForm'


const pin= {
    lat: null,
    lng: null,
}

const PostPage = ()=>{


    return(
        
      
            <div 
            className="exm"
            >
                {/* <Autocomplete/> */}
                <CreatePost/>
            </div>
           
    );
}

export default PostPage;