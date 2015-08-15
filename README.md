Express-Cached-LDAP
========================

Express-Cached-LDAP is an Active Directory authentication middleware for Express.js. It supports both user and groups authentication. The middleware caches the user authentication so that it queries Active Directory just once per user (until the cache expires).
Express-Cached-LDAP depends strictly on express-ntlm (https://www.npmjs.com/package/express-ntlm) and activedirectory (https://www.npmjs.com/package/activedirectory).

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

## Configuration

The basic configuration requires ldapUrl, baseDN, ldapUsername and ldapPassword.
There are two additional parameter that can be added:
- groups, array of strings that check if the users is in the given groups;
- ttl, cache expiration in seconds, the default is 1800 (30 min).

```js
app.use(ldap({
  ldapUrl: 'ldap://yourDomain.domain.com',
  baseDN: 'dc=domain,dc=com',
  ldapUsername: 'adUsername',
  ldapPassword: 'adPassword',
  groups: ['Group Test 1', 'Group Test 2'],
  ttl: 36000
}));
```

If the user is not authenticated, a response status 401 will be sent.