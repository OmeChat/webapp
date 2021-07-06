import React, {useEffect} from "react";
import {ScreenWrapperProps} from "../../../typings/components/ScreenWrapper";
import {useScreenType} from "../../hooks/useScreenType";
import "./ScreenWrapper.css";

export function ScreenWrapper(props: ScreenWrapperProps): JSX.Element {

    const { isMobile } = useScreenType();

    useEffect(() => {
        if (isMobile) {
            switch (props.targetPosition) {
                case "left":
                    window.scrollTo({
                        left: 0,
                        top: 0,
                        behavior: 'smooth'
                    });
                break;
                case "right":
                    window.scrollTo({
                        left: window.innerWidth,
                        top: 0,
                        behavior: 'smooth'
                    });
                break;
            }
        }
    });

    if (!isMobile) {
        return (
            <div>
                {props.children}
            </div>
        )
    } else {
        return (
            <div className="mobile">
                {props.children}
            </div>
        )
    }
}
