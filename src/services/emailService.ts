
export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Sends an email via the backend API using Resend.
   */
  async queueEmail(data: EmailData) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      console.log('Email sent successfully via Resend');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },

  /**
   * Send a confirmation email when a user submits their registration form.
   */
  async sendSubmissionConfirmation(email: string, teamLead: string, moduleTitle: string) {
    await this.queueEmail({
      to: email,
      subject: "Technova '26 - Submission Received 🚀",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 20px; border-radius: 10px;">
          <h1 style="color: #3b82f6;">Submission Received!</h1>
          <p>Hi <b>${teamLead}</b>,</p>
          <p>Thank you for registering for <b>${moduleTitle}</b> at Technova '26.</p>
          <p>We have received your application and payment receipt. Our team is currently verifying the details. You will receive another email once your registration is <b>approved</b>.</p>
          <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6;">
            <b>Status:</b> Pending Review
          </div>
          <p>Best regards,<br>The Technova Team</p>
        </div>
      `
    });
  },

  /**
   * Send an approval email when an admin approves the submission.
   */
  async sendApprovalNotification(email: string, teamLead: string, moduleTitle: string) {
    await this.queueEmail({
      to: email,
      subject: "Technova '26 - Registration Approved! ✅",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 20px; border-radius: 10px;">
          <h1 style="color: #10b981;">Congratulations!</h1>
          <p>Hi <b>${teamLead}</b>,</p>
          <p>Your registration for <b>${moduleTitle}</b> at Technova '26 has been <b>Approved</b>.</p>
          <p>Your participation is now confirmed. We look forward to seeing you at the event!</p>
          <div style="margin: 20px 0; padding: 15px; background: #ecfdf5; border-left: 4px solid #10b981;">
            <b>Status:</b> Confirmed Participant
          </div>
          <p>If you have any further questions, feel free to contact us.</p>
          <p>Best regards,<br>The Technova Team</p>
        </div>
      `
    });
  },

  /**
   * Send a rejection email when an admin rejects the submission.
   */
  async sendRejectionNotification(email: string, teamLead: string, moduleTitle: string, reason?: string) {
    await this.queueEmail({
      to: email,
      subject: "Technova '26 - Registration Update ⚠️",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 20px; border-radius: 10px;">
          <h1 style="color: #ef4444;">Registration Update</h1>
          <p>Hi <b>${teamLead}</b>,</p>
          <p>We are writing to inform you that your registration for <b>${moduleTitle}</b> at Technova '26 has been <b>Rejected</b>.</p>
          <p>This usually happens due to issues with the payment receipt or incomplete member details.</p>
          ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}
          <p>If you believe this is a mistake, please reach out to us with your reference ID.</p>
          <p>Best regards,<br>The Technova Team</p>
        </div>
      `
    });
  }
};

