const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'incident-tracker1',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewIncident', inputVars);
}
createNewIncidentRef.operationName = 'CreateNewIncident';
exports.createNewIncidentRef = createNewIncidentRef;

exports.createNewIncident = function createNewIncident(dcOrVars, vars) {
  return executeMutation(createNewIncidentRef(dcOrVars, vars));
};

const listIncidentsForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListIncidentsForUser');
}
listIncidentsForUserRef.operationName = 'ListIncidentsForUser';
exports.listIncidentsForUserRef = listIncidentsForUserRef;

exports.listIncidentsForUser = function listIncidentsForUser(dc) {
  return executeQuery(listIncidentsForUserRef(dc));
};

const updateIncidentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIncidentStatus', inputVars);
}
updateIncidentStatusRef.operationName = 'UpdateIncidentStatus';
exports.updateIncidentStatusRef = updateIncidentStatusRef;

exports.updateIncidentStatus = function updateIncidentStatus(dcOrVars, vars) {
  return executeMutation(updateIncidentStatusRef(dcOrVars, vars));
};

const listPublicCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicCategories');
}
listPublicCategoriesRef.operationName = 'ListPublicCategories';
exports.listPublicCategoriesRef = listPublicCategoriesRef;

exports.listPublicCategories = function listPublicCategories(dc) {
  return executeQuery(listPublicCategoriesRef(dc));
};
