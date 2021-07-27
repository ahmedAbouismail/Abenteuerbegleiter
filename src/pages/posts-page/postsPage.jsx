import Post from '../../reuseable-components/post/post'
import Grid from '@material-ui/core/Grid';

import React from 'react'

export default function postsPage() {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            style={{width:"100vw", height:"100%"}}
            spacing={2}
            >
            <Grid 
                item>
                <Post/>
            </Grid>
        </Grid>
    )
}
