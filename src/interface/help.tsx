export interface IHelp {
  help_id: number;
  help_name: string;
  link: string;
  note: string;
  created_at: string;
  updated_at: string;
}


export interface IHelpResponse {
  detail: IHelp[];
}