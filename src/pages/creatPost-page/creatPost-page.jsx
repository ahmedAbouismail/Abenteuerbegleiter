import React, { useState } from 'react'
import './_creatPost-page.scss'

import Autocomplete from '../../reuseable-components/AutoCompelete/AutoCompelete'
import CreatePost from '../../reuseable-components/postForm/postForm'


const pin= {
    lat: null,
    lng: null,
}

const PostPage = ({id})=>{


    return(
        
      
            <div>
                {console.log("props", id.match.params.id)}
                <CreatePost id = {id}/>
            </div>
           
    );
}

export default PostPage;