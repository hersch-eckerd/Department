import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';

const BlogConfig = ({config, handleCheckbox, categories}) =>
    <>
        <Typography variant='h3'>Blog Categories</Typography>
        <Typography>Select the Blog Categories you would like to display</Typography>
            {categories.map((wpcategory) => {
                const checked = config.client.category ? config.client.category.includes(wpcategory.id) : false;
                return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={() => handleCheckbox(wpcategory.id)}
                            value={wpcategory.name}
                            /> }
                    label={wpcategory.name}
                    key={wpcategory.name}
                    value={JSON.stringify(wpcategory.id)}/>
            )})}
    </>

BlogConfig.propTypes = {
    categories: PropTypes.array,
    config: PropTypes.object,
    handleCheckbox: PropTypes.func
};

export default BlogConfig;