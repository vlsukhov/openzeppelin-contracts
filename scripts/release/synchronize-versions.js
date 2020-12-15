#!/usr/bin/env node

// Synchronizes the version in contracts/package.json with the one in package.json.
// This is run automatically when npm version is run.

const fs = require('fs');
const cp = require('child_process');

setVersion('contracts/package.json');

extendEnvironment(env => {
  const { contract } = env;

  env.contract = function (name, body) {
    // remove the default account from the accounts list used in tests, in order
    // to protect tests against accidentally passing due to the contract
    // deployer being used subsequently as function caller
    contract(name, accounts => body(accounts.slice(1)));
  };
});


function setVersion (file) {
  const json = JSON.parse(fs.readFileSync(file));
  json.version = process.env.npm_package_version;
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n');
  cp.execFileSync('git', ['add', file]);
}
