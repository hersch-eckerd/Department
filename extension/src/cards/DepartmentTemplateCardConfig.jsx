import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Checkbox, TextField, Typography,  Grid, Radio, RadioGroup, TextLink, FormControlLabel } from '@ellucian/react-design-system/core';
import Directory from '../components/Directory.jsx';
import ResourceList from '../components/ResourceList.jsx';
import Features from '../components/Config/Features.jsx';
import Image from '../components/Config/Image.jsx';
import axios from 'axios';
const styles = () => ({
    input: {
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20
    }
});
const DepartmentTemplateCardConfig = ({cardControl:{setCustomConfiguration}, cardInfo: {configuration: {customConfiguration}}, classes}) => {
    const [config, setConfig] = useState(customConfiguration ? customConfiguration : {
        client: {
            features: {
                blog: false,
                directory: false,
                forms: false,
                image: false,
                contact: false
            },
            department: '',
            category: {},
            resourceTags: [],
            sumText: '',
            buildText: '',
            blogEmail: '',
            contactEmail: '',
            smURL: '',
            lambdaURL: '',
            imageInfo: {},
            formList: [],
            startTime: '',
            endTime: '',
            contactPhone: ''
        },
        server: {
            dirCode: '',
            apiKey: ''
        }
    })
    const { department} = config.client;
    const [departments, setDepartments] = useState([])
    const [resources, setResources] = useState([])
    const [categories, setCategories] = useState([])
    axios.defaults.baseURL = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    axios.defaults.params = {
        'order': 'asc',
        'per_page': 100
    }
    useEffect( () => {
        axios.all([axios.get('/department'), axios.get('/categories')])
        .then( ([departments, categories]) => {
            setDepartments(departments.data)
            setCategories(categories.data)
            return axios.get('/resources', {params:{'department': department.id, 'orderby': 'title'}})})
        .then((response) => setResources(response.data))
    }, [department])

    useEffect(() => {setCustomConfiguration({ ...config, customConfiguration: config})}, [config])

    const handleCheckbox = (id) => {
        const blogIds = config.client.category ?? [0];
        const newCategories = blogIds.includes(id) ? blogIds.filter(item => item !== id) : [...blogIds, id];
        setConfig({ ...config,
             'client': {
                 ...config.client,
                  'category': newCategories}}
    )}

    const handleChange = (tabLabel, e, type) => {
        const value = JSON.parse(e.target.value);
        const prevConfig = type === "client" ? config.client : config.server;
        setConfig({ ...config, [type]: { ...prevConfig, [tabLabel]: value}})
    }
    return (
        <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
                <Typography variant='h3'>Features</Typography>
                <Typography>Select the features you would like to display on the department card</Typography>
                <Features
                    config={config}
                    setConfig={setConfig}
                    classes={classes} />
                {departments.length > 0 && <>
                    <Typography variant='h3'>Department</Typography>
                    <Typography>Select the department you would like to display</Typography>
                    <RadioGroup
                        id={`DepartmentsChoice`}
                        name={`DepartmentsChoice`}
                        value={JSON.stringify(department)}
                        onChange={(e) => handleChange("department", e, "client")}
                        required
                        row
                        >
                        {departments.map((department) => (
                            <FormControlLabel
                                control={ <Radio/> }
                                label={department.name}
                                key={department.name}
                                value={JSON.stringify(department)}/>
                        ))}
                    </RadioGroup>
                </>}
                {config.client.features.blog && categories.length > 0 &&
                <>
                    <Typography variant='h3'>Blog Categories</Typography>
                    <Typography>Select the Blog Categories you would like to display</Typography>
                        {categories.map((wpcategory) => {
                            const checked = config.client.category ? config.client.category.includes(wpcategory.id) : false;
                            return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(e) => handleCheckbox(wpcategory.id)}
                                        value={wpcategory.name}
                                        /> }
                                label={wpcategory.name}
                                key={wpcategory.name}
                                value={JSON.stringify(wpcategory.id)}/>
                        )})}
                </>}
                {resources.length > 0 &&
                    <ResourceList
                        resources={resources}
                        classes={classes}
                        fontColor={'black'} />}
        </Grid>
    );
};
DepartmentTemplateCardConfig.propTypes = {
    cardControl: PropTypes.object,
    cardInfo: PropTypes.object,
    classes: PropTypes.object
};
export default withStyles(styles)(DepartmentTemplateCardConfig);