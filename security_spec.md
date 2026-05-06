# Security Specification for Technova'26

## Data Invariants
1. A submission must contain at least one member.
2. The `status` field can only be 'pending' upon creation.
3. Only admins can read all submissions.
4. Users cannot modify their submissions after creation (only admins can update status).
5. The `receiptBase64` is required and must be a string.
6. `totalFee` must be a positive number.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to create a submission as 'approved'.
2. **Resource Poisoning**: Create a submission with a 10MB `receiptBase64` string.
3. **State Shortcutting**: Non-admin attempting to update a submission status to 'approved'.
4. **Member Overload**: Submission with 100 members (limit should be 4-5).
5. **Unauthorized Read**: Authenticated non-admin trying to list all submissions.
6. **Malicious ID**: Document ID with junk characters.
7. **Missing Required Field**: Submission without an email.
8. **Invalid Type**: `totalFee` as a string.
9. **Field Injection**: Adding `isVerified: true` to a submission.
10. **Timestamp Manipulation**: Client-provided `createdAt` in the future.
11. **Admin Privilege Escalation**: User trying to create their own admin document.
12. **Submission Deletion**: Non-admin trying to delete a submission.

## Test Runner (Draft)
The tests will verify that these payloads return `PERMISSION_DENIED`.
