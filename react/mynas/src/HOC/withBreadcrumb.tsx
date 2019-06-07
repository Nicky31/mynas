import * as React from 'react';
import { connect } from 'react-redux';
import ReduxActions from 'actions/';

const mapState = ({ global } : {global: GlobalReducerShape}) =>  ({ global })
const mapProps = {
    pushBreadcrumb: ReduxActions.PUSH_BREADCRUMB.create,
    popBreadcrumb: ReduxActions.POP_BREADCRUMB.create
}

interface IProps {
    pushBreadcrumb: (props: BreadcrumbShape) => void;
    popBreadcrumb: () => void;
    global: GlobalReducerShape;
}

export default function withBreadcrumb(Component: any) {    
    class BreadcrumbWrapper extends React.Component<IProps, {}> {
        wrappedRef?: any;

        constructor(props: any) {
            super(props)
            this.wrappedRef = undefined
        }

        pushBreadcrumb = (title: string) => {
            this.props.pushBreadcrumb({
                title,
                componentState: this.wrappedRef.state
            })
        }

        popBreadcrumb = () => {
            this.props.popBreadcrumb()
        }

        setWrappedRef = (wrapped: JSX.Element) => {
            this.wrappedRef = wrapped
            // Set base breadcrumb
            if  (this.props.global.breadcrumb.length === 0 && 'BASE_BREADCRUMB' in wrapped) {
                this.pushBreadcrumb((wrapped as any).BASE_BREADCRUMB)
            }
        }

        componentWillUpdate(nextProps: any) {
            const nextBreadcrumb = nextProps.global.breadcrumb
            const len = nextBreadcrumb.length
            if (len > 0 && len < this.props.global.breadcrumb.length) {
                this.wrappedRef.setState(nextBreadcrumb[len - 1].componentState)
            }
        }

        render() {
            return (
                <Component
                    {...this.props}
                    ref={this.setWrappedRef}
                    pushBreadcrumb={this.pushBreadcrumb}
                    popBreadcrumb={this.popBreadcrumb}
                />
            )
        }
    }

    return connect(mapState, mapProps)(BreadcrumbWrapper)
}
