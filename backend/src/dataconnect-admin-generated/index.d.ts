import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewIncidentData {
  incident_insert: Incident_Key;
}

export interface CreateNewIncidentVariables {
  title: string;
  description: string;
  severity: string;
  status: string;
  reporterId: UUIDString;
}

export interface IncidentCategory_Key {
  incidentId: UUIDString;
  categoryId: UUIDString;
  __typename?: 'IncidentCategory_Key';
}

export interface Incident_Key {
  id: UUIDString;
  __typename?: 'Incident_Key';
}

export interface ListIncidentsForUserData {
  incidents: ({
    id: UUIDString;
    title: string;
    description: string;
    severity: string;
    status: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Incident_Key)[];
}

export interface ListPublicCategoriesData {
  categories: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Category_Key)[];
}

export interface UpdateIncidentStatusData {
  incident_update?: Incident_Key | null;
}

export interface UpdateIncidentStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateNewIncident' Mutation. Allow users to execute without passing in DataConnect. */
export function createNewIncident(dc: DataConnect, vars: CreateNewIncidentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewIncidentData>>;
/** Generated Node Admin SDK operation action function for the 'CreateNewIncident' Mutation. Allow users to pass in custom DataConnect instances. */
export function createNewIncident(vars: CreateNewIncidentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewIncidentData>>;

/** Generated Node Admin SDK operation action function for the 'ListIncidentsForUser' Query. Allow users to execute without passing in DataConnect. */
export function listIncidentsForUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListIncidentsForUserData>>;
/** Generated Node Admin SDK operation action function for the 'ListIncidentsForUser' Query. Allow users to pass in custom DataConnect instances. */
export function listIncidentsForUser(options?: OperationOptions): Promise<ExecuteOperationResponse<ListIncidentsForUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateIncidentStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateIncidentStatus(dc: DataConnect, vars: UpdateIncidentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateIncidentStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateIncidentStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateIncidentStatus(vars: UpdateIncidentStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateIncidentStatusData>>;

/** Generated Node Admin SDK operation action function for the 'ListPublicCategories' Query. Allow users to execute without passing in DataConnect. */
export function listPublicCategories(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPublicCategoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListPublicCategories' Query. Allow users to pass in custom DataConnect instances. */
export function listPublicCategories(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPublicCategoriesData>>;

