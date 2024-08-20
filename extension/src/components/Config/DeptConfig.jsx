import React, {useEffect, useState} from 'react'
import { Radio, RadioGroup, FormControlLabel, Typography } from '@ellucian/react-design-system/core'
import PropTypes from 'prop-types';
import axios from 'axios';

const DeptConfig = ({ department, setConfig}) => {
    const [deptList, setDeptList] = useState([])
    useEffect(() => {
        axios(`/department`)
        .then( (response) => { setDeptList(response.data)})
    }, [])

    const handleChange = (e) => {
        const selectedDepartment = deptList.find(dept => dept.id == e.target.value);
        setConfig(prevConfig => ({
            ...prevConfig,
            client: {
                ...prevConfig.client,
                department: selectedDepartment || ''
            }
        }));
    };

    return  <>
                <Typography variant='h3'>Department</Typography>
                <Typography>Select the department you would like to display</Typography>
                <RadioGroup
                    id="DepartmentsChoice"
                    name="DepartmentsChoice"
                    value={department?.id || ''}
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
}
DeptConfig.propTypes = {
    department: PropTypes.object,
    setConfig: PropTypes.func
};

export default DeptConfig;