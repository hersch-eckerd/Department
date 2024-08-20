import axios from 'axios';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography, List } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import BlogPost from './BlogPost';
const styles = () => ({
    blogPost: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});
// gets posts from wordpress based on category ids from config

const BlogList = ({category}) => {
    console.log(category)
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        axios(`/posts?category=`+ category?.join(','))
        .then(response => {setPosts(response.data)})
        .catch(() => {setPosts([])});
    }, [category]);
    return !posts.length
    ? <Typography variant="h3">No posts found</Typography>
    : <List>
            {posts.map(post => <BlogPost key={post.id} post={post} />)}
        </List>
}
BlogList.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired
};
export default withStyles(styles)(BlogList)