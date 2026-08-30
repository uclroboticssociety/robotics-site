import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";

/**
 * Markdown rendering for content bodies.
 *
 * The content files are .md, but Astro's glob loader only parses their
 * frontmatter - the body arrives as a raw string. This used to be handed to a
 * hand-written parser in the [...slug] pages that understood six constructs and
 * printed everything else as literal characters, which is why links, italics,
 * numbered lists and tables did nothing in a file that says Markdown.
 *
 * This is the processor Astro itself uses for .md files, so what an author
 * writes now behaves the way Markdown behaves everywhere else. It ships as a
 * dependency of astro - nothing new was installed for it.
 *
 * The /!!! ... !!!/ blocks and the [picture]/[scroll]/[pdf]/[space] markers are
 * unaffected: the pages strip every marker out before any text reaches here, so
 * the two syntaxes never meet. That ordering matters. A [scroll](...) marker
 * that leaked through would be read as a Markdown link and come out as
 * <a href="%5Bpicture%5D...">scroll</a>.
 */

// One processor per build, not per page. Astro runs page frontmatter once per
// page, so building it at call time would spin the whole pipeline up 19 times.
let processorPromise: ReturnType<typeof createSatteriMarkdownProcessor> | undefined;

const getProcessor = () =>
  (processorPromise ??= createSatteriMarkdownProcessor({
    // Code fences render as plain <pre><code>. Shiki would pull its grammars
    // into every build, including the many with no code in them at all.
    syntaxHighlight: false,
  }));

export const renderBlockMarkdown = async (text: string) => {
  const { code } = await (await getProcessor()).render(text);
  // Both # and ## land on h2. The page title is already the page's only h1
  // (docs/DESIGN.md section 8), so a body heading must never produce a second
  // one. Done as a string replace rather than a rehype plugin because it reads
  // plainly and it also catches a literal <h1> typed as raw HTML, which meant
  // the same thing. Heading id attributes pass through untouched.
  return (
    code
      .replace(/<(\/?)h1(\s|>)/g, "<$1h2$2")
      // Give each table its own scroll lane, so a wide one scrolls inside
      // itself instead of making the whole article scroll sideways on a phone.
      // Markdown cannot nest tables, so the pairing is always one to one.
      .replace(/<table>/g, '<div class="table-scroll"><table>')
      .replace(/<\/table>/g, "</table></div>")
  );
};
