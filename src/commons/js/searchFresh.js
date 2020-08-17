export function setSession(key, params,id) {
    if(id==null){
        if (typeof params == 'object') {
            var params = Object.assign({}, getSession('searchFresh'), params);
            params = JSON.stringify(params)
        }
        sessionStorage.setItem(key, params);
    }else{
        if (typeof params == 'object') {
            var obj=Object.assign({}, getSession('searchFreshArr'));
            
            obj[id]=params
            
            
            obj=JSON.stringify(obj)
        }
        sessionStorage.setItem(key, obj);
    }
    
}
export function getSession(key) {
    if (key == 'searchFresh') {
        var result = JSON.parse(sessionStorage.getItem(key));
    }else if (key == 'searchFreshArr') {
        var result = JSON.parse(sessionStorage.getItem(key));
    } else {
        var result = sessionStorage.getItem(key);
    }

    return result;
}