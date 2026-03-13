import type { Handler, HandlerEvent } from '@netlify/functions';

interface CommissionFormData {
  emailAddress: string;
  fullName: string;
  shippingAddress: string;
  paypalEmail: string;
  communicationMethod: '' | 'Instagram' | 'Email' | 'Other';
  contactHandle: string;
  boardDescription: string;
  buildType: '' | 'Hotswap' | 'Solder';
  keyboardSize: '' | 'Below 60%' | '60–65%' | '75%–TKL' | '1800 or Full Size';
  fRow: '' | 'F12' | 'F13';
  backspace: '' | 'Standard' | 'Split';
  enter: '' | 'ANSI' | 'ISO';
  splitRightShift: boolean;
  splitLeftShift: boolean;
  bottomRow: '' | '7U' | '6.25U';
  winKey: '' | 'WK' | 'WKL';
  switchCount: string;
  switchMods: '' | 'Yes' | 'No';
  includeKeycaps: '' | 'Yes' | 'No';
  inpostTracking: string;
  termsAccepted: boolean;
  additionalComments: string;
}

const FORM_ID = '1FAIpQLSfN5BPtq4PqBY5vq4HIhslT1pBoqcK_VOZBHX8G-trvInolXw';
const FORM_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;
const TERMS_ACCEPTANCE_VALUE =
  'I have read and agree to all Terms and Conditions stated above. I understand they are binding, and it is my responsibility to read them fully before submitting.';

function json(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function appendLayoutOptions(params: URLSearchParams, formData: CommissionFormData) {
  if (formData.fRow === 'F12') params.append('entry.262032242', 'F-Row: F12');
  if (formData.fRow === 'F13') params.append('entry.262032242', 'F-Row: F13');
  if (formData.backspace === 'Standard') params.append('entry.262032242', 'Backspace: Standard');
  if (formData.backspace === 'Split') params.append('entry.262032242', 'Backspace: Split');
  if (formData.enter === 'ANSI') params.append('entry.262032242', 'Enter: ANSI');
  if (formData.enter === 'ISO') params.append('entry.262032242', 'Enter: ISO');
  if (formData.splitRightShift) params.append('entry.262032242', 'Split Right Shift');
  if (formData.splitLeftShift) params.append('entry.262032242', 'Split Left Shift');
  if (formData.bottomRow === '7U') params.append('entry.262032242', 'Bottom Row: 7U Spacebar');
  if (formData.bottomRow === '6.25U') params.append('entry.262032242', 'Bottom Row: 6.25U Spacebar');
  if (formData.winKey === 'WK') params.append('entry.262032242', 'Win Key: WK (Windows Key)');
  if (formData.winKey === 'WKL') params.append('entry.262032242', 'Win Key: WKL (Windows Key-less)');
}

function buildGoogleFormBody(formData: CommissionFormData) {
  const params = new URLSearchParams();

  params.append('emailAddress', formData.emailAddress);
  params.append('entry.632203679', formData.fullName);
  params.append('entry.953846509', formData.shippingAddress);
  params.append('entry.1677500050', formData.paypalEmail);
  params.append('entry.673371819', formData.communicationMethod);
  params.append('entry.870558618', formData.contactHandle);
  params.append('entry.918252436', formData.boardDescription);
  params.append('entry.103391198', formData.buildType);
  params.append('entry.664147544', formData.keyboardSize);

  appendLayoutOptions(params, formData);

  params.append('entry.1338355639', formData.switchCount);
  params.append('entry.483733296', formData.switchMods);
  params.append('entry.1872997171', formData.includeKeycaps);
  params.append('entry.223961881', formData.inpostTracking);
  params.append('entry.1582632785', formData.additionalComments);

  if (formData.termsAccepted) {
    params.append('entry.30082598', TERMS_ACCEPTANCE_VALUE);
  }

  return params;
}

function hasRequiredFields(formData: CommissionFormData) {
  return Boolean(
    formData.emailAddress &&
      formData.fullName &&
      formData.shippingAddress &&
      formData.paypalEmail &&
      formData.communicationMethod &&
      formData.contactHandle &&
      formData.boardDescription &&
      formData.buildType &&
      formData.keyboardSize &&
      formData.switchCount &&
      formData.switchMods &&
      formData.includeKeycaps &&
      formData.backspace &&
      formData.enter &&
      formData.bottomRow &&
      formData.winKey &&
      formData.termsAccepted
  );
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let formData: CommissionFormData;
  try {
    formData = JSON.parse(event.body || '{}') as CommissionFormData;
  } catch {
    return json(400, { error: 'Invalid request body' });
  }

  if (!hasRequiredFields(formData)) {
    return json(400, { error: 'Missing required commission fields' });
  }

  try {
    const response = await fetch(FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: buildGoogleFormBody(formData).toString(),
      redirect: 'manual',
    });

    if (response.status >= 200 && response.status < 400) {
      return json(200, { success: true });
    }

    return json(502, {
      error: `Commission form rejected the submission (${response.status})`,
    });
  } catch (error) {
    console.error('Commission submission failed:', error);
    return json(500, { error: 'Failed to submit commission request' });
  }
};
