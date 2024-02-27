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
    const features = ['Summary', 'Resources', 'Contact', 'Blog']
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
    return <FormControl component="fieldset" className={classes.features}>
                <FormGroup row={true}>
                    {features.map(feature => (
                        <FormControlLabel
                            key= {feature}
                            control={
                                <Switch
                                    id={feature}
                                    checked={config.client.features[feature]}
                                    onChange={(e) => handleFeature(e.target.checked)}
                                    value={feature}
                                />
                            }
                            label={feature}
                        />
                    ))}
                </FormGroup>
            </FormControl>
};

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    setConfig: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
};

export default withStyles(styles)(Features);