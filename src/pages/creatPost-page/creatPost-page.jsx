import React from 'react'
import './_creatPost-page.scss'

import CreatePost from '../../reuseable-components/postForm/postForm'

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