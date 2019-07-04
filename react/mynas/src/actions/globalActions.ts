import backend from 'lib/Backend';
import Cookies from 'js-cookie';
import ReduxActions from 'actions/';

export function login(params: LoginRequestShape) {
    return {
        fetch: () => backend.login(params)
        .then((ret: any) => {
            console.log("connected with ", ret)
            Cookies.set('user', ret)
            ReduxActions.UPDATE_USER.dispatch(ret)
            return ret
        }),
        outputStore: 'users'
    }
}

export function restoreSession() {
    return {
        fetch: () => {
            var user = Cookies.get('user')
            console.log(user)
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