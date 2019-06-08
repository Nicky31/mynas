import * as React from 'react';
import 'res/css/forms.css';

export default function FilesSidebarWidgets(
    { onFileUpload, onCreateFolder } : { onFileUpload: (file: any) => void, onCreateFolder: (name: string) => void}
) {
    
    let openFileUploadForm = () => {
        (document as any).getElementById('uploadFileForm').click()
    }
    (React as any).useEffect(() => {
        document.querySelector('#uploadFileForm')!.addEventListener('change', function(this: HTMLFormElement) {
            onFileUpload(this.files);
        });        
    })        
    let [ newFolderName, setFolderName ] = React.useState('')

    return (
    <div>
        <li className="nav-item">
            <input type="file" multiple style={{visibility: "hidden", height: 0}} id="uploadFileForm" />
            <span className="nav-link" onClick={openFileUploadForm} style={{cursor: "pointer"}}>
                <i className="fa fa-upload"></i> Téléverser un fichier
            </span>
        </li>

        <li className="nav-item nav-dropdown" style={{cursor: "pointer"}}>
            <a className="nav-link nav-dropdown-toggle"> <i className="glyphicon glyphicon-plus"></i> Nouveau dossier</a>
            <ul className="nav-dropdown-items">
                <li className="nav-item">
                    <form onSubmit={(e: React.FormEvent) => {
                        e.preventDefault()
                        onCreateFolder(newFolderName)
                        setFolderName('')
                    }}>
                        <input type="text" placeholder="Nom du dossier" className="form-control sidebar-input"
                            value={newFolderName} onChange={e => setFolderName((e as any).target.value)}
                        />
                    </form>
                </li>
            </ul>
        </li>
    </div>
    )
}