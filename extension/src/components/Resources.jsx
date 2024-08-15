import React from 'react'
import { Typography } from '@ellucian/react-design-system/core'
import PropTypes from 'prop-types'
import { withStyles } from '@ellucian/react-design-system/core/styles'
import ResourcesList from './ResourcesList'

const styles = () => ({
    icon: {
        marginRight: '20px'
    },
    resourceList: {
        backgroundColor:'transparent'
    },
    resourceItem: {
        '&:hover': {
            backgroundColor: '#b2b3b7'
        },
        padding: '5px'
    }
})

const Resources = ({ resources, classes, fontColor }) => {
    switch (resources) {
        case undefined:
            return <Typography color="textSecondary">Loading...</Typography>
        case 0:
            return <Typography color="textSecondary">No resources found.</Typography>
        default:
            return <ResourcesList resources={resources} classes={classes} fontColor={fontColor} />
    }
}

Resources.propTypes = {
    classes: PropTypes.object,
    resources: PropTypes.array,
    fontColor: PropTypes.string
}

export default withStyles(styles)(Resources)