import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface CreateNewIncidentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewIncidentVariables): MutationRef<CreateNewIncidentData, CreateNewIncidentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewIncidentVariables): MutationRef<CreateNewIncidentData, CreateNewIncidentVariables>;
  operationName: string;
}
export const createNewIncidentRef: CreateNewIncidentRef;

export function createNewIncident(vars: CreateNewIncidentVariables): MutationPromise<CreateNewIncidentData, CreateNewIncidentVariables>;
export function createNewIncident(dc: DataConnect, vars: CreateNewIncidentVariables): MutationPromise<CreateNewIncidentData, CreateNewIncidentVariables>;

interface ListIncidentsForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIncidentsForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListIncidentsForUserData, undefined>;
  operationName: string;
}
export const listIncidentsForUserRef: ListIncidentsForUserRef;

export function listIncidentsForUser(): QueryPromise<ListIncidentsForUserData, undefined>;
export function listIncidentsForUser(dc: DataConnect): QueryPromise<ListIncidentsForUserData, undefined>;

interface UpdateIncidentStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncidentStatusVariables): MutationRef<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateIncidentStatusVariables): MutationRef<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
  operationName: string;
}
export const updateIncidentStatusRef: UpdateIncidentStatusRef;

export function updateIncidentStatus(vars: UpdateIncidentStatusVariables): MutationPromise<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
export function updateIncidentStatus(dc: DataConnect, vars: UpdateIncidentStatusVariables): MutationPromise<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;

interface ListPublicCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicCategoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicCategoriesData, undefined>;
  operationName: string;
}
export const listPublicCategoriesRef: ListPublicCategoriesRef;

export function listPublicCategories(): QueryPromise<ListPublicCategoriesData, undefined>;
export function listPublicCategories(dc: DataConnect): QueryPromise<ListPublicCategoriesData, undefined>;

