import * as React from "react";
import { FilesSidebarWidgets } from 'components';

import { getHumanSize, getMimeFaClass } from 'lib/utils';
import moment from 'moment';

// Redux links
import { connect } from 'react-redux';
import {
    upload,
    fetchFiles,
    createFolder,
    deleteFiles
} from 'actions/fileActions';

const mapProps = {
  upload,
  fetchFiles,
  createFolder,
  deleteFiles
}
const mapState = ({ global, stores } : {
    global: GlobalReducerShape,
    stores: StoresReducerShape
}) => ({
  global,
  stores
})

interface IProps {
    stores: StoresReducerShape; 
    pushBreadcrumb: (title: string) => void;
    popBreadcrumb: () => void;
    renderSidebarWidgets: (elem: JSX.Element) => void;
    upload: (params: UploadRequestShape) => void;
    fetchFiles: (path?: FilePathShape) => any; // TODO fix pb match signature avec redux actions Promise<FileShape[]>;
    createFolder: (name: string, path: FilePathShape) => any; //Promise<FileShape>;
    deleteFiles: (fileIds: string[]) => void;
    setRef: (el: React.Component) => void;
}

class Files extends React.Component<IProps, {}> {
    BASE_BREADCRUMB = "Root"
    state = {
        path: ['/'] as FilePathShape,
        selectedFiles: [] as string[],
        selectedSize: 0
    }

    componentDidMount() {
        // TODO Cache this
        console.log("fetch files")
        this.moveTo(['/'])
        
        // Give our ref to layout callbacks wrapper
        if (this.props.setRef) {
            this.props.setRef(this)
        }
    }

    onFileUpload = (file: File[]) => {
        console.log('ON UPLOAD')
        console.log(file)
        this.props.upload({
            path: '/',
            file: file[0]
        })
    }

    moveTo = (path: FilePathShape) => {
        this.setState({ path })
        this.props.fetchFiles(path)
        // Assules that we always call moveTo with an immediate child or parent folder
        if (path.length > this.state.path.length) { // child directory, append breadcrumb
            this.props.pushBreadcrumb(path[path.length - 1])
        } else { // Parent directory;  pop breadcrumb
            this.props.popBreadcrumb()
        }
    }

    onCreateFolder = (folder: string) => {
        console.log('creating folder ' + folder)
        this.props.createFolder(folder, this.state.path)
        .then((ret: any) => {
            console.log('created folder', ret)
        })
    }

    onDeleteSelectedFiles = () => {
        console.log("delete ", this.state.selectedFiles)  
    }

    onDownloadSelectedFiles = () => {
        console.log("DOWNLOAD ", this.state.selectedFiles)
    }

    toggleSelect = (file?: FileShape) => {
        const files: FileShape[] = this.props.stores.files.getGroup(this.state.path)
        var selectedFiles: string[]
        if (file == undefined) { // Check / uncheck everything
            if (this.state.selectedFiles.length > 0) {
                selectedFiles = []
            } else {
                selectedFiles = files.map(cur => cur.id)
            }
        } else if (this.state.selectedFiles.includes(file.id)) {
            selectedFiles = this.state.selectedFiles.filter((cur) => cur != file.id)
        } else {
            selectedFiles = [...this.state.selectedFiles, file.id]
        }

        var selectedSize = files.filter(cur => selectedFiles.includes(cur.id)).reduce((totalSize, curFile) => (totalSize  + curFile.size), 0)

        this.setState({
            ...this.state,
            selectedFiles,
            selectedSize
        })
    }

    renderFiles = (files: FileShape[], selectedFiles: string[]) => {
        files = files.sort(a => a.directory ? 0 : 1) // Bring up directories
        console.log(files)
        if (selectedFiles.length == 0) {
            var thead = (
                <tr style={{color: "#A1A1A1"}}>
                <td>
                <div className="ckbox">
                    <input type="checkbox" className="fileCkb" id="ckbAll"
                        checked={selectedFiles.length == files.length}
                        onChange={() => this.toggleSelect()}
                    />
                    <label htmlFor="ckbAll"></label>
                </div>
                </td>
                <td></td>
                <td style={{width: 32}}></td> 
                <td style={{width: 50}}>Nom</td>
                <td></td>
                <td></td>
                <td>Taille</td>
                <td>Modifié</td>
            </tr>
            )
        } else { // Columns adapted for selection mode
            var thead = (
                <tr style={{color: "black", fontWeight: 400}}>
                <td>
                <div className="ckbox">
                    <input type="checkbox" className="fileCkb" id="ckbAll"
                        onChange={() => this.toggleSelect()}
                        checked={selectedFiles.length == files.length}
                    />
                    <label htmlFor="ckbAll" ></label>
                </div>
                </td>
                <td></td> 
                <td style={{width: 32}}></td>
                <td style={{width: 50}}>{selectedFiles.length} fichiers</td>
                <td style={{cursor: "pointer"}} onClick={this.onDeleteSelectedFiles}>
                    <i className="fa fa-trash"></i> Supprimer
                </td>
                <td style={{cursor: "pointer"}} onClick={this.onDownloadSelectedFiles}>
                    <i className="fa fa-arrow-circle-o-down"></i> Télécharger
                </td>
                <td>{getHumanSize(this.state.selectedSize)}</td>
                <td>Modifié</td>
            </tr>
            )
        }

        const tdFiles = files.map((file: FileShape) => {
            const isSelected = selectedFiles.includes(file.id)
            const onClick = !file.directory ? () => null : () => this.moveTo(this.state.path.concat([file.filename]))
            return (
                <tr data-status="pagado" className={isSelected ? "selected" : ""}
                    onClick={onClick} key={file.id}
                > 
                <td>
                    <div className="ckbox">
                        <input type="checkbox" className="fileCkb" id={"ckb"+file.id}
                            onChange={() => this.toggleSelect(file)}
                            checked={selectedFiles.includes(file.id)}
                        />
                        <label htmlFor={"ckb"+file.id}></label>
                    </div>
                </td>
        
                <td>
                    <a className="star" ng-className="{'star-checked': file.favourite}" ng-click="toggleFavourite(file)">
                    <i className="fa fa-lg" ng-className="{'fa-star': file.favourite, 'fa-star-o': !file.favourite}"></i>
                    </a>
                </td>
        
                <td>
                    <i className={getMimeFaClass(file.mime)} style={{"fontSize": 20}} />
                </td>
        
                <td>{file.filename}</td>
        
                <td></td>
                <td></td>
                <td>{file.directory ? null : getHumanSize(file.size)}</td>
                <td>{moment(file.updatedAt).fromNow()}</td>
                </tr>
            )
        })

        return (
            <table className="table table-filter">
                <thead>{thead}</thead>
                <tbody>{tdFiles}</tbody>
            </table>            
        )        
    }

    render() {
        const files = this.props.stores.files.getGroup(this.state.path)
        return (
            <div>
                {this.renderFiles(files, this.state.selectedFiles)}
                {this.props.renderSidebarWidgets(
                    <FilesSidebarWidgets
                        onFileUpload={this.onFileUpload}
                        onCreateFolder={this.onCreateFolder}
                    />
                )}
            </div>
        )
    }
}

export default connect(mapState, mapProps)(Files)