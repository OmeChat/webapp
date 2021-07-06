import {ExposedUser} from "../../models/ExposedUser";

export interface RequestRandomPeopleResponse {
    matching_user: ExposedUser[];
    status: number;
}
