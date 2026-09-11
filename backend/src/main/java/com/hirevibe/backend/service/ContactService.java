package com.hirevibe.backend.service;

import com.hirevibe.backend.common.exception.ResourceNotFoundException;
import com.hirevibe.backend.dto.audit.ContactAuditSnapshot;
import com.hirevibe.backend.dto.contact.ContactResponse;
import com.hirevibe.backend.dto.contact.CreateContactRequest;
import com.hirevibe.backend.dto.contact.ReplyContactRequest;
import com.hirevibe.backend.dto.contact.UpdateContactRequest;
import com.hirevibe.backend.dto.contact.UpdateContactStatusRequest;
import com.hirevibe.backend.entity.AuditAction;
import com.hirevibe.backend.entity.Contact;
import com.hirevibe.backend.entity.ContactStatus;
import com.hirevibe.backend.mapper.ContactMapper;
import com.hirevibe.backend.repository.ContactRepository;
import com.hirevibe.backend.specification.ContactSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    /**
     * Public contact submission.
     */
    @Transactional
    public ContactResponse createContact(
            CreateContactRequest request
    ) {
        Contact contact = Contact.builder()
                .name(normalize(request.getName()))
                .email(normalizeEmail(request.getEmail()))
                .phone(normalize(request.getPhone()))
                .subject(normalize(request.getSubject()))
                .message(normalize(request.getMessage()))
                .status(ContactStatus.NEW)
                .build();

        Contact savedContact =
                contactRepository.save(contact);

        auditLogService.recordCreate(
                AuditAction.CREATE,
                "CONTACT",
                savedContact.getId().toString(),
                "Created contact #" + savedContact.getId(),
                ContactAuditSnapshot.from(savedContact)
        );

        emailService.notifyHrContact(
                savedContact.getName(),
                savedContact.getEmail(),
                savedContact.getPhone(),
                savedContact.getSubject(),
                savedContact.getMessage()
        );

        emailService.sendContactReceived(
                savedContact.getEmail(),
                savedContact.getName(),
                savedContact.getSubject()
        );

        return contactMapper.toResponse(savedContact);
    }

    /**
     * Paginated and filtered contact list.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('CONTACT_READ')")
    public Page<ContactResponse> getContacts(
            String name,
            String email,
            ContactStatus status,
            Pageable pageable
    ) {
        Specification<Contact> specification =
                Specification.allOf(
                        ContactSpecification.hasName(name),
                        ContactSpecification.hasEmail(email),
                        ContactSpecification.hasStatus(status)
                );

        return contactRepository
                .findAll(specification, pageable)
                .map(contactMapper::toResponse);
    }

    /**
     * Retrieves a single contact.
     */
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('CONTACT_READ')")
    public ContactResponse getContact(Long id) {
        return contactMapper.toResponse(
                getContactEntity(id)
        );
    }

    /**
     * Updates contact information.
     */
    @Transactional
    @PreAuthorize("hasAuthority('CONTACT_UPDATE')")
    public ContactResponse updateContact(
            Long id,
            UpdateContactRequest request
    ) {
        Contact contact = getContactEntity(id);

        ContactAuditSnapshot before =
                ContactAuditSnapshot.from(contact);

        contact.setName(
                normalize(request.getName())
        );

        contact.setEmail(
                normalizeEmail(request.getEmail())
        );

        contact.setPhone(
                normalize(request.getPhone())
        );

        contact.setSubject(
                normalize(request.getSubject())
        );

        contact.setMessage(
                normalize(request.getMessage())
        );

        Contact savedContact =
                contactRepository.save(contact);

        auditLogService.recordChange(
                AuditAction.UPDATE,
                "CONTACT",
                savedContact.getId().toString(),
                "Updated contact #" + savedContact.getId(),
                before,
                ContactAuditSnapshot.from(savedContact)
        );

        return contactMapper.toResponse(savedContact);
    }

    /**
     * Changes contact status.
     */
    @Transactional
    @PreAuthorize("hasAuthority('CONTACT_UPDATE')")
    public ContactResponse updateStatus(
            Long id,
            UpdateContactStatusRequest request
    ) {
        Contact contact = getContactEntity(id);

        ContactAuditSnapshot before =
                ContactAuditSnapshot.from(contact);

        contact.setStatus(request.getStatus());

        Contact savedContact =
                contactRepository.save(contact);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "CONTACT",
                savedContact.getId().toString(),
                "Changed contact status for #"
                        + savedContact.getId(),
                before,
                ContactAuditSnapshot.from(savedContact)
        );

        return contactMapper.toResponse(savedContact);
    }

    /**
     * Adds an administrative reply and marks
     * the contact as replied.
     */
    @Transactional
    @PreAuthorize("hasAuthority('CONTACT_UPDATE')")
    public ContactResponse replyContact(
            Long id,
            ReplyContactRequest request
    ) {
        Contact contact = getContactEntity(id);

        ContactAuditSnapshot before =
                ContactAuditSnapshot.from(contact);

        String reply =
                normalize(request.getReply());

        contact.setAdminReply(reply);
        contact.setStatus(ContactStatus.REPLIED);
        contact.setRepliedAt(Instant.now());

        Contact savedContact =
                contactRepository.save(contact);

        auditLogService.recordChange(
                AuditAction.STATUS_CHANGE,
                "CONTACT",
                savedContact.getId().toString(),
                "Replied to contact #" + savedContact.getId(),
                before,
                ContactAuditSnapshot.from(savedContact)
        );

        emailService.sendContactReply(
                savedContact.getEmail(),
                savedContact.getName(),
                savedContact.getSubject(),
                reply
        );

        return contactMapper.toResponse(savedContact);
    }

    /**
     * Permanently deletes a contact.
     */
    @Transactional
    @PreAuthorize("hasAuthority('CONTACT_DELETE')")
    public void deleteContact(Long id) {

        Contact contact =
                getContactEntity(id);

        ContactAuditSnapshot before =
                ContactAuditSnapshot.from(contact);

        contactRepository.delete(contact);

        auditLogService.recordDelete(
                AuditAction.DELETE,
                "CONTACT",
                id.toString(),
                "Deleted contact #" + id,
                before
        );
    }

    /**
     * Internal entity lookup.
     */
    private Contact getContactEntity(Long id) {

        return contactRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Contact not found with ID: " + id
                        )
                );
    }

    private String normalize(String value) {
        return value.trim();
    }

    private String normalizeEmail(String value) {
        return value
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}