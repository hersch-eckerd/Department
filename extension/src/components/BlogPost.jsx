import React from 'react';
import moment from 'moment';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Typography, ListItem, TextLink } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';
const styles = () => ({
    blogPost: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
});
// gets posts from wordpress based on category ids from config

const BlogPost = ({classes, post}) =>
    <ListItem className={classes.blogPost} key={post.id} divider>
        <Typography variant="h3">
            <TextLink href={post.link}>
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </TextLink>
        </Typography>
        <Typography variant="v4">{moment(post.date).format("Do MMM YYYY h:mm a")}</Typography>
    </ListItem>

BlogPost.propTypes = {
    classes: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
};
export default withStyles(styles)(BlogPost)