"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use strict";

var _axios = require('./config/axios'); var _axios2 = _interopRequireDefault(_axios);
var _fs = require('fs');

/**
 * Retorna array com todos os cofres
 */
const listSafes = async () => {
  const { data } = await _axios2.default.get(`/safes`);

  return data;
};

/**
 * Retorna array com todos documentos
 */
const listDocuments = async () => {
  const { data } = await _axios2.default.get(`/documents`);

  return data;
};

/**
 * Retorna um documento específico
 */
const listDocument = async ({ uuid_document }) => {
  const { data } = await _axios2.default.get(`/documents/${uuid_document}`);

  return data;
};

/**
 * Faz upload de um documento para o cofre
 */
const uploadDocumentBinary = async ({ uuid_folder, pathFile }) => {
  const file64 = await _fs.promises.readFile(pathFile, { encoding: "base64" });

  const payload = {
    base64_binary_file: file64,
    mime_type: "application/pdf",
    name: "Cédula do Produtor - 665/1",
    // "uuid_folder": "{UUID DA PASTA}"
  };

  const { data } = await _axios2.default.post(
    `/documents/${uuid_folder}/uploadbinary`,
    payload
  );

  return data;
};

/**
 * Adiciona signatários para um documento específico
 */
const addSigners = async ({ uuid_document, signers }) => {
  const payload = {
    signers,
  };

  const { data } = await _axios2.default.post(
    `/documents/${uuid_document}/createlist`,
    payload
  );

  return data;
};

/**
 * Lista os signatários de um documento
 */
const listSigners = async ({ uuid_document }) => {
  const { data } = await _axios2.default.get(`/documents/${uuid_document}/list`);

  return data[0];
};

/**
 * Remove um determinado signatário
 */
const removeSigner = async ({ uuid_document, signer }) => {
  const { data } = await _axios2.default.post(
    `/documents/${uuid_document}/removeemaillist`,
    signer
  );

  return data;
};

/**
 * Envia um documento para assinatura
 */
const sendDocumentToSigner = async ({ uuid_document }) => {
  const payload = {
    message: "Conta café está te enviando uma CPR para assinatura",
    skip_email: "0",
    workflow: "0",
    // "tokenAPI": "{token-user}"
  };

  const { data } = await _axios2.default.post(
    `/documents/${uuid_document}/sendtosigner`,
    payload
  );

  return data;
};

/**
 * Reenvia um link de assinatura
 */
const resendLink = async ({ uuid_document, signer }) => {
  const { data } = await _axios2.default.post(
    `/documents/${uuid_document}/resend`,
    signer
  );

  return data;
};

/**
 * Adiciona um webhook para notificar as assinaturas
 */
const addWebhook = async ({ uuid_document, url }) => {
  const { data } = await _axios2.default.post(`/documents/${uuid_document}/webhooks`, {
    url,
  });

  return data;
};

const listWebhooks = async ({ uuid_document }) => {
  const { data } = await _axios2.default.get(`/documents/${uuid_document}/webhooks`);

  return data;
};












exports.listSafes = listSafes; exports.listDocuments = listDocuments; exports.listDocument = listDocument; exports.uploadDocumentBinary = uploadDocumentBinary; exports.addSigners = addSigners; exports.listSigners = listSigners; exports.removeSigner = removeSigner; exports.sendDocumentToSigner = sendDocumentToSigner; exports.resendLink = resendLink; exports.addWebhook = addWebhook;

(async function run() {
  try {
    const signers = [
      {
        email: "brunorossini@live.com",
        act: 4,
        foreing: 0,
        certificadoicpbr: 0,
        assinatura_presencial: 0,
        embed_methodauth: "email",
      },
    ];
    // const uuid_document = `032f0716-b894-4ea2-9377-30e66465653e`;
    const uuid_document = `7c70e5d0-55b2-4095-81b2-52ce6f5900f0`;
    const uuid_folder = `f5674a8b-8cd3-4a9a-9c11-81276c37e6bd`;
    const pathFile =
      "src/documents/Bruna Bittencourt/Cedula_Produtor_665_1.pdf";

    // 1 - Upload do documento
    const { uuid } = await uploadDocumentBinary({ uuid_folder, pathFile });
    // const uuid = `d050e0a0-38a4-49de-8041-abaeafb9cce0`;

    // 2 - Adicionar signatários
    console.log(await addSigners({ uuid_document: uuid, signers }));

    // 3 - Envia documento para assinatura
    console.log(await sendDocumentToSigner({ uuid_document: uuid }));

    // console.log(await listSigners({ uuid_document }));

    // 4 - Reenvia um link de assinatura
    // console.log(await resendLink({ uuid_document }));

    console.log(
      await addWebhook({
        uuid_document: uuid,
        url: `https://api.meutransporte.com/d4sign`,
      })
    );
  } catch (error) {
    console.log(error);
  }
})();
