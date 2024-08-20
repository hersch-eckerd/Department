import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Typography,  Grid } from '@ellucian/react-design-system/core';
import {Features, DeptConfig, BlogConfig} from './index.js';
import axios from 'axios';
axios.defaults.baseURL = process.env.WORDPRESS_URL + `wp-json/wp/v2`;
axios.defaults.params = {
    'order': 'asc',
    'per_page': 100
}

const TemplateConfig = ({cardControl:{setCustomConfiguration}, cardInfo: {configuration: {customConfiguration}}, classes}) => {
    const [config, setConfig] = useState(customConfiguration ? customConfiguration : {
        client: {
            features: {
                blog: false,
                summary: false,
                resources: false,
                contact: false
            },
            department: '',
            category: []
        }
    })
    useEffect(() => {setCustomConfiguration({customConfiguration: config})}, [config])
    return  <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
                <Typography variant='h3'>Features</Typography>
                <Typography>Select the features you would like to display on the department card</Typography>
                <Features config={config} setConfig={setConfig} />
                <DeptConfig  department={config.client.department} setConfig={setConfig} />
                <BlogConfig setConfig={setConfig} config={config} />
            </Grid>
};
TemplateConfig.propTypes = {
    cardControl: PropTypes.object,
    cardInfo: PropTypes.object,
    classes: PropTypes.object
};

export default (TemplateConfig);