const fs = require('fs').promises
const grpc = require('grpc');
const lnrpc = grpc.load('/home/daan/Workspace/lightning-sprinkle-user-service-electron/src/lib/rpc.proto').lnrpc;
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

/**
 * Init the connection with the LND process
 */
async function init() {
  const lndCert = await fs.readFile('LND_DIR/tls.cert');
  const sslCreds = grpc.credentials.createSsl(lndCert);
  let macaroonCreds = await getMacaroonCreds()
  let creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
  let lightning = new lnrpc.Lightning('localhost:10009', creds);
}

/**
 * Read macaroon from filesystem and return as hex-bytestring
 * @param {String} path
 * @return {String}
 */
function getMacaroonCreds(path) {
  return new Promise((resolve, reject) => {
    grpc.credentials.createFromMetadataGenerator(async (args, callback) => {
      let macaroon = await fs.readFile(path).then(content => content.toString('hex'))
      let metadata = new grpc.Metadata()
      metadata.add('macaroon', macaroon)
      callback(null, metadata)
    });
  })
}

/**
 * Create a new request with the keysend feature.
 * https://github.com/lightningnetwork/lnd/pull/3795?ref=tokendaily
 * @param {String} dest 
 * @param {Number} amt 
 */
function keysendRequest(dest, amt) {

}

/**
 * Actually send the payment to the lightning network
 * @param {Object} sendRequest 
 */
function sendPayment(sendRequest) {

}

module.exports = { getMacaroonCreds, keysendRequest, sendPayment }