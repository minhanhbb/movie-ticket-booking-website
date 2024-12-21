
import { User } from "./User";
import {Permission} from './Permissions'
import {RolesHasPermissions} from './Role_has_permissions'
export interface Roles{
    id: string;
    name: string;
    user: User
    permissions: Permission[]
    role_has_permissions: RolesHasPermissions;
    guard_name: string;
    created_at: string;
}

  