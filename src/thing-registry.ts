import * as fs from 'fs';
import { KeyInformation } from './information';
import { keyGenerator } from './key-generator';

export class ThingRegistry {

  private certsPath: string;

  private rootCaCertificate: string;

  private caCertificate: string;

  private caPrivateKey: string;

  private deviceCsr: string;

  private deviceCertificate: string;

  private devicePublicKey: string;

  private devicePrivateKey: string;

  constructor() {
    this.certsPath = './certs';
    this.rootCaCertificate = 'root_ca.cert.pem';
    this.caCertificate = 'ca.cert.pem';
    this.caPrivateKey = 'ca.private_key.pem';
    this.deviceCsr = 'device.csr';
    this.deviceCertificate = 'device.cert.pem';
    this.devicePublicKey = 'device.public_key.pem';
    this.devicePrivateKey = 'device.private_key.pem';
  }

  setCertsPath(path: string): this {
    this.certsPath = path;
    return this;
  }

  setCACertificateName(name: string): this {
    this.caCertificate = name;
    return this;
  }

  setCAPrivateKeyName(name: string): this {
    this.caPrivateKey = name;
    return this;
  }

  setRootCACertificateName(name: string): this {
    this.rootCaCertificate = name;
    return this;
  }

  setDeviceCsrName(name: string): this {
    this.deviceCsr = name;
    return this;
  }

  setDeviceCertificateName(name: string): this {
    this.deviceCertificate = name;
    return this;
  }

  setDevicePublicKeyName(name: string): this {
    this.devicePublicKey = name;
    return this;
  }

  setDevicePrivateKeyName(name: string): this {
    this.devicePrivateKey = name;
    return this;
  }

  generateDeviceCertificate(thingName: string, information?: KeyInformation): boolean {
    if (!this.hasCaCertificateFile) {
      throw `${this.certsPath}/${this.caCertificate} file not founded.`;
    }
    if (!this.hasCaPrivateKeyFile) {
      throw `${this.certsPath}/${this.caPrivateKey} file not founded.`;
    }
    let caCertificatePath = `${this.certsPath}/${this.caCertificate}`;
    let caPrivateKeyPath = `${this.certsPath}/${this.caPrivateKey}`;
    let devicePublicKey: string;
    let devicePrivateKey: string;
    let deviceCsr: string;
    if (fs.existsSync(this.devicePublicKeyPath) && fs.existsSync(this.devicePrivateKeyPath)) {
      if (!fs.existsSync(this.deviceCsrPath)) {
        devicePublicKey = fs.readFileSync(
          this.devicePublicKeyPath,
        ).toString();
        devicePrivateKey = fs.readFileSync(
          this.devicePrivateKeyPath,
        ).toString();
        deviceCsr = keyGenerator.generateDeviceCsr(
          devicePublicKey,
          devicePrivateKey,
          thingName ?? '',
          information,
        );
        fs.writeFileSync(this.deviceCsrPath, deviceCsr);
      } else {
        deviceCsr = fs.readFileSync(
          this.deviceCsrPath,
        ).toString();
      }
    } else {
      let keyPair = keyGenerator.generateDeviceKeyPair();
      deviceCsr = keyGenerator.generateDeviceCsr(keyPair.publicKey, keyPair.privateKey, thingName, information);
      fs.writeFileSync(this.devicePublicKeyPath, keyPair.publicKey);
      fs.writeFileSync(this.devicePrivateKeyPath, keyPair.privateKey);
      fs.writeFileSync(this.deviceCsrPath, deviceCsr);
    }
    let deviceCertificate = keyGenerator.generateDeviceCertificate(caCertificatePath, caPrivateKeyPath, deviceCsr);
    fs.writeFileSync(this.deviceCertificatePath, deviceCertificate);
    return true;
  }

  getThingName(): string {
    let deviceCertificatePem = fs.readFileSync(
      this.deviceCertificatePath,
    ).toString();
    let commonName = keyGenerator.getCommonName(deviceCertificatePem);
    if (commonName) {
      return commonName;
    }
    let lines = deviceCertificatePem.split('\n');
    let base64Pem = Buffer.from(
      lines.slice(1, lines.indexOf('-----END CERTIFICATE-----\r') - 1).toString(),
      'base64',
    ).toString('hex');
    let prefix = '301d0603551d0e04160414';
    return base64Pem.substr(base64Pem.indexOf(prefix) + prefix.length, 40);
  }

  get keysPath(): { [key: string]: string } {
    return {
      keyPath: this.devicePrivateKeyPath,
      certPath: this.deviceCertificatePath,
      caPath: this.rootCACertificatePath,
    };
  }

  get rootCACertificatePath(): string {
    return `${this.certsPath}/${this.rootCaCertificate}`;
  }

  get caCertificatePath(): string {
    return `${this.certsPath}/${this.caCertificate}`;
  }

  get caPrivateKeyPath(): string {
    return `${this.certsPath}/${this.caPrivateKey}`;
  }

  get deviceCertificatePath(): string {
    return `${this.certsPath}/${this.deviceCertificate}`;
  }

  get deviceCsrPath(): string {
    return `${this.certsPath}/${this.deviceCsr}`;
  }

  get devicePublicKeyPath(): string {
    return `${this.certsPath}/${this.devicePublicKey}`;
  }

  get devicePrivateKeyPath(): string {
    return `${this.certsPath}/${this.devicePrivateKey}`;
  }

  get hasRootCACertificateFile(): Boolean {
    return fs.existsSync(this.rootCACertificatePath);
  }

  get hasCaCertificateFile(): Boolean {
    return fs.existsSync(this.caCertificatePath);
  }

  get hasCaPrivateKeyFile(): Boolean {
    return fs.existsSync(this.caPrivateKeyPath);
  }

  get hasDeviceCertificate(): Boolean {
    return fs.existsSync(this.deviceCertificatePath);
  }
};