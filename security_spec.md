# Security Specification - Technova'26 Admin & Submissions

## 1. Data Invariants
- Submissions must be created with a `pending` status.
- Only Admins can read or update the status of submissions.
- Field `submittedAt` must be a server timestamp.
- Field `status` can only be changed by Admins.
- Users can create submissions if they provide all required fields correctly.

## 2. The "Dirty Dozen" Payloads (Red Team Test)

### T1: Identity Spoofing (Submission)
```json
{
  "email": "attacker@evil.com",
  "status": "approved", // Attempt to self-approve
  "members": [],
  "moduleId": "coding",
  "moduleTitle": "Speed Programming",
  "submittedAt": "2024-01-01T00:00:00Z",
  "totalFee": 500,
  "university": "Evil Uni"
}
```
**Expected Result**: PERMISSION_DENIED (Status must be `pending` on create, and only Admins can set `approved`).

### T2: Admin Escalation
```json
// Attempt to write to /admins/
{
  "email": "attacker@evil.com"
}
```
**Expected Result**: PERMISSION_DENIED (Only existing Admins or System should write to `/admins/`).

### T3: Modification of Immutable Fields
```json
{
  "email": "new-email@uni.edu"
}
```
**Expected Result**: PERMISSION_DENIED (Submissions should be immutable once created for non-admins, except maybe specific status flows).

### T4: Empty Members List
```json
{
  "members": [],
  "moduleId": "coding"
}
```
**Expected Result**: PERMISSION_DENIED (Min 1 member required).

### T5: Invalid Email Format
```json
{
  "email": "not-an-email"
}
```
**Expected Result**: PERMISSION_DENIED (Regex/Format check).

### T6: Large Payload (Denial of Wallet)
```json
{
  "university": "A".repeat(2000)
}
```
**Expected Result**: PERMISSION_DENIED (Size check on strings).

### T7: Status Update Bypass
```json
// Normal user trying to change status from pending to approved
{
  "status": "approved"
}
```
**Expected Result**: PERMISSION_DENIED.

### T8: PII Leak (Unauthorized Read)
**Request**: `get /submissions/someId` as a regular authenticated user who didn't create it.
**Expected Result**: PERMISSION_DENIED.

### T9: Mass Scraping (List Submissions)
**Request**: `list /submissions/` as a regular user.
**Expected Result**: PERMISSION_DENIED.

### T10: Corrupted Member Identity
```json
{
  "members": [{ "fullName": 123 }]
}
```
**Expected Result**: PERMISSION_DENIED (Type check).

### T11: Future/Past Timestamp Spoofing
```json
{
  "submittedAt": "2099-01-01T00:00:00Z"
}
```
**Expected Result**: PERMISSION_DENIED (Must match `request.time`).

### T12: Document ID Injection
**Path**: `/submissions/long-junk-string-with-special-chars-!!@#`
**Expected Result**: PERMISSION_DENIED (ID validation).

## 3. Test Runner (Conceptual)
All the above payloads will be denied by the following `firestore.rules`.
