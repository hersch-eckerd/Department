import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { TextField, Typography, TimePicker, Grid } from '@ellucian/react-design-system/core';
import Directory from '../components/Directory.jsx';
import Forms from '../components/Config/Forms.jsx';
import Features from '../components/Config/Features.jsx';
import Image from '../components/Config/Image.jsx';
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
    const { sumText, blogEmail, smURL, lambdaURL, startTime, endTime, contactEmail, contactPhone, buildText} = config.client;
    const { showMore, blog, directory, forms, image, contact } = config.client.features;
    const { apiKey, dirCode } = config.server;

    useEffect(() => {
        setCustomConfiguration({
            ...config,
            customConfiguration: config
        })
    }, [config])

    const handleChange = (tabLabel, e, type) => {
        const configType = type === "client" ? config.client : config.server;
        setConfig({
            ...config,
            [type]: {
                ...configType,
                [tabLabel]: e.target.value
            }
        })
    }
    const handleTime = (name, value) => {
        setConfig({
            ...config,
            client: {
                ...config.client,
                [name]: value
            }
        })
    }
    const handleBlur = e => {
        setIsCustomConfigurationValid(e.target.value !== '');
    }

    return (
        <Grid className={classes.card} direction="column" justifyContent="space-between" alignItems="flex-start">
            <Features setConfig={setConfig} config={config} />
            <Grid direction="column" justifyContent="space-evenly" alignItems="flex-start" >
                <Typography variant='h3'>Summary</Typography>
                <Typography>Give a short summary of the organization</Typography>
                <TextField
                    label="Summary"
                    className={classes.input}
                    multiline
                    maxCharacters={{
                        max: 200,
                        allowOverflow: false
                    }}
                    style={{width: '1000px'}}
                    required
                    onBlur={handleBlur}
                    onChange={(e) => handleChange("sumText", e, "client")}
                    value={sumText}
                />
                {contact == true && <>
                    <Typography variant='h3'>Contact Info</Typography>
                    <Typography>Provide contact information for your organization</Typography>
                    <TextField
                        label="Email"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("contactEmail", e, "client")}
                        value={contactEmail}
                    />
                    <TextField
                        label="Phone Number"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("contactPhone", e, "client")}
                        value={contactPhone}
                    />
                    <TextField
                        label="Building"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("buildText", e, "client")}
                        value={buildText}
                    />
                    <TimePicker
                        className={classes.input}
                        label="Start Time"
                        onChange={(e) => handleTime("startTime", e)}
                        helperText="From when is your office available?"
                        value={startTime}
                    />
                    <TimePicker
                        className={classes.input}
                        label="End Time"
                        onChange={(e) => handleTime("endTime", e)}
                        helperText="Until when is your office available?"
                        value={endTime}
                    />
                </>}
                {showMore == true && <>
                    <Typography variant='h3'>Home Website Link</Typography>
                    <Typography>Add a link to display beneath the summary of your organization</Typography>
                    <TextField
                        label= "Home Website Link"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("smURL", e, "client")}
                        placeholder="https://www.eckerd.edu"
                        value={smURL}
                    />
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
                {blog == true && <>
                    <Typography variant='h3'>Blog</Typography>
                    <Typography>Enter the email of the user from myEckerd that you would like to display blog posts from</Typography>
                    <TextField
                        label= "Email to pull blog posts from"
                        className={classes.input}
                        onBlur={handleBlur}
                        onChange={(e) => handleChange("blogEmail", e, "client")}
                        placeholder="test@eckerd.edu"
                        value={blogEmail}
                    />
                </>}
                {forms == true && <Forms setConfig={setConfig} config={config} />}
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