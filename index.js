'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var simpleParser = require('mailparser').simpleParser;
var Recon = require('./js/client/recon.js');

module.exports.handler = function (event, context, callback) {
    console.log("Received event: "+JSON.stringify(event));
    var s3Object = event.Records[0].s3.object;

    var req = {
        Bucket: event.Records[0].s3.bucket.name,
        Key: s3Object.key
    };

    s3.getObject(req, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            simpleParser(data.Body, (err, parsed) => {
                if (err) {
                    console.log(err, err.stack);
                    callback(err);
                } else {
                    console.log("Received mail with below details:");
                    console.log("date:", parsed.date, "subject:", parsed.subject, "from:", parsed.from.text, "body:", parsed.text);

                    parsed.attachments.forEach(attachment => {
                        console.log("attachment type: " + attachment.type + ", attachment name: "+ attachment.filename);
                        if(attachment.type == 'attachment' && attachment.filename.endsWith(".xlsx") && attachment.filename.includes("POINTX")) {
                            Recon.triggerReconciliation("POINTX", attachment.filename, attachment.content);
                        }
                    });
                }
            });
        }
    });
};