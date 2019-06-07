import * as React from "react";

interface IProps {
    pushBreadcrumb: (title: string) => void;
    popBreadcrumb: () => void;
}

export default class Files extends React.Component<IProps, {}> {
    BASE_BREADCRUMB = "Files"
    
    state = {
        counter: 0
    }

    render() {

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
            </div>
        )
    }
}