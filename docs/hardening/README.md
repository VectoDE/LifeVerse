# Platform Hardening Guide
## Document Control
- **Owner:** Security Engineering Lead
- **Version:** 1.0.0
- **Last Updated:** 2025-02-12
- **Status:** Approved for internal use

## Purpose
This guide enumerates the security baselines, configuration controls, and verification
activities required to harden LifeVerse infrastructure and application deployments.
It applies to build pipelines, runtime environments, and operational tooling across
all regions.

## Scope
- Unreal Engine dedicated servers and container workloads
- Kubernetes, virtual machine, and bare-metal deployments maintained by LifeVerse
- Supporting services including databases, cache clusters, messaging queues, and
  observability stacks
- Corporate endpoints used to access production environments

## Roles & Responsibilities
| Function | Responsibilities |
| --- | --- |
| **Security Engineering** | Curate baseline configurations, update control catalogs, and review exceptions. |
| **Platform Engineering** | Apply hardening baselines to infrastructure-as-code, automate compliance checks, and report drift. |
| **Game & Service Teams** | Ensure application-level settings (logging, auth, secrets) comply with this guide. |
| **Operations (SRE/NOC)** | Monitor adherence, triage deviations, and maintain incident runbooks. |

## Baseline Controls
### Identity & Access Management
- Enforce SSO with phishing-resistant MFA for all privileged identities.
- Implement just-in-time privilege elevation with automatic expiration.
- Rotate service credentials every 90 days or sooner when triggered by risk events.

### Network Security
- Deny-all by default using network security groups, Kubernetes network policies,
  and security group rules.
- Terminate TLS 1.2+ at the edge, forwarding mTLS for internal service-to-service
  communication.
- Require private connectivity for database, cache, and queue tiers.

### Host & Container Hardening
- Base images sourced from LifeVerse-maintained hardened AMIs or OCI images.
- CIS Level 1 benchmarks automated through cloud-init/Ansible profiles.
- Enforce kernel module allow-lists, disable unused services, and lock down shell access.
- Run containers as non-root with read-only root filesystems where feasible.

### Data Protection
- Encrypt all storage using centrally managed KMS keys with rotation every 12 months.
- Apply row-level or field-level encryption for PII and payment data domains.
- Enforce database auditing with immutable storage in the security logging account.

### Application Security
- Block unsigned binaries and enforce code-signing validation during deployment.
- Apply secure default configurations for Unreal dedicated servers (command-line
  whitelists, rate limits, anti-cheat modules).
- Validate configuration through automated integration tests before promoting to staging.

## Automation & Tooling
- Infrastructure-as-code repositories must include OPA/Conftest policies covering
  the controls above.
- CI pipelines execute SAST, SCA, and container scanning with fail gates for
  critical findings.
- Drift detection alerts raise PagerDuty incidents when baselines diverge.
- Centralised dashboards expose compliance posture and remediation SLAs.

## Verification Activities
| Cadence | Activity | Owner |
| --- | --- | --- |
| Per deployment | Preflight configuration scans | Platform Engineering |
| Weekly | Drift and vulnerability review | Security Engineering |
| Quarterly | Penetration testing of representative environments | External partner |
| Annually | Tabletop exercises covering containment and recovery | Security + Operations |

## Exception Management
- Document exceptions in the Security Risk Register with compensating controls and
  expiration dates.
- Exceptions require approval from the Security Engineering Lead and Product VP.
- Expired exceptions trigger automatic revocation and regression testing.

## Incident Response Integration
- Hardening deviations discovered during incidents feed lessons learned and
  updates into this guide.
- Maintain runbooks for containment (isolation, credential rotation, traffic
  filtering) aligned with the Incident Response Plan.

## References
- [Security Policy](../../SECURITY.md)
- [Security Compliance Overview](../compliance/README.md)
- [Risk Management Framework](../RiskManagementDocument.md)
