Express-Cached-LDAP
========================

Express-Cached-LDAP is an Active Directory authentication middleware for Express.js. It supports both users and groups authentication. 
The middleware caches the user authentication so that it queries Active Directory just once per user (until the cache expires).
Express-Cached-LDAP depends strictly on express-ntlm, activedirectory and node-cache packages.

## Installation
    $ npm install express-cached-ldap --no-optional
    
# Usage

First of all, we need to install express-ntlm and express-cached-ldap in your express application

    $ npm install express-ntlm
    $ npm install express-cached-ldap

After that, we need to add the two middlewares in our app.js

```js
var express = require('express');
...
var ntlm = require('express-ntlm');
var ldap = require('express-cached-ldap');

app.use(ntlm());

app.use(ldap({
  ldapUrl: 'ldap://yourDomain.domain.com',
  baseDN: 'dc=domain,dc=com',
  ldapUsername: 'adUsername',
  ldapPassword: 'adPassword'
}));
```

If the user is not authorized, a response status 401 will be sent or an error page will be rendered (see configuration).

## Configuration

The configuration requires ldapUrl, baseDN, ldapUsername and ldapPassword.
There are some optional parameters that can be added:
- groups, array of strings that check if the users is in the given groups;
- ttl, cache expiration in seconds, the default is 1800 (30 min). Pass 0 for unlimited;
- cacheCheckPeriod, delete cache check interval in seconds, the default is 600 (10 min). Pass 0 for no check.
- unauthorizedView, renders the specified view instead of send back a 401 error status.

```js
app.use(ldap({
  ldapUrl: 'ldap://yourDomain.domain.com',
  baseDN: 'dc=domain,dc=com',
  ldapUsername: 'adUsername',
  ldapPassword: 'adPassword',
  groups: ['Group Test 1', 'Group Test 2'],
  ttl: 36000,
  cacheCheckPeriod: 1000,
  unauthorizedView: 'unauthorized'
}));
```

## Authorize single API

app.use(ldap({...})) filters all the traffic and checks the user authorization. 
Instead to filter all traffic you might want to filter just some API.
To do that you need to create your own ldapModule and inject the middleware into the single APIs.

```js

```