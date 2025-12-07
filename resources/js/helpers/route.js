import { Ziggy } from '../../vendor/tightenco/ziggy';

export default function route(name, params, absolute) {
    const routes = Ziggy?.routes || {};
    const route = routes[name];
    
    if (!route) {
        console.warn(`Route "${name}" not found`);
        return '#';
    }
    
    let url = route.uri;
    
    // Replace route parameters
    if (params) {
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
            url = url.replace(`{${key}?}`, params[key]);
        });
    }
    
    // Remove any remaining optional parameters
    url = url.replace(/\{[^}]+\?}/g, '');
    
    const baseUrl = absolute ? Ziggy?.url || '' : '';
    return baseUrl + url;
}

