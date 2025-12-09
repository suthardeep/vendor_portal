/**
 * Mock File Data Utility
 * 
 * This utility generates dummy UUIDs and AWS S3 URLs for testing purposes.
 * 
 * TO ENABLE: Set USE_MOCK_FILE_DATA = true
 * TO DISABLE: Set USE_MOCK_FILE_DATA = false
 */

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
 * Adds mock file data (UUID and URL) to fields that are empty
 * Only runs if USE_MOCK_FILE_DATA is true
 */
export const addMockFileData = <T extends Record<string, any>>(data: T): T => {
  if (!USE_MOCK_FILE_DATA) {
    return data;
  }

  const mockData: Record<string, any> = { ...data };
  const fieldsModified: string[] = [];

  // Define file field pairs (ID field and URL field)
  const fileFieldPairs: Array<[string, string, string]> = [
    ['gstCertificateId', 'gstCertificate', 'gst-certificate.pdf'],
    ['panCardId', 'panCard', 'business-pan.pdf'],
    ['registrationCertificateId', 'registrationCertificate', 'business-cert.pdf'],
    ['authorisedPersonPanCardId', 'authorisedPersonPanCard', 'person-pan.pdf'],
    ['authorisedPersonAadharCardId', 'authorisedPersonAadharCard', 'person-aadhar.pdf'],
    ['bankProofDocumentId', 'bankProofDocument', 'bank-proof.pdf'],
  ];

  fileFieldPairs.forEach(([idField, urlField, fileName]) => {
    // Only add mock data if the field exists in the object and is empty
    if (idField in mockData && (!mockData[idField] || mockData[idField] === '')) {
      mockData[idField] = generateUUID();
      fieldsModified.push(idField);
    }
    if (urlField in mockData && (!mockData[urlField] || mockData[urlField] === '')) {
      mockData[urlField] = generateAwsUrl(fileName);
      fieldsModified.push(urlField);
    }
  });

  if (fieldsModified.length > 0) {
    console.log('🔧 [MOCK DATA] Added mock file data to fields:', fieldsModified);
  }

  return mockData as T;
};
