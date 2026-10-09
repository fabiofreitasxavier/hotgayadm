import assert from "node:assert/strict";
import test from "node:test";
import { toEmbedUrl } from "./add-embed.mjs";

const EMBED = "https://www.xvideos.com/embedframe/abc123";

test("accepts the iframe code from the Embed button", () => {
  const code = '<iframe src="https://www.xvideos.com/embedframe/abc123" frameborder=0 width=510 height=400 scrolling=no allowfullscreen=allowfullscreen></iframe>';
  assert.equal(toEmbedUrl(code), EMBED);
});

test("accepts protocol-relative iframe src", () => {
  assert.equal(toEmbedUrl('<iframe src="//www.xvideos.com/embedframe/abc123"></iframe>'), EMBED);
});

test("accepts the embedframe URL itself", () => {
  assert.equal(toEmbedUrl(`${EMBED}/`), EMBED);
});

test("converts numeric and dotted page links", () => {
  assert.equal(toEmbedUrl("https://www.xvideos.com/video12345678/some_title"), "https://www.xvideos.com/embedframe/12345678");
  assert.equal(toEmbedUrl("https://xvideos.com/video.abc123/some_title"), EMBED);
});

test("rejects other hosts and junk", () => {
  assert.throws(() => toEmbedUrl("https://evil.example/embedframe/abc123"), /Only xvideos\.com/);
  assert.throws(() => toEmbedUrl("https://www.xvideos.com.evil.example/video123/x"), /Only xvideos\.com/);
  assert.throws(() => toEmbedUrl("not a link"), /Not a link/);
  assert.throws(() => toEmbedUrl("https://www.xvideos.com/tags/x"), /video id/);
});
