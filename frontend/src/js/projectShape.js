/**
 * Projects come from remote JSON that has had two shapes: an older one with a
 * single long `description`, and the current one with a short `tagline` plus
 * `highlights` bullets. These readers let the UI use the scannable shape while
 * still rendering an older feed sensibly.
 */

/** First sentence of a blob of prose, used when only `description` exists. */
const firstSentence = (text) => {
  const match = /^[\s\S]*?[.!?](?=\s|$)/.exec(text || '');
  return match ? match[0].trim() : (text || '').trim();
};

export const projectTagline = (project) =>
  project.tagline || firstSentence(project.description);

export const projectHighlights = (project) =>
  Array.isArray(project.highlights) ? project.highlights : [];

/**
 * What the modal shows under the tagline when there are no highlights: the
 * remainder of the old description, so nothing is duplicated or lost.
 */
export const projectRemainder = (project) => {
  if (project.tagline || !project.description) return '';
  const rest = project.description.slice(firstSentence(project.description).length);
  return rest.trim();
};
