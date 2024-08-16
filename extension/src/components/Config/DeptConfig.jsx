import React from 'react'
import { Radio, RadioGroup, FormControlLabel, Typography } from '@ellucian/react-design-system/core'
import PropTypes from 'prop-types';

const DeptConfig = ({handleChange, deptList, department}) =>
    <>
        <Typography variant='h3'>Department</Typography>
        <Typography>Select the department you would like to display</Typography>
        <RadioGroup
            id="DepartmentsChoice"
            name="DepartmentsChoice"
            value={department.id || ''}
            onChange={handleChange}
            required
            row
        >
            {deptList.map((dept) => (
                <FormControlLabel
                    control={<Radio />}
                    label={dept.name}
                    key={dept.id}
                    value={dept.id}
                />
            ))}
        </RadioGroup>
    </>

DeptConfig.propTypes = {
    deptList: PropTypes.array,
    handleChange: PropTypes.func,
    department: PropTypes.object
};

export default DeptConfig;