import React from 'react'
import './_creatPost-page.scss'

import CreatePost from '../../reuseable-components/postForm/postForm'

// eslint-disable-next-line
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