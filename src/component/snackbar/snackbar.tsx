import React from "react";
import {SnackbarProps, SnackbarState} from "../../../typings/components/snackbar";
import "./snackbar.css";

export class Snackbar extends React.Component<SnackbarProps, SnackbarState> {

    // defined states by props
    constructor(props: SnackbarProps) {
        super(props);
        this.state = {
            render: props.render,
            color: props.color,
            message: props.message
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({render: false});
        }, 1500);
    }

    // render component
    render() {
        if (this.state.render) {
            return (
                <div style={{background: this.state.color}} className="alert">
                    {this.state.message}
                </div>
            );
        } else {
            return null;
        }
    }
}
