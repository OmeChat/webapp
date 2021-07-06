import React from "react";
import "./Overlay.css";
import {OverlayProps, OverlayState} from "../../../typings/components/Overlay";

export class Overlay extends React.Component<OverlayProps, any> {

    wrapperRef: React.RefObject<any>;

    state: OverlayState = {
        showOverlay: true
    };

    constructor(props: OverlayProps) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event: any) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.closer();
        }
    }


    render() {
        return (
          <div className="overlay" ref={this.wrapperRef}>
              <h1>Account Creation successful!</h1>
              SECRET: {this.props.message}
              <p>Please save this secret. It acts as your password</p>
          </div>
        );
    }
}
