import axios from 'axios';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography, List, ListItem, TextLink } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
const styles = () => ({
    blogPost: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});
// gets posts from wordpress based on category ids from config

const Blog = ({classes, category}) => {
    const [posts, setPosts] = useState([]);
    // get url for wordpress blog site from .env file
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2/posts?categories=`+ category.join(',');
    useEffect(() => {
        axios(url)
        .then(response => {setPosts(response.data)})
        .catch(() => {setPosts([])});
    }, [category]);
    return !posts.length ? <Typography variant="h3">No posts found</Typography>
    : <List>
            {posts.map(post => (
                <ListItem className={classes.blogPost} key={post.id} divider>
                    <Typography variant="h3">
                        <TextLink href={post.link}>
                            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                        </TextLink>
                    </Typography>
                    <Typography variant="v4">{moment(post.date).format("Do MMM YYYY h:mm a")}</Typography>
                </ListItem> ))}
        </List>
}
Blog.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired
};
export default withStyles(styles)(Blog)