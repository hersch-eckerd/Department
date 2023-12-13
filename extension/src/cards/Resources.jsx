import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Button, Grid, TextField } from '@ellucian/react-design-system/core';
import { useUserInfo } from '@ellucian/experience-extension-utils';
import ResourceList from '../components/ResourceList';
import axios from 'axios';

const styles = () => ({
    card: {
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
    },
    cardBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
        // backgroundAttachment: 'fixed'
        },
    cardContent: {
        position: 'relative',
        zIndex: 2,
        height: '100%',
        padding: 20,
        overflow: 'auto'
    },
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20
    },
    search: {
        margin: 0,
        width: '100%'
    }
})
const resourceCard = (props) => {
    const {roles} = useUserInfo();
    const { classes, cardControl: { navigateToPage } } = props;
    const [resources, setResources] = useState();
    const [search, setSearch] = useState('')
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    const params = {
        'user-group': [],
        'orderby': 'title',
        'order': 'asc',
        'per_page': 100,
        '_fields': 'id,acf,title.rendered'
    };
    const compareGroups = (groups) => {
        const ids = []
        groups.forEach(item => {if (roles.includes(item.name)) {ids.push(item.id)} });
        params['user-group'] = ids
    }
    useEffect(() => {
        axios.get(url + '/user-group')
        .then(response => {compareGroups(response.data)})
        .then(async () => {
            // if search bar isn't empty
            if (search.length > 0 && search !== '') {
                setResources(await axios.get(url + `/resources?search=${search}`, {params:params}))
            } else {
                // otherwise, get all resources based on parameters
                const resources = []
                await axios.get(url + `/resources`, {params:params})
                .then(async response => {
                    resources.push(...response.data)
                    // if there are 100 resources, get the next page
                    if (resources.length == 100) {
                        await axios.get(url +'/resources', {params: {...params, page: 2}})
                        .then(response => {
                            resources.push(...response.data)
                        })
                    }
                setResources(resources)
            })}
        })
    }, [search])

    return (
        <div id="Resources" className={classes.wrapper}>
            <Grid direction="baseline" container className={classes.search} justifyContent="space-between" alignItems="center" >
                <TextField
                    style={{width: '60%' }}
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