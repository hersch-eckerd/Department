import React, { useState } from 'react'
import { List, ListItem, Typography } from '@ellucian/react-design-system/core'
import ResourceDesc from './ResourceDesc'
import PropTypes from 'prop-types'
import { withStyles } from '@ellucian/react-design-system/core/styles'

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

const ResourcesList = ({ resources, classes, fontColor }) => {
    const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
    const color = fontColor ?? 'default'
    return  <List className={classes.resourceList} id="ResourceList">
                {resources.map((resource, index) => (
                    <ListItem button component="a" className={classes.resourceItem} href={resource.acf.resource_url} key={resource.title.rendered} divider>
                        <Typography style={{'color':color}} >
                            {resource.title.rendered}
                        </Typography>
                        {resource.acf.resource_description &&
                        <ResourceDesc
                            index={index}
                            description={resource.acf.resource_description}
                            popper={popper}
                            setPopper={setPopper}
                            classes={classes} /> }
                    </ListItem>
                ))}
            </List>
}

ResourcesList.propTypes = {
    classes: PropTypes.object,
    resources: PropTypes.array,
    fontColor: PropTypes.string
}

export default withStyles(styles)(ResourcesList)