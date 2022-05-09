const fetch = require('node-fetch');
var FormData = require('form-data');
var reconServiceBaseUrl = process.env.RECON_SERVICE_BASE_URL;
var password = process.env.FILE_PASSWORD;

exports.triggerReconciliation = function (serviceType, fileName, base64Content) {
    const buffer = Buffer.from(base64Content, 'base64');
    const formData = new FormData();
    formData.append("file", buffer, { filename: fileName });
    formData.append("password", password);
    formData.append("serviceType", serviceType);
    console.log("serviceType: " + serviceType);

    var triggerReconApiUrl = reconServiceBaseUrl + '/payment/reconciliation';
    console.log("trigger reconciliation API url: " + triggerReconApiUrl);
    fetch(triggerReconApiUrl, {
        method: 'POST',
        body: formData
    }).then( response =>
        response.json()
    ).then(data => {
        console.log(data);
    });
};
