
export function setSession(key, params) {

    if (typeof params == 'object') {
        var params = Object.assign({}, getSession('searchFresh'), params);
        params = JSON.stringify(params)
    }
    sessionStorage.setItem(key, params);
}
export function getSession(key) {
    if (key == 'searchFresh') {
        var result = JSON.parse(sessionStorage.getItem(key));
    } else {
        var result = sessionStorage.getItem(key);
    }

    return result;
}