import axios from 'axios';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { Typography, List, ListItem, TextLink } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
const styles = () => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40
    },
    blogPost: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});
// gets posts from wordpress based on user email

const Blog = ({classes, category}) => {
    const [posts, setPosts] = useState([]);
    console.log(category)
    // get url for wordpress blog site from .env file
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2/posts?categories=`;
    useEffect(() => {
        axios.get(url + category.id)
        .then(response => {
            console.log(response.data)
            setPosts(response.data);
        })
        .catch(error => {
            console.log(error);
            setPosts([]);
        });
    }, [category]);

    return (
        <List>
        {posts.map(post => (
            <ListItem className={classes.blogPost} key={post.id} divider>
                <Typography variant="h3">
                    <TextLink href={post.link}>
                        <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    </TextLink>
                </Typography>
                <Typography variant="v4">{moment(post.date).format("Do MMM YYYY h:mm a")}</Typography>
                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </ListItem>
        ))}
        </List>
    )
}
Blog.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired
};
export default withStyles(styles)(Blog)