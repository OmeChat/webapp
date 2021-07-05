import {ExposedUser} from "../models/ExposedUser";

export interface UserSearchOverlayState {
    users: ExposedUser[];
    tolerance: number;
}
