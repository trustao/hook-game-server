const crypto = require('crypto');
const _algorithm = 'aes-256-cbc';
const _iv = '68686868666666666666666666666666';
const ivBuffer = Buffer.from(_iv, 'hex');
const _srvKey = Buffer.from('52525252555555555555555555555555', 'utf8').toString('hex');
/**
 * @desc: 加密
 * @param: data: 待加密的内容； dataEncoding: 内容编码; key: 秘钥；
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
function encrypt(data, dataEncoding, key, keyEncoding, padding) {
  let keyBuf = null;

  if (key instanceof Buffer) {
    keyBuf = key;
  } else {
    keyBuf = Buffer.from(key, keyEncoding);
  }

  let dataBuf = null;
  if (data instanceof Buffer) {
    dataBuf = data;
  } else {
    dataBuf = Buffer.from(data, dataEncoding);
  }

  let cipher = crypto.createCipheriv(_algorithm, keyBuf, ivBuffer);
  cipher.setAutoPadding(padding);
  let cipherData = cipher.update(dataBuf, 'buffer', 'base64');
  cipherData += cipher.final('base64');

  return cipherData;
};

/**
 * @desc:  解密
 * @param: data: 待解密的内容； dataEncoding: 内容编码; key: 秘钥；
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
function decypt(data, dataEncoding, key, keyEncoding, padding) {

  let keyBuf = null;
  if (key instanceof Buffer) {
    keyBuf = key;
  } else {
    keyBuf = Buffer.from(key, keyEncoding);
  }

  let dataBuf = null;
  if (data instanceof Buffer) {
    dataBuf = data;
  } else {
    dataBuf = Buffer.from(data, dataEncoding);
  }

  var decipher = crypto.createDecipheriv(_algorithm, keyBuf, ivBuffer);
  decipher.setAutoPadding(padding);
  var decipherData = decipher.update(dataBuf, 'binary', 'binary');
  decipherData += decipher.final('binary');
  var str3 = Buffer.from(decipherData, 'binary');

  return str3.toString('utf8');
};

const randomKey = () => (Date.now() * Math.random()).toString(32).replace('.', '')

const obj2UrlParams = (obj) => {
  if (!obj) return ''
  return Object.keys(obj).reduce((a, key, index, arr) => a + key + '=' + encodeURIComponent(obj[key]) + (index === arr.length - 1 ? '' : '&'), '?')
}

function createUUID (sessionKey, openId) {
  return encrypt(`${sessionKey}#$#${openId}`, 'utf8', _srvKey, 'hex', true);
}

function deCodeUUID (str) {
  try {
    const idStr = decypt(str, 'base64', _srvKey, 'hex', true)
    const arr = idStr.split('#$#')
    if (arr.length === 2) {
      return {
        sessionKey: arr[0],
        openId: arr[1]
      }
    } else {
      return {sessionKey: '', openId: ''}
    }
  } catch (e) {
    return {sessionKey: '', openId: ''}
  }
}

module.exports = {
  randomKey,
  obj2UrlParams,
  encrypt,
  decypt,
  createUUID,
  deCodeUUID
}