import { CreateNewIncidentData, CreateNewIncidentVariables, ListIncidentsForUserData, UpdateIncidentStatusData, UpdateIncidentStatusVariables, ListPublicCategoriesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewIncident(options?: useDataConnectMutationOptions<CreateNewIncidentData, FirebaseError, CreateNewIncidentVariables>): UseDataConnectMutationResult<CreateNewIncidentData, CreateNewIncidentVariables>;
export function useCreateNewIncident(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewIncidentData, FirebaseError, CreateNewIncidentVariables>): UseDataConnectMutationResult<CreateNewIncidentData, CreateNewIncidentVariables>;

export function useListIncidentsForUser(options?: useDataConnectQueryOptions<ListIncidentsForUserData>): UseDataConnectQueryResult<ListIncidentsForUserData, undefined>;
export function useListIncidentsForUser(dc: DataConnect, options?: useDataConnectQueryOptions<ListIncidentsForUserData>): UseDataConnectQueryResult<ListIncidentsForUserData, undefined>;

export function useUpdateIncidentStatus(options?: useDataConnectMutationOptions<UpdateIncidentStatusData, FirebaseError, UpdateIncidentStatusVariables>): UseDataConnectMutationResult<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
export function useUpdateIncidentStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateIncidentStatusData, FirebaseError, UpdateIncidentStatusVariables>): UseDataConnectMutationResult<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;

export function useListPublicCategories(options?: useDataConnectQueryOptions<ListPublicCategoriesData>): UseDataConnectQueryResult<ListPublicCategoriesData, undefined>;
export function useListPublicCategories(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicCategoriesData>): UseDataConnectQueryResult<ListPublicCategoriesData, undefined>;
