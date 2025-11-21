# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListIncidentsForUser*](#listincidentsforuser)
  - [*ListPublicCategories*](#listpubliccategories)
- [**Mutations**](#mutations)
  - [*CreateNewIncident*](#createnewincident)
  - [*UpdateIncidentStatus*](#updateincidentstatus)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListIncidentsForUser
You can execute the `ListIncidentsForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listIncidentsForUser(): QueryPromise<ListIncidentsForUserData, undefined>;

interface ListIncidentsForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIncidentsForUserData, undefined>;
}
export const listIncidentsForUserRef: ListIncidentsForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listIncidentsForUser(dc: DataConnect): QueryPromise<ListIncidentsForUserData, undefined>;

interface ListIncidentsForUserRef {
  ...
  (dc: DataConnect): QueryRef<ListIncidentsForUserData, undefined>;
}
export const listIncidentsForUserRef: ListIncidentsForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listIncidentsForUserRef:
```typescript
const name = listIncidentsForUserRef.operationName;
console.log(name);
```

### Variables
The `ListIncidentsForUser` query has no variables.
### Return Type
Recall that executing the `ListIncidentsForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListIncidentsForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListIncidentsForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listIncidentsForUser } from '@dataconnect/generated';


// Call the `listIncidentsForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listIncidentsForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listIncidentsForUser(dataConnect);

console.log(data.incidents);

// Or, you can use the `Promise` API.
listIncidentsForUser().then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

### Using `ListIncidentsForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listIncidentsForUserRef } from '@dataconnect/generated';


// Call the `listIncidentsForUserRef()` function to get a reference to the query.
const ref = listIncidentsForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listIncidentsForUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.incidents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

## ListPublicCategories
You can execute the `ListPublicCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicCategories(): QueryPromise<ListPublicCategoriesData, undefined>;

interface ListPublicCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicCategoriesData, undefined>;
}
export const listPublicCategoriesRef: ListPublicCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicCategories(dc: DataConnect): QueryPromise<ListPublicCategoriesData, undefined>;

interface ListPublicCategoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicCategoriesData, undefined>;
}
export const listPublicCategoriesRef: ListPublicCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicCategoriesRef:
```typescript
const name = listPublicCategoriesRef.operationName;
console.log(name);
```

### Variables
The `ListPublicCategories` query has no variables.
### Return Type
Recall that executing the `ListPublicCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicCategoriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicCategoriesData {
  categories: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Category_Key)[];
}
```
### Using `ListPublicCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicCategories } from '@dataconnect/generated';


// Call the `listPublicCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicCategories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicCategories(dataConnect);

console.log(data.categories);

// Or, you can use the `Promise` API.
listPublicCategories().then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

### Using `ListPublicCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicCategoriesRef } from '@dataconnect/generated';


// Call the `listPublicCategoriesRef()` function to get a reference to the query.
const ref = listPublicCategoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicCategoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.categories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.categories);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewIncident
You can execute the `CreateNewIncident` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewIncident(vars: CreateNewIncidentVariables): MutationPromise<CreateNewIncidentData, CreateNewIncidentVariables>;

interface CreateNewIncidentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewIncidentVariables): MutationRef<CreateNewIncidentData, CreateNewIncidentVariables>;
}
export const createNewIncidentRef: CreateNewIncidentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewIncident(dc: DataConnect, vars: CreateNewIncidentVariables): MutationPromise<CreateNewIncidentData, CreateNewIncidentVariables>;

interface CreateNewIncidentRef {
  ...
  (dc: DataConnect, vars: CreateNewIncidentVariables): MutationRef<CreateNewIncidentData, CreateNewIncidentVariables>;
}
export const createNewIncidentRef: CreateNewIncidentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewIncidentRef:
```typescript
const name = createNewIncidentRef.operationName;
console.log(name);
```

### Variables
The `CreateNewIncident` mutation requires an argument of type `CreateNewIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewIncidentVariables {
  title: string;
  description: string;
  severity: string;
  status: string;
  reporterId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateNewIncident` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewIncidentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewIncidentData {
  incident_insert: Incident_Key;
}
```
### Using `CreateNewIncident`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewIncident, CreateNewIncidentVariables } from '@dataconnect/generated';

// The `CreateNewIncident` mutation requires an argument of type `CreateNewIncidentVariables`:
const createNewIncidentVars: CreateNewIncidentVariables = {
  title: ..., 
  description: ..., 
  severity: ..., 
  status: ..., 
  reporterId: ..., 
};

// Call the `createNewIncident()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewIncident(createNewIncidentVars);
// Variables can be defined inline as well.
const { data } = await createNewIncident({ title: ..., description: ..., severity: ..., status: ..., reporterId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewIncident(dataConnect, createNewIncidentVars);

console.log(data.incident_insert);

// Or, you can use the `Promise` API.
createNewIncident(createNewIncidentVars).then((response) => {
  const data = response.data;
  console.log(data.incident_insert);
});
```

### Using `CreateNewIncident`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewIncidentRef, CreateNewIncidentVariables } from '@dataconnect/generated';

// The `CreateNewIncident` mutation requires an argument of type `CreateNewIncidentVariables`:
const createNewIncidentVars: CreateNewIncidentVariables = {
  title: ..., 
  description: ..., 
  severity: ..., 
  status: ..., 
  reporterId: ..., 
};

// Call the `createNewIncidentRef()` function to get a reference to the mutation.
const ref = createNewIncidentRef(createNewIncidentVars);
// Variables can be defined inline as well.
const ref = createNewIncidentRef({ title: ..., description: ..., severity: ..., status: ..., reporterId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewIncidentRef(dataConnect, createNewIncidentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incident_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incident_insert);
});
```

## UpdateIncidentStatus
You can execute the `UpdateIncidentStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateIncidentStatus(vars: UpdateIncidentStatusVariables): MutationPromise<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;

interface UpdateIncidentStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncidentStatusVariables): MutationRef<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
}
export const updateIncidentStatusRef: UpdateIncidentStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateIncidentStatus(dc: DataConnect, vars: UpdateIncidentStatusVariables): MutationPromise<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;

interface UpdateIncidentStatusRef {
  ...
  (dc: DataConnect, vars: UpdateIncidentStatusVariables): MutationRef<UpdateIncidentStatusData, UpdateIncidentStatusVariables>;
}
export const updateIncidentStatusRef: UpdateIncidentStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateIncidentStatusRef:
```typescript
const name = updateIncidentStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateIncidentStatus` mutation requires an argument of type `UpdateIncidentStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateIncidentStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateIncidentStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateIncidentStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateIncidentStatusData {
  incident_update?: Incident_Key | null;
}
```
### Using `UpdateIncidentStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateIncidentStatus, UpdateIncidentStatusVariables } from '@dataconnect/generated';

// The `UpdateIncidentStatus` mutation requires an argument of type `UpdateIncidentStatusVariables`:
const updateIncidentStatusVars: UpdateIncidentStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateIncidentStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateIncidentStatus(updateIncidentStatusVars);
// Variables can be defined inline as well.
const { data } = await updateIncidentStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateIncidentStatus(dataConnect, updateIncidentStatusVars);

console.log(data.incident_update);

// Or, you can use the `Promise` API.
updateIncidentStatus(updateIncidentStatusVars).then((response) => {
  const data = response.data;
  console.log(data.incident_update);
});
```

### Using `UpdateIncidentStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateIncidentStatusRef, UpdateIncidentStatusVariables } from '@dataconnect/generated';

// The `UpdateIncidentStatus` mutation requires an argument of type `UpdateIncidentStatusVariables`:
const updateIncidentStatusVars: UpdateIncidentStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateIncidentStatusRef()` function to get a reference to the mutation.
const ref = updateIncidentStatusRef(updateIncidentStatusVars);
// Variables can be defined inline as well.
const ref = updateIncidentStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateIncidentStatusRef(dataConnect, updateIncidentStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incident_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incident_update);
});
```

