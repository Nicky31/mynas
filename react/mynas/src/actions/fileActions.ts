import backend from 'lib/Backend';
import ReduxActions from 'actions/';

export function upload(params: UploadRequestShape) {
    return () => {
        return backend.upload(params)
        .then(ret => {
            console.log(ret)
        })
    }
}