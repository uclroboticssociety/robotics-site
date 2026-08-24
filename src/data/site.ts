/**
 * Site-wide state the committee is expected to update, kept in one place.
 *
 * `session` and `registrationOpen` drive the status pill in the home hero.
 * Change them here and the pill text changes everywhere it appears — there is
 * no hardcoded copy anywhere else.
 */
export const site = {
  /** Academic session, e.g. "2026/27". */
  session: "2026/27",

  /** Set to false out of season; the pill then reads "Registration closed". */
  registrationOpen: true,

  /** Where "Join the society" points. */
  joinUrl: "/join",

  /**
   * The society's inbox. Every page that offers an email address reads it from
   * here - sponsorship, membership, conduct reports and privacy requests all
   * land in the same place. It used to be hardcoded on each of those pages,
   * which is how four of them were left pointing at a retired address after
   * the contact page alone was updated.
   */
  contactEmail: "ucl.robotics.society@gmail.com",
};

export const statusPillText = () =>
  `Session ${site.session} - ${site.registrationOpen ? "Registration open" : "Registration closed"}`;
