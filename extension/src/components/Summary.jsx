import React from 'react';
import PropTypes from 'prop-types'
import { Button, Typography } from '@ellucian/react-design-system/core';

const Summary = ({department}) => {
    const {acf, description} = department;
    const URL = acf.websiteHomepage
    return (
        <>
            <Typography variant="h4" color='white' >{description}</Typography>
            {URL && <Button href={URL} style={{ marginTop:20 }}>Visit Site</Button>}
        </>
    )
}

Summary.propTypes = {
    department: PropTypes.object.isRequired
};

export default Summary;