import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { TextField, Typography,  Grid, Radio, RadioGroup, TextLink, FormControlLabel } from '@ellucian/react-design-system/core';
import Directory from '../components/Directory.jsx';
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
const DepartmentTemplateCardConfig = ({cardControl:{setCustomConfiguration, setIsCustomConfigurationValid}, cardInfo: {configuration: {customConfiguration}}, classes}) => {
    const [config, setConfig] = useState(customConfiguration ? customConfiguration : {
        client: {
            features: {
                showMore: false,
                blog: false,
                directory: false,
                forms: false,
                image: false,
                contact: false
            },
            department: '',
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
    const { department, category, lambdaURL} = config.client;
    const { directory, image } = config.client.features;
    const { apiKey, dirCode } = config.server;
    const [departments, setDepartments] = useState([])
    const [resources, setResources] = useState([])
    const [categories, setCategories] = useState([])
    const url = process.env.WORDPRESS_URL + `/wp-json/wp/v2`;
    useEffect(() => {
        axios.get(url + `/department?per_page=100`)
        .then(response => {setDepartments(response.data)})
    }, [])
    useEffect(() => {
        setCustomConfiguration({
            ...config,
            customConfiguration: config
        })
    }, [config])
    useEffect(() => {
        axios.get(url + `/categories?per_page=100`)
        .then(response => {setCategories(response.data)})
    }, [])
    useEffect(() => {
        if (department?.id) {
            const departmentId = Number(department.id)
            axios.get(url + `/resources?&per_page=100&orderby=title&order=asc&department=${departmentId}`)
            .then(response => {setResources(response.data)})
        }
    }, [department])

    const handleChange = (tabLabel, e, type) => {
        const value = JSON.parse(e.target.value);
        const configType = type === "client" ? config.client : config.server;
        setConfig({
            ...config,
            [type]: {
                ...configType,
                [tabLabel]: value
            }
        })
    }
    const handleBlur = e => {
        setIsCustomConfigurationValid(e.target.value !== '');
    }

    return (
        <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
            <Grid direction="column" justifyContent="space-evenly" alignItems="flex-start" >
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
                        {departments.map((department, index) => (
                            <FormControlLabel
                                control={ <Radio/> }
                                label={department.name}
                                key={index}
                                value={JSON.stringify(department)}/>
                        ))}
                    </RadioGroup>
                </>}
                {categories.length > 0 && <>
                    <Typography variant='h3'>Blog Categories</Typography>
                    <Typography>Select the Blog Categories you would like to display</Typography>
                    <RadioGroup
                        id={`BlogCategories`}
                        name={`BlogCategories`}
                        value={JSON.stringify(categories)}
                        onChange={(e) => handleChange("category", e, "client")}
                        row
                        >
                        {categories.map((category, index) => (
                            <FormControlLabel
                                control={ <Radio/> }
                                label={category.name}
                                key={index}
                                value={JSON.stringify(category)}/>
                        ))}
                    </RadioGroup>
                </>}
                {resources.length > 0 && <>
                    <Typography variant='h3'>Resources</Typography>
                    {resources.map((resource) => (
                        <Typography key={resource.id}>
                            <TextLink href={resource.acf.resource_url}>
                                {resource.title.rendered}
                            </TextLink>
                        </Typography>
                    ))}
                </>}
                {directory == true && <>
                    <Typography variant='h3'>Directory</Typography>
                    <Typography>Display a directory of the people in your organization. Enter the Lambda function URL, the Banner from crosswalk-validation, and the API token from Ethos Integration</Typography>
                    <TextField
                        label= "AWS Lambda URL"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("lambdaURL", e, "client")}
                        placeholder="localhost:3000"
                        value={lambdaURL}
                    />
                    <TextField
                        label= "Banner Code from crosswalk-rules to sync groups with"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("dirCode", e, "server")}
                        placeholder="HR-FULL-TIME"
                        value={dirCode}
                    />
                    <TextField
                        label= "API Key to get token for directory"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("apiKey", e, "server")}
                        placeholder="21345"
                        value={apiKey}
                    />
                </>}
                {image == true && <Image setConfig={setConfig} config={config} />}
                {directory == true && <Directory config={config} />}
            </Grid>
        </Grid>
    );
};
DepartmentTemplateCardConfig.propTypes = {
    cardControl: PropTypes.object,
    cardInfo: PropTypes.object,
    classes: PropTypes.object
};
export default withStyles(styles)(DepartmentTemplateCardConfig);