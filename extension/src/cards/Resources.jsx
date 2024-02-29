import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Button, Grid, TextField } from '@ellucian/react-design-system/core';
import { useUserInfo } from '@ellucian/experience-extension-utils';
import ResourceList from '../components/ResourceList';
import axios from 'axios';

const styles = () => ({
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20
    },
    search: {
        margin: 0,
        width: '100%',
        paddingBottom: '20px'
    }
})
const resourceCard = ( { classes, cardControl: { navigateToPage }}) => {
    const {roles} = useUserInfo();
    const [resources, setResources] = useState();
    const [search, setSearch] = useState('')
    const url = process.env.WORDPRESS_URL + `wp-json/wp/v2`;

    const fetchResources = async ({groups}) => {
        const params = {
            'user-group': groups,
            'orderby': 'title',
            'order': 'asc',
            'per_page': 100,
            '_fields': 'id,acf,title.rendered',
            ...(search && {search})
        };
        const response = await axios(`${url}/resources`, { params });
        if (response.data.length === 100) {
            const nextResponse = await axios.get(`${url}/resources`, { params: {...params, 'page': 2} });
            response.data = response.data.concat(nextResponse.data);
        }
        setResources(response.data)
    }

    useEffect(() => {
        axios.get(`${url}/user-group`)
        .then(response => response.data.filter(group => roles.includes(group.name)).map(group => group.id))
        .then(groups => fetchResources(groups))
    }, [search, roles])

    return (
        <div id="Resources" className={classes.wrapper}>
            <Grid direction="baseline" container className={classes.search} justifyContent="space-between" alignItems="center" >
                <TextField
                    style={{width: '60%'}}
                    label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <Button style= {{width: '30%' }} onClick={() => navigateToPage({route: '/resources'})} >View All</Button>
            </Grid>
            <ResourceList resources={resources} />
        </div>
    )
};
resourceCard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(resourceCard);