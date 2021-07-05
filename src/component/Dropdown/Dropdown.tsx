import React from "react";
import "./Dropdown.css";
import {DropdownButtonAction, DropdownProps} from "../../../typings/components/Dropdown";
import ReactDOM from "react-dom";

export class Dropdown extends React.Component<DropdownProps, any> {

    wrapperRef: React.RefObject<any>;

    constructor(props: DropdownProps) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClickOutside(event: any) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.unmountDropdown();
        }
    }

    unmountDropdown(): void {
        ReactDOM.render(<div style={{display: "none"}}/>, document.getElementById('dropdown'));
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        let items = new Array<JSX.Element>();
        this.props.elements.forEach((element: DropdownButtonAction) => {
            items.push(
                <div className="dropdown-element" onClick={() => {
                    element.executor();
                    this.unmountDropdown();

                }}>
                    {element.title}
                </div>
            )
        });

        const styles = {
            top: this.props.yCords,
            left: this.props.xCords
        };

        return (
          <div className="dropdown" style={styles} ref={this.wrapperRef}>
              {items}
          </div>
        );
    }
}
