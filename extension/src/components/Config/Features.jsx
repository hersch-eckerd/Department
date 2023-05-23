import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { FormControl, FormControlLabel, FormGroup, FormLabel, Switch } from '@ellucian/react-design-system/core';

const styles = () => ({
    features: {
        marginTop: 20,
        marginBottom: 20
    }
});

const Features = ({ classes, setConfig, config }) => {
    const { contact, showMore, blog, directory, forms, image  } = config.client.features;
    const handleFeature = name => event => {
        setConfig({
            ...config,
            client: {
                ...config.client,
                features: {
                    ...config.client.features,
                    [name]: event.target.checked
                }
            }
        })
    }
    return (
    <FormControl component="fieldset" className={classes.features}>
        <FormLabel component="legend">
            Card Features
        </FormLabel>
        <FormGroup row={true}>
            <FormControlLabel
                control={
                    <Switch
                        id={`contact`}
                        checked={contact}
                        onChange={handleFeature("contact")}
                        value={contact}
                    />
                }
                label="Contact Info"
            />
            <FormControlLabel
                control={
                    <Switch
                        id={`showMore`}
                        checked={showMore}
                        onChange={handleFeature("showMore")}
                        value={showMore}
                    />
                }
                label="See More Link"
            />
            <FormControlLabel
                control={
                    <Switch
                        id={`blog`}
                        checked={blog}
                        onChange={handleFeature("blog")}
                        value={blog}
                    />
                }
                label="Blog"
            />
            <FormControlLabel
                control={
                    <Switch
                        id={`forms`}
                        checked={forms}
                        onChange={handleFeature("forms")}
                        value={forms}
                    />
                }
                label="Forms"
            />
            <FormControlLabel
                control={
                    <Switch
                        id={`image`}
                        checked={image}
                        onChange={handleFeature("image")}
                        value={image}
                    />
                }
                label="Image"
            />
            <FormControlLabel
                control={
                    <Switch
                        id={`directory`}
                        checked={directory}
                        onChange={handleFeature("directory")}
                        value={directory}
                    />
                }
                label="Directory"
            />
        </FormGroup>
    </FormControl>)
};

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    setConfig: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
};

export default withStyles(styles)(Features);