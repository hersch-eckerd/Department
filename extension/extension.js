module.exports = {
    "name": "Organization",
    "publisher": "EckerdCollege",
    "cards": [{
        "type": "OrganizationTemplate",
        "source": "./src/cards/DepartmentTemplateCard",
        "title": "Organization Template",
        "displayCardType": "Organization",
        "description": "Describes the card's function to the back end user",
        "template": {
            "icon": "institution",
            "title": "Organization",
            "description": "Provides the ability to create custom Organization cards"
        },
        "customConfiguration": {
            "source": "./src/components/Config/TemplateConfig.jsx"
        }
    }, 
    {
        "type": "Resources",
        "source": "./src/cards/ResourcesCard",
        "title": "Resources",
        "displayCardType": "Organization",
        "description": "Shows all resources available to the user",
        "pageRoute": {
            "route": "/",
            "excludeClickSelectors": ['#Resources']
        }
    }],
    "page": {
        "source": "./src/page/router.jsx"
    }
}