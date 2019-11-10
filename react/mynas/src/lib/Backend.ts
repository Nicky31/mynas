import config from 'lib/config';

interface BackendParams {
    BASE_URL: string;
}

export class Backend {
    BASE_URL: string;
    DEFAULT_HEADERS = {
        'Content-Type': 'application/json'
    }

    private constructor({ BASE_URL} : BackendParams) {
        this.BASE_URL = BASE_URL;
    }

    public static build(params: BackendParams) {
        backend = new Backend(params)
        return backend
    }

    graphql(data: object) {
        if (typeof data != 'object')
            data = { query: data }        
        return this.post('graphql', data)
    }

    post(path: string, body: object, params: object = {}) {
        return fetch(this.BASE_URL + path, {
            headers: this.DEFAULT_HEADERS,
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            // credentials: 'same-origin',
            ...params
        })
        .then((response) => {
          if (response.status === 401) {
            throw "Unauthorized call"
          } else if ((response.status === 200 || response.status === 201)) {
            return response.json();
          } else {
            return response.json().then((error)=>{
              throw(error);
            })
          }
        })
    }

    postFile(body: any, file: File) {
        let data = new FormData()
        data.append('file', file);
        for (let key in body) {
            data.append(key, body[key])
        }
        return this.post('upload', {}, {
            body: data,
            headers: undefined
        })
    }

    /* App calls */
    login(params: LoginRequestShape) {
        return this.post('auth', params)
    }

    upload(params: UploadRequestShape) {
        const { file, ...body } = params
        return this.postFile(body, file)
    }
}
var backend: Backend = Backend.build(config.API)
export default backend
