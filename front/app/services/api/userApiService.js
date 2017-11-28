'use strict';


userService.$inject = ['apiService', '$http'];
function userService(apiService, $http) {
  this.login      = login;

  function login(email, password) {
    return apiService.post('auth', {email, password})
    .then(ret => {
      console.log('got ' + JSON.stringify(ret))
      if (ret.data)
        return ({
          success: true,
          entity: ret.data
        })
      return {error: 'Bad login details'}
    })
  }
}

export default userService;