import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const APPROVAL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE_ID || TEMPLATE_ID;
const REJECTION_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_REJECTION_TEMPLATE_ID || TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
  /**
   * Initializes EmailJS with the public key.
   */
  init() {
    if (PUBLIC_KEY) {
      emailjs.init(PUBLIC_KEY);
    }
  },

  /**
   * Sends a confirmation email to the user after registration.
   */
  async sendSubmissionConfirmation(userEmail: string, userName: string, moduleTitle: string, extraData?: {
    moduleType?: string;
    feeAmount?: string;
    university?: string;
    membersList?: string;
    participantId?: string;
  }) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn('EmailJS not configured. Skipping email confirmation.');
      return;
    }

    try {
      const templateParams = {
        // We provide multiple common aliases to be safe
        to_email: userEmail,
        user_email: userEmail,
        email: userEmail, 
        
        participant_name: userName,
        to_name: userName, // Alias
        
        participant_id: extraData?.participantId || 'N/A',
        id: extraData?.participantId || 'N/A', // Alias
        
        module_name: moduleTitle,
        module_type: extraData?.moduleType || 'Competition',
        fee_amount: extraData?.feeAmount || 'Verified via Receipt',
        university: extraData?.university || 'N/A',
        members_list: extraData?.membersList || userName,
        reply_to: 'technova@iobm.edu.pk',
      };

      console.group('📧 EmailJS Submission');
      console.log('Target Email:', userEmail);
      console.log('Template ID:', TEMPLATE_ID);
      console.log('Params:', templateParams);
      console.groupEnd();

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('✅ Email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  },

  /**
   * Sends an approval email to the user.
   */
  async sendApprovalNotification(userEmail: string, userName: string, moduleTitle: string, participantId?: string, extraData?: {
    moduleType?: string;
    feeAmount?: string;
    membersList?: string;
  }) {
    if (!SERVICE_ID || !PUBLIC_KEY || !APPROVAL_TEMPLATE_ID) return;
    
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        participant_name: userName,
        
        participant_id: participantId || 'N/A',
        id: participantId || 'N/A',
        
        module_name: moduleTitle,
        module_type: extraData?.moduleType || 'Competition',
        
        fee_amount: extraData?.feeAmount || 'Verified',
        members_list: extraData?.membersList || userName,
        
        status: 'Approved',
        message: 'Your registration has been verified and approved. Welcome to Technova \'26!',
        reply_to: 'technova@iobm.edu.pk',
      };
      
      console.group('📧 EmailJS Approval');
      console.log('Target Email:', userEmail);
      console.log('Template ID:', APPROVAL_TEMPLATE_ID);
      console.log('Params:', templateParams);
      console.groupEnd();

      return await emailjs.send(SERVICE_ID, APPROVAL_TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  },

  /**
   * Sends a rejection email to the user.
   */
  async sendRejectionNotification(userEmail: string, userName: string, moduleTitle: string, participantId?: string) {
    if (!SERVICE_ID || !PUBLIC_KEY || !REJECTION_TEMPLATE_ID) return;

    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        participant_name: userName, // Alias
        module_name: moduleTitle,
        participant_id: participantId || 'N/A',
        status: 'Rejected',
        message: 'Unfortunately, your registration could not be verified. This usually happens if the payment receipt is invalid or unclear. Please contact our support team for more details.',
      };
      
      return await emailjs.send(SERVICE_ID, REJECTION_TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }
  }
};
