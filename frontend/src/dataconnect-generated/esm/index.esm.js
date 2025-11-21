import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'incident-tracker1',
  location: 'us-east4'
};

export const createNewIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewIncident', inputVars);
}
createNewIncidentRef.operationName = 'CreateNewIncident';

export function createNewIncident(dcOrVars, vars) {
  return executeMutation(createNewIncidentRef(dcOrVars, vars));
}

export const listIncidentsForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListIncidentsForUser');
}
listIncidentsForUserRef.operationName = 'ListIncidentsForUser';

export function listIncidentsForUser(dc) {
  return executeQuery(listIncidentsForUserRef(dc));
}

export const updateIncidentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIncidentStatus', inputVars);
}
updateIncidentStatusRef.operationName = 'UpdateIncidentStatus';

export function updateIncidentStatus(dcOrVars, vars) {
  return executeMutation(updateIncidentStatusRef(dcOrVars, vars));
}

export const listPublicCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicCategories');
}
listPublicCategoriesRef.operationName = 'ListPublicCategories';

export function listPublicCategories(dc) {
  return executeQuery(listPublicCategoriesRef(dc));
}

