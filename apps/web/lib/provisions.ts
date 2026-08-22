/**
 * The DORA Article 30 checklist, mirrored for display.
 *
 * Static reference data — article numbers and their plain-English meaning.
 * The engine's copy in `apps/engine/covenant/dora.py` is authoritative for
 * what gets assessed; this is what the register calls each provision.
 */
export type ProvisionSpec = {
  key: string;
  article: string;
  label: string;
  plain: string;
  critical: boolean;
  blocking: boolean;
};

export const PROVISIONS: ProvisionSpec[] = [
  { key: "service_description", article: "30(2)(a)", label: "Clear description of the services", plain: "What the supplier actually does, and whether it may hand work to someone else.", critical: false, blocking: false },
  { key: "locations_disclosed", article: "30(2)(b)", label: "Service and data locations disclosed", plain: "Which countries the work happens in and the data sits in — and notice before that moves.", critical: false, blocking: false },
  { key: "data_protection", article: "30(2)(c)", label: "Availability, integrity and confidentiality", plain: "The supplier has to keep the bank's data intact, private and reachable.", critical: false, blocking: false },
  { key: "data_return", article: "30(2)(d)", label: "Access, recovery and return of data", plain: "The bank can get its data back, in a usable format, even if the supplier fails.", critical: false, blocking: true },
  { key: "service_levels", article: "30(2)(e)", label: "Service level descriptions", plain: "What good service means, written down and kept current.", critical: false, blocking: false },
  { key: "incident_assistance", article: "30(2)(f)", label: "Assistance on ICT incidents", plain: "When something breaks, the supplier helps — at no cost or a price agreed in advance.", critical: false, blocking: false },
  { key: "authority_cooperation", article: "30(2)(g)", label: "Cooperation with competent authorities", plain: "The regulator can reach the supplier, not just the bank.", critical: false, blocking: false },
  { key: "termination_rights", article: "30(2)(h)", label: "Termination rights and notice periods", plain: "The bank can walk away, and knows how much notice that takes.", critical: false, blocking: false },
  { key: "security_training", article: "30(2)(i)", label: "Security awareness participation", plain: "Supplier staff take part in the bank's security training.", critical: false, blocking: false },
  { key: "performance_targets", article: "30(3)(a)", label: "Quantitative performance targets", plain: "Numbers you can hold the supplier to, not adjectives.", critical: true, blocking: false },
  { key: "provider_reporting", article: "30(3)(b)", label: "Notice periods and reporting to the bank", plain: "The supplier tells the bank when something is going wrong, promptly.", critical: true, blocking: false },
  { key: "contingency_plans", article: "30(3)(c)", label: "Contingency plans and security measures", plain: "The supplier has a tested plan for its own failure.", critical: true, blocking: false },
  { key: "tlpt_cooperation", article: "30(3)(d)", label: "Participation in threat-led penetration testing", plain: "The bank can attack the supplier's live systems as part of its own testing.", critical: true, blocking: false },
  { key: "audit_rights", article: "30(3)(e)", label: "Unrestricted access, inspection and audit", plain: "The bank, its auditors and the regulator can look inside — without limits on how often.", critical: true, blocking: true },
  { key: "exit_strategy", article: "30(3)(f)", label: "Exit strategy and transition period", plain: "The supplier must keep the lights on while the bank moves the service elsewhere or brings it in-house.", critical: true, blocking: true },
];

export const PROVISION_BY_KEY = new Map(PROVISIONS.map((p) => [p.key, p]));

export function provisionsFor(critical: boolean) {
  return critical ? PROVISIONS : PROVISIONS.filter((p) => !p.critical);
}
