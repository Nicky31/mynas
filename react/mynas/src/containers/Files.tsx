import * as React from "react";
import { FilesSidebarWidgets } from 'components';

interface IProps {
    pushBreadcrumb: (title: string) => void;
    popBreadcrumb: () => void;
    renderSidebarWidgets: (elem: JSX.Element) => void;
}

export default class Files extends React.Component<IProps, {}> {
    BASE_BREADCRUMB = "Files"
    state = {
        counter: 0
    }

    onFileUpload = (file: File) => {
        console.log('ON UPLOAD')
        console.log(file)
    }

    onCreateFolder = (folder: string) => {
        console.log('creating folder ' + folder)
    }

    render() {
        console.log((document as any).getElementById('navbar-widgets'))
        return (
            <div>
                <div onClick={() => {
                    this.setState({
                        counter: this.state.counter + 1
                    }, () => this.props.pushBreadcrumb("COunter " + this.state.counter))
                }}>
                    PUSH {this.state.counter}
                </div>
                <div onClick={() => this.props.popBreadcrumb()}>
                    pop {this.state.counter}
                </div>
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