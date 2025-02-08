export enum httpStatus {
  ERROR = 400,
  SUCCESS = 200,
}

export enum httpMessage {
  ERROR = `Server internal Error`,
  SUCCESS = `Server response Success`,
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Sale = 'sale',
  ProjectManagement = 'project_management',
  CTV = 'ctv',
}

export enum Status {
  Pending = 'pending',
  Accept = 'accept',
  Refuse = 'refuse',
}

export enum ActionEvent {
  Create = 'create',
  Update = 'update',
}
