import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Dropdown, DropdownItem } from '@ellucian/react-design-system/core';
import { ChevronRight } from '@ellucian/ds-icons/lib';

const styles = () => ({
    dropDown: {
        marginBottom: 20,
        marginTop: 20
    }
})
const DeptDD = ({ classes, dropdownVal, setDropdownVal }) => {
    const features = ['Summary', 'Resources', 'Contact', 'Blog']
    return  <Dropdown
                label="Department Information"
                onChange={(e) => setDropdownVal(e.target.value)}
                className={classes.dropDown}
                value={dropdownVal} >
                {features.map((item) =>
                    <DropdownItem
                        key={item}
                        id={item}
                        label={item}
                        value={item}
                        RightIconComponent= { <ChevronRight /> }
                    />
                )}
            </Dropdown>
}
DeptDD.propTypes = {
    classes: PropTypes.object.isRequired,
    dropdownVal: PropTypes.string.isRequired,
    setDropdownVal: PropTypes.func.isRequired
}

export default withStyles(styles)(DeptDD);