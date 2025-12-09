// ⚠️ TOGGLE THIS FLAG TO ENABLE/DISABLE MOCK DATA
export const USE_MOCK_FILE_DATA = true;

/**
 * Generates a random UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates a random AWS S3 URL
 */
const generateAwsUrl = (fileName: string): string => {
  const bucket = 'vendor-documents';
  const region = 'ap-south-1';
  const randomPath = Math.random().toString(36).substring(7);
  return `https://${bucket}.s3.${region}.amazonaws.com/${randomPath}/${fileName}`;
};

/**
 * Adds mock file data (UUID + URL) to all file fields that EXIST.
 * If a field exists, its value will be REPLACED.
 */
export const addMockFileData = <T extends Record<string, any>>(data: T): T => {
  if (!USE_MOCK_FILE_DATA) {
    return data;
  }

  const mockData: Record<string, any> = { ...data };
  const fieldsModified: string[] = [];

  // Define file field pairs: [idField, urlField, fileName]
  const fileFieldPairs: Array<[string, string, string]> = [
    ['gstCertificateId', 'gstCertificate', 'gst-certificate.pdf'],
    ['panCardId', 'panCard', 'business-pan.pdf'],
    ['registrationCertificateId', 'registrationCertificate', 'business-cert.pdf'],
    ['authorisedPersonPanCardId', 'authorisedPersonPanCard', 'person-pan.pdf'],
    ['authorisedPersonAadharCardId', 'authorisedPersonAadharCard', 'person-aadhar.pdf'],
    ['bankProofDocumentId', 'bankProofDocument', 'bank-proof.pdf'],
  ];

  fileFieldPairs.forEach(([idField, urlField, fileName]) => {
    const hasIdField = idField in mockData;
    const hasUrlField = urlField in mockData;

    // If field exists, override its value
    if (hasIdField) {
      mockData[idField] = generateUUID();
      fieldsModified.push(idField);
      console.log(`🔄 Overwrote UUID for ${idField}:`, mockData[idField]);
    }

    if (hasUrlField) {
      mockData[urlField] = generateAwsUrl(fileName);
      fieldsModified.push(urlField);
      console.log(`🔄 Overwrote URL for ${urlField}:`, mockData[urlField]);
    }
  });

  if (fieldsModified.length > 0) {
    console.log('🔧 [MOCK DATA] Updated file data for fields:', fieldsModified);
  }

  return mockData as T;
};
