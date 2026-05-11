import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
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
  async sendSubmissionConfirmation(userEmail: string, userName: string, moduleTitle: string) {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn('EmailJS not configured. Skipping email confirmation.');
      return;
    }

    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        module_name: moduleTitle,
        reply_to: 'technova@iobm.edu.pk', // Add your official contact email here
      };

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('Email sent successfully:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },

  /**
   * Sends an approval email to the user.
   */
  async sendApprovalNotification(userEmail: string, userName: string, moduleTitle: string) {
    if (!SERVICE_ID || !PUBLIC_KEY) return;
    
    // You should create a separate template for approval or use logic in your EmailJS template
    // For now, we'll assume there's a template for this. 
    // In actual use, user might need multiple templates.
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        module_name: moduleTitle,
        status: 'Approved',
        message: 'Your registration has been verified and approved. Welcome to Technova \'26!',
      };
      
      // If you have a specific template ID for approvals, use it here. 
      // Otherwise we can use the same one if it handles status.
      return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }
  },

  /**
   * Sends a rejection email to the user.
   */
  async sendRejectionNotification(userEmail: string, userName: string, moduleTitle: string) {
    if (!SERVICE_ID || !PUBLIC_KEY) return;

    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        module_name: moduleTitle,
        status: 'Rejected',
        message: 'Unfortunately, your registration could not be verified. This usually happens if the payment receipt is invalid or unclear. Please contact our support team for more details.',
      };
      
      return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to send rejection email:', error);
    }
  }
};
