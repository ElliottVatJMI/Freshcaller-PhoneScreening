exports = {
  onCallCreateHandler: function (args) {
    const vipNumbers = (args.iparams.vip_numbers || "")
      .split(',')
      .map(n => n.trim())
      .filter(Boolean);
    const callerNumber = args.data.call.caller_id;

    if (!vipNumbers.includes(callerNumber)) {
      return renderData();
    }

    const callId = args.data.call.id;
    const queueId = args.iparams.vip_queue_id;

    return $request.post(
      `https://${args.domain}/api/v1/calls/${callId}/transfer`,
      {
        headers: { Authorization: `Token token=${args.iparams.api_key}` },
        body: JSON.stringify({ type: "queue", id: queueId })
      }
    ).then(() => renderData())
     .catch(err => renderData(err));
  },

  validateVIPCall: function (request) {
    const vipNumbers = (request.iparams.vip_numbers || "")
      .split(',')
      .map(n => n.trim())
      .filter(Boolean);
    const isVIP = vipNumbers.includes(request.input);
    return renderData(null, {
      data: {
        response: isVIP ? "vip" : "standard",
        queue_id: isVIP ? request.iparams.vip_queue_id : null
      }
    });
  },

  onAppInstallHandler: function () {
    console.info('onAppInstallHandler invoked');
    renderData();
  },

  onAppUninstallHandler: function () {
    console.info('onAppUninstallHandler invoked');
    renderData();
  }
};

module.exports = exports;
