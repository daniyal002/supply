export interface IRole {
  role_id?: number;
  role_name: string;
  note?: string;
  is_archive?: boolean;
  permissions: IPermission[];
}

export interface IRoleResponse {
  detail: IRole[];
}

export interface IRoleAddResponse {
  detail: string;
  role: IRole;
}

export interface IRoleOption {
  value: number;
  label: string;
}

export interface IPermission {
  permission_id?: number;
  permission_code: string;
  permission_type: "api" | "ui";
  note?: string;
  is_archive: boolean;
  created_at: string;
  updated_at?: string;
}

export interface IPermissionRequest {
  role_id: number;
  permission_id: number;
}

export interface IPermissionResponse {
    detail:IPermission[];
}
