package com.hirevibe.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@Slf4j
public class EmailService {

    private final WebClient webClient;

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${RESEND_API_URL:https://api.resend.com/emails}")
    private String resendApiUrl;

    @Value("${MAIL_FROM_ADDRESS}")
    private String fromAddress;

    @Value("${MAIL_HR_RECIPIENT}")
    private String hrRecipient;

    @Value("${APP_FRONTEND_URL:https://hirevibe.in}")
    private String websiteUrl;

    private static final String LOGO_URL =
            "https://hirevibe.in/hirevibe-logo-transparent.png";

    public EmailService(
            WebClient.Builder webClientBuilder
    ) {
        this.webClient = webClientBuilder.build();
    }


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

        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.error(
                    "Skipping email because RESEND_API_KEY is not configured."
            );
            return false;
        }

        if (fromAddress == null || fromAddress.isBlank()) {
            log.error(
                    "Skipping email because MAIL_FROM_ADDRESS is not configured."
            );
            return false;
        }

        try {
            String htmlBody = buildHtmlEmail(body);

            Map<String, Object> requestBody = Map.of(
                    "from", fromAddress,
                    "to", to,
                    "subject", subject,
                    "html", htmlBody,
                    "text", body
            );

            String response = webClient
                    .post()
                    .uri(resendApiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header(
                            "Authorization",
                            "Bearer " + resendApiKey
                    )
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info(
                    "Email sent successfully to {} with subject '{}'. Provider response: {}",
                    to,
                    subject,
                    response
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


    private String buildHtmlEmail(String body) {

        String formattedBody = escapeHtml(body)
                .replace("\r\n", "\n")
                .replace("\n\n", "</p><p>")
                .replace("\n", "<br>");

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                    <title>HireVibe Consultants</title>
                </head>

                <body style="
                    margin:0;
                    padding:0;
                    background:#f5f7fa;
                    font-family:Arial,Helvetica,sans-serif;
                    color:#1f2937;
                ">

                    <table
                        width="100%%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background:#f5f7fa;padding:32px 16px;"
                    >
                        <tr>
                            <td align="center">

                                <table
                                    width="100%%"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    style="
                                        max-width:640px;
                                        background:#ffffff;
                                        border:1px solid #e5e7eb;
                                        border-radius:12px;
                                        overflow:hidden;
                                    "
                                >

                                    <!-- Header -->
                                    <tr>
                                        <td style="
                                            padding:28px 32px;
                                            border-bottom:1px solid #eef0f3;
                                        ">

                                            <img
                                                src="%s"
                                                alt="HireVibe Consultants"
                                                width="170"
                                                style="
                                                    display:block;
                                                    width:170px;
                                                    max-width:100%%;
                                                    height:auto;
                                                    border:0;
                                                "
                                            />

                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="
                                            padding:32px;
                                            font-size:15px;
                                            line-height:1.7;
                                        ">

                                            <p style="
                                                margin:0;
                                            ">
                                                %s
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="
                                            padding:24px 32px 28px;
                                            border-top:1px solid #e5e7eb;
                                            background:#fafbfc;
                                        ">

                                            <p style="
                                                margin:0 0 4px;
                                                font-size:14px;
                                                line-height:1.6;
                                                color:#374151;
                                            ">
                                                Regards,
                                            </p>

                                            <p style="
                                                margin:0;
                                                font-size:15px;
                                                line-height:1.6;
                                                font-weight:600;
                                                color:#111827;
                                            ">
                                                HireVibe Consultants
                                            </p>

                                            <p style="
                                                margin:12px 0 0;
                                                font-size:13px;
                                                line-height:1.6;
                                                color:#6b7280;
                                            ">

                                                <a
                                                    href="%s"
                                                    style="
                                                        color:#374151;
                                                        text-decoration:none;
                                                    "
                                                >
                                                    %s
                                                </a>

                                                <span style="padding:0 8px;">
                                                    |
                                                </span>

                                                <a
                                                    href="mailto:%s"
                                                    style="
                                                        color:#374151;
                                                        text-decoration:none;
                                                    "
                                                >
                                                    %s
                                                </a>

                                            </p>

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
                """.formatted(
                LOGO_URL,
                formattedBody,
                websiteUrl,
                websiteUrl,
                fromAddress,
                fromAddress
        );
    }

    /**
     * Escapes user-provided text before placing it inside HTML.
     */
    private String escapeHtml(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
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
                """.formatted(
                        name,
                        subject,
                        reply
                )
        );
    }
}