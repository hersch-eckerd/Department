import React, { useState } from 'react';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import {Typography, List, ListItem } from '@ellucian/react-design-system/core';
import { useUserInfo } from '@ellucian/experience-extension-utils';
import PropTypes from 'prop-types';
import Form from './Form';

const styles = () => ({
    forms: {
        marginTop: spacing40,
        marginBottom: spacing40
    },
    form: {
        height: 40,
        margin: 10
    },
    input: {
        display: 'block',
        height: '100%'
    }
});

const FormView = ({formList, classes}) => {
    // get logged in users roles
    const {roles} = useUserInfo();

    // set up hover for description
    const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})

    // filter forms based on roles
    const filteredForms = formList.filter(form => {
        for (const role in form.roles) {
            if (form.roles[role] === true || roles.includes(role)) {
                return true
            }
        }
        return false
    })

    // sort forms alphabetically
    filteredForms.sort((a, b) => a.label.localeCompare(b.label));

    // display forms if any are found
    if (!filteredForms || !Array.isArray(filteredForms) || filteredForms.length === 0) {
    return (
        <Typography color="textSecondary">
            No forms found.
        </Typography>
    )}
    else {
        return (
        <List className={classes.forms}>
        {filteredForms.map( (form, index) => (
            <ListItem id="Form" button component="a" className={classes.form} href={form.url} key={index} divider>
                <Form
                  form={form}
                  key={index}
                  popper={popper}
                  setPopper={setPopper} />
            </ListItem>
        ))}
        </List> )
    }
}
FormView.propTypes = {
    classes: PropTypes.object.isRequired,
    formList: PropTypes.array.isRequired
};

export default withStyles(styles)(FormView);