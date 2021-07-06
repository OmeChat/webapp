import {useMediaQuery} from "react-responsive";
import {UseScreenType} from "../../typings/hooks/useScreenType";

// This hook decides weather the screen is
// a mobile screen or a desktop screen. This is
// decided by the screen-width
export function useScreenType(): UseScreenType {
    const isMobile = useMediaQuery({maxWidth: 780});
    const isDesktop = useMediaQuery({maxWidth: 1440});
    return {
        isMobile,
        isDesktop
    } as UseScreenType;
}
