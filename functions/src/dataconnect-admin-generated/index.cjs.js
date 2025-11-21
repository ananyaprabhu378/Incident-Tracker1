const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'incident-tracker1',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function createNewIncident(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateNewIncident', inputVars, inputOpts);
}
exports.createNewIncident = createNewIncident;

function listIncidentsForUser(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListIncidentsForUser', undefined, inputOpts);
}
exports.listIncidentsForUser = listIncidentsForUser;

function updateIncidentStatus(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateIncidentStatus', inputVars, inputOpts);
}
exports.updateIncidentStatus = updateIncidentStatus;

function listPublicCategories(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListPublicCategories', undefined, inputOpts);
}
exports.listPublicCategories = listPublicCategories;

