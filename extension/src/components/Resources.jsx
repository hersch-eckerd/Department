import React from 'react'
import { Typography } from '@ellucian/react-design-system/core'
import PropTypes from 'prop-types'
import ResourcesList from './ResourcesList'

const Resources = ({ resources, fontColor }) => {
    switch (resources) {
        case undefined:
            return <Typography color="textSecondary">Loading...</Typography>
        case 0:
            return <Typography color="textSecondary">No resources found.</Typography>
        default:
            return <ResourcesList resources={resources} fontColor={fontColor} />
    }
}

Resources.propTypes = {
    resources: PropTypes.array,
    fontColor: PropTypes.string
}

export default Resources