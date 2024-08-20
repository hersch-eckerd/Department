import React from 'react'
import { ListItem, Typography } from '@ellucian/react-design-system/core'
import ResourceDesc from './ResourceDesc'
import PropTypes from 'prop-types'
import { withStyles } from '@ellucian/react-design-system/core/styles'

const styles = () => ({
    resourceItem: {
        '&:hover': {
            backgroundColor: '#b2b3b7'
        },
        padding: '5px'
    }
})
const Resource = ({ resource, classes, fontColor, index, popper, setPopper }) => {
    return  <ListItem button component="a" className={classes.resourceItem} href={resource.acf.resource_url} key={resource.title.rendered} divider>
                <Typography style={{'color': fontColor}} >
                    {resource.title.rendered}
                </Typography>
                {resource.acf.resource_description &&
                <ResourceDesc
                    index={index}
                    description={resource.acf.resource_description}
                    popper={popper}
                    setPopper={setPopper} /> }
            </ListItem>
}

Resource.propTypes = {
    classes: PropTypes.object,
    resource: PropTypes.array,
    fontColor: PropTypes.string,
    index: PropTypes.number,
    popper: PropTypes.object,
    setPopper: PropTypes.func
}

export default withStyles(styles)(Resource)