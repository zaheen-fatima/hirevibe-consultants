package com.hirevibe.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${MAIL_FROM_ADDRESS}")
    private String fromAddress;

    @Value("${MAIL_HR_RECIPIENT}")
    private String hrRecipient;

    /**
     * Sends a plain-text email.
     *
     * Email delivery failures are logged and do not cause an already
     * persisted business operation to fail or roll back.
     */
    public boolean sendEmail(
            String to,
            String subject,
            String body
    ) {
        if (to == null || to.isBlank()) {
            log.warn(
                    "Skipping email because recipient address is empty."
            );
            return false;
        }

        try {
            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info(
                    "Email sent successfully to {} with subject '{}'",
                    to,
                    subject
            );

            return true;

        } catch (RuntimeException exception) {
            log.error(
                    "Failed to send email to {} with subject '{}'",
                    to,
                    subject,
                    exception
            );

            return false;
        }
    }

    public void sendContactReceived(
            String recipient,
            String name,
            String subject
    ) {
        sendEmail(
                recipient,
                "We received your message — HireVibe Consultants",
                """
                Hello %s,

                Thank you for contacting HireVibe Consultants.

                We have received your message regarding:

                %s

                Our team will review your message and get back to you as appropriate.

                Regards,
                HireVibe Consultants
                """.formatted(
                        name,
                        subject
                )
        );
    }

    public void sendInquiryReceived(
            String recipient,
            String name,
            String subject
    ) {
        sendEmail(
                recipient,
                "We received your recruitment enquiry — HireVibe Consultants",
                """
                Hello %s,

                Thank you for reaching out to HireVibe Consultants regarding your recruitment requirement.

                We have received your enquiry:

                %s

                Our recruitment team will review the details and get back to you.

                Regards,
                HireVibe Consultants
                """.formatted(
                        name,
                        subject
                )
        );
    }

    public void sendApplicationReceived(
            String recipient,
            String name,
            String jobTitle
    ) {
        sendEmail(
                recipient,
                "Application received — HireVibe Consultants",
                """
                Hello %s,

                Thank you for applying for the position:

                %s

                Your application has been received successfully.

                Our recruitment team will review your application and contact you if your profile is shortlisted for the next stage.

                Regards,
                HireVibe Consultants
                """.formatted(
                        name,
                        jobTitle
                )
        );
    }

    public void notifyHrContact(
            String name,
            String email,
            String phone,
            String subject,
            String message
    ) {
        sendEmail(
                hrRecipient,
                "New website contact — HireVibe Consultants",
                """
                A new contact message has been submitted through the HireVibe website.

                Name: %s
                Email: %s
                Phone: %s
                Subject: %s

                Message:
                %s
                """.formatted(
                        name,
                        email,
                        phone,
                        subject,
                        message
                )
        );
    }

    public void notifyHrInquiry(
            String name,
            String email,
            String phone,
            String subject,
            String message
    ) {
        sendEmail(
                hrRecipient,
                "New recruitment enquiry — HireVibe Consultants",
                """
                A new recruitment/business enquiry has been submitted through the HireVibe website.

                Name: %s
                Email: %s
                Phone: %s
                Subject: %s

                Message:
                %s
                """.formatted(
                        name,
                        email,
                        phone,
                        subject,
                        message
                )
        );
    }

    public void notifyHrApplication(
            Long applicationId,
            String name,
            String email,
            String phone,
            String qualification,
            String jobTitle
    ) {
        sendEmail(
                hrRecipient,
                "New job application — HireVibe Consultants",
                """
                A new job application has been submitted through the HireVibe website.

                Application ID: %s
                Candidate: %s
                Email: %s
                Phone: %s
                Qualification: %s
                Position: %s

                Please review the application in the HireVibe admin portal.
                """.formatted(
                        applicationId,
                        name,
                        email,
                        phone,
                        qualification,
                        jobTitle
                )
        );
    }

    public void sendContactReply(
            String recipient,
            String name,
            String subject,
            String reply
    ) {
        sendEmail(
                recipient,
                "Response from HireVibe Consultants",
                """
                Hello %s,

                Thank you for contacting HireVibe Consultants.

                Regarding:
                %s

                Our response:

                %s

                Regards,
                HireVibe Consultants
                """.formatted(
                        name,
                        subject,
                        reply
                )
        );
    }

    public void sendInquiryReply(
            String recipient,
            String name,
            String subject,
            String reply
    ) {
        sendEmail(
                recipient,
                "Response from HireVibe Consultants",
                """
                Hello %s,

                Thank you for reaching out to HireVibe Consultants.

                Regarding:
                %s

                Our response:

                %s

                Regards,
                HireVibe Consultants
                """.formatted(
                        name,
                        subject,
                        reply
                )
        );
    }
}