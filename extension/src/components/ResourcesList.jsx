import React, { useState } from 'react'
import { List } from '@ellucian/react-design-system/core'
import Resource from './Resource'
import PropTypes from 'prop-types'
import { withStyles } from '@ellucian/react-design-system/core/styles'

const styles = () => ({
    resourceList: {
        backgroundColor:'transparent'
    }
})

const ResourcesList = ({ resources, classes, fontColor }) => {
    const [popper, setPopper] = useState({anchorEl: null, open: false, index: null})
    const color = fontColor ?? 'default'
    return  <List className={classes.resourceList} id="ResourceList">
                {resources.map((resource, index) => (
                    <Resource
                        key={resource.title.rendered}
                        resource={resource}
                        index={index}
                        popper={popper}
                        setPopper={setPopper}
                        fontColor={color}
                    />
                ))}
            </List>
}

ResourcesList.propTypes = {
    classes: PropTypes.object,
    resources: PropTypes.array,
    fontColor: PropTypes.string
}

export default withStyles(styles)(ResourcesList)