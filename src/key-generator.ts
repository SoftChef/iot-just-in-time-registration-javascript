import * as fs from 'fs';
import * as forge from 'node-forge';
import { KeyInformation } from './information';

class KeyGenerator {
  generateDeviceKeyPair() {
    let keys = forge.pki.rsa.generateKeyPair(2048);
    let keyPair = {
      privateKey: forge.pki.privateKeyToPem(keys.privateKey),
      publicKey: forge.pki.publicKeyToPem(keys.publicKey),
    };
    return keyPair;
  }
  generateDeviceCsr(publicKey: string, privateKey: string, thingName: string, information?: KeyInformation): string {
    let csr = forge.pki.createCertificationRequest();
    csr.publicKey = forge.pki.publicKeyFromPem(publicKey);
    csr.setSubject([{
      name: 'commonName',
      value: thingName ?? 'Unknow',
    }, {
      name: 'countryName',
      value: information?.countryName ?? '',
    }, {
      shortName: 'ST',
      value: information?.stateName ?? '',
    }, {
      name: 'localityName',
      value: information?.localityName ?? '',
    }, {
      name: 'organizationName',
      value: information?.organizationName ?? '',
    }, {
      shortName: 'OU',
      value: information?.organizationUnitName ?? '',
    }]);
    // sign certification request
    csr.sign(forge.pki.privateKeyFromPem(privateKey), forge.md.sha256.create());
    // PEM-format keys and csr
    return forge.pki.certificationRequestToPem(csr);
  }
  generateDeviceCertificate(caCertificatePath: string, caKeyPath: string, deviceCsrPem: string) {
    let caCertificatePem = fs.readFileSync(caCertificatePath, 'utf8');
    let caKeyPem = fs.readFileSync(caKeyPath, 'utf8');
    let ca_certificate = forge.pki.certificateFromPem(caCertificatePem);
    let ca_key = forge.pki.privateKeyFromPem(caKeyPem);
    let device_csr = forge.pki.certificationRequestFromPem(deviceCsrPem);
    let certificate = forge.pki.createCertificate();
    certificate.validity.notBefore = new Date();
    certificate.validity.notAfter = new Date();
    certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear() + 25);
    certificate.setSubject(device_csr.subject.attributes);
    certificate.setIssuer(ca_certificate.subject.attributes);
    certificate.publicKey = device_csr.publicKey;
    certificate.setExtensions([{
      name: 'basicConstraints',
      CA: false,
    }, {
      name: 'subjectKeyIdentifier',
    }, {
      name: 'authorityKeyIdentifier',
      keyIdentifier: true,
    }]);
    certificate.sign(ca_key, forge.md.sha256.create());
    return forge.pki.certificateToPem(certificate) + forge.pki.certificateToPem(ca_certificate);
  }
  getCommonName(deviceCertificatePem: string) {
    let device_certificate = forge.pki.certificateFromPem(deviceCertificatePem);
    let field = device_certificate.subject.getField('CN') || {};
    let commonName = field.value || null;
    if (commonName && commonName !== 'Unkown') {
      return commonName;
    } else {
      return null;
    }
  }
}

const keyGenerator = new KeyGenerator();

export { keyGenerator };