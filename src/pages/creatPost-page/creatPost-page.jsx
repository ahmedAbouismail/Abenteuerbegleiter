import React from 'react'
import './_creatPost-page.scss'
import Grid from '@material-ui/core/Grid';
import CreatePost from '../../reuseable-components/postForm/postForm'
import { Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const PostPage = ({id})=>{


    return(
      
            <Grid
            container
            justify="center"
            alignItems="flex-start"
            direction="column"
            style={{minHeight: "100vh", marginLeft: "1%"}}
            spacing={2}
            >
                
                <Grid 
                item
                >
                    <CreatePost id = {id}/>
                </Grid>
                
            </Grid>
                

           
    );
}

export default PostPage;