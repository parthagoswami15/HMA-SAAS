/**
 * Enum representing different statuses of a consent
 */
export enum ConsentStatus {
  PENDING = 'PENDING',
  GIVEN = 'GIVEN',
  REFUSED = 'REFUSED',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}
