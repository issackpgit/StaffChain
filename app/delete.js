var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var helper = require('./helper.js');
var logger = helper.getLogger('Query');
var db = require('./db.js');
var crypto = require('crypto');
var url = "mongodb://localhost:27017/";
var secret = 'abcdefg';

var deleteChaincodeData = async function(peerNames, channelName, chaincodeName, args, fcn, username, org_name, callback) {
	try {
    var tx_id_string = null;
    var client = await helper.getClientForOrg(org_name, username);
    logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}

    var tx_id = client.newTransactionID();
    tx_id_string = tx_id.getTransactionID();

    var request = {
      argets: peerNames,
      chaincodeId: chaincodeName,
      fcn: fcn,
      args: args,
      chainId: channelName,
      txId: tx_id
    }

    let results = await channel.sendTransactionProposal(request);
