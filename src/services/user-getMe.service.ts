import Cookies from 'js-cookie'

export enum EnumGetMe {
    'GET_ME' = 'get_me',
}

export const getGetME = () => {
    const get_me = Cookies.get(EnumGetMe.GET_ME)
    return get_me || null
}



