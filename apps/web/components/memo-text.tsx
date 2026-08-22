/**
 * The drafting model writes light markdown. Render the bits it actually uses
 * — bold runs, bullet lists, blank-line paragraphs — and nothing else.
 */
function inline(text: string, keyBase: string) {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <strong key={`${keyBase}-b${m.index}`} className="font-semibold">
        {m[1]}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : text;
}

export function MemoText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let para: string[] = [];

  const flushBullets = (key: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={key} className="my-1.5 space-y-1 pl-4">
        {bullets.map((b, i) => (
          <li key={`${key}-${i}`} className="list-disc marker:text-muted-foreground">
            {inline(b, `${key}-${i}`)}
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  const flushPara = (key: string) => {
    if (!para.length) return;
    blocks.push(
      <p key={key} className="my-1.5">
        {inline(para.join(" "), key)}
      </p>,
    );
    para = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) {
      flushBullets(`u${i}`);
      flushPara(`p${i}`);
      return;
    }
    if (/^([-*_])\1{2,}$/.test(line)) {
      flushBullets(`u${i}`);
      flushPara(`p${i}`);
      blocks.push(
        <hr
          key={`r${i}`}
          className="my-3 border-0 border-t"
          style={{ borderColor: "var(--hairline)" }}
        />,
      );
      return;
    }
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      flushBullets(`u${i}`);
      flushPara(`p${i}`);
      blocks.push(
        <p key={`h${i}`} className="mt-3 mb-1 text-[12px] font-semibold">
          {inline(heading[1].replace(/\s*#+\s*$/, ""), `h${i}`)}
        </p>,
      );
      return;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      flushPara(`p${i}`);
      bullets.push(bullet[1]);
      return;
    }
    flushBullets(`u${i}`);
    para.push(line);
  });
  flushBullets("u-end");
  flushPara("p-end");

  return <div className="text-[13px] leading-[1.65] [&>*:first-child]:mt-0">{blocks}</div>;
}
