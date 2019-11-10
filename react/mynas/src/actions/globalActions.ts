import backend from 'lib/Backend';
import Cookies from 'js-cookie';
import ReduxActions from 'actions/';

export function login(params: LoginRequestShape) {
    return {
        fetch: () => backend.login(params)
        .then((ret: any) => {
            console.log("connected with ", ret.user)
            Cookies.set('user', ret.user)
            ReduxActions.UPDATE_USER.dispatch(ret.user)
            return ret.user
        }),
        outputStore: 'users'
    }
}

export function restoreSession() {
    return {
        fetch: () => {
            var user = JSON.parse(Cookies.get('user'))
            ReduxActions.UPDATE_USER.dispatch(user)
            return user
        },
        outputStore: 'users'
    }
}

export function destroySession() {
    return () => {
        Cookies.remove('user')
        ReduxActions.UPDATE_USER.dispatch()        
    }
}