import React from 'react';
import { Checkbox, FormControlLabel } from '@ellucian/react-design-system/core';
import PropTypes from 'prop-types';

const BlogCategory = ({config, setConfig, wpcategory}) => {
    const checked = config.client.category ? config.client.category.includes(wpcategory.id) : false;
    const handleCheckbox = (id) => {
        const blogIds = config.client.category ?? [0];
        const newCategories = blogIds.includes(id) ? blogIds.filter(item => item !== id) : [...blogIds, id];
        setConfig({ ...config,
            'client': {
                ...config.client,
                'category': newCategories
        }})
    }

    return  <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={() => handleCheckbox(wpcategory.id)}
                        value={wpcategory.name}
                        /> }
                label={wpcategory.name}
                key={wpcategory.name}
                value={JSON.stringify(wpcategory.id)}
            />
}

BlogCategory.propTypes = {
    config: PropTypes.object,
    setConfig: PropTypes.func,
    wpcategory: PropTypes.object
};

export default BlogCategory;