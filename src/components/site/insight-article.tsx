import { CtaBanner, PageHero, SectionNumber } from "@/components/site/sections";
import type { Cta, InsightBlock, InsightSection, Post } from "@/lib/content-types";
import { formatDate } from "@/lib/format";

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-body text-ink-soft">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Points({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="rounded-3xl bg-surface p-6">
          <h3 className="text-title">{item.title}</h3>
          <p className="text-body mt-3 text-ink-soft">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

function Stats({ items, caption }: { items: { value: string; label: string }[]; caption?: string }) {
  return (
    <figure>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-8 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dd className="font-heading text-[2rem] leading-[0.95] heading-type md:text-[2.75rem]">{item.value}</dd>
            <dt className="text-body mt-2 text-ink-soft">{item.label}</dt>
          </div>
        ))}
      </dl>
      {caption ? <figcaption className="mt-6 max-w-3xl text-sm text-ink-faint">{caption}</figcaption> : null}
    </figure>
  );
}

function Table({ columns, rows, caption }: { columns: string[]; rows: string[][]; caption?: string }) {
  return (
    <figure>
      {caption ? <figcaption className="label mb-4 max-w-3xl text-ink-faint">{caption}</figcaption> : null}
      <div className="hidden overflow-hidden rounded-2xl ring-1 ring-line lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-ink-faint">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("|")} className="border-t border-line">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top text-ink-soft">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 lg:hidden">
        {rows.map((row) => (
          <li key={row.join("|")} className="rounded-2xl bg-surface p-4">
            {row.map((cell, cellIndex) => (
              <p key={`${cell}-${cellIndex}`} className="mt-3 first:mt-0">
                <span className="label text-ink-faint">{columns[cellIndex]}</span>
                <span className="text-body mt-1 block">{cell}</span>
              </p>
            ))}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function Steps({ items }: { items: { label: string; title: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="rounded-3xl bg-surface p-6">
          <p className="label text-ink-faint">{item.label}</p>
          <h3 className="text-title mt-4">{item.title}</h3>
          <p className="text-body mt-3 text-ink-soft">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <aside className="max-w-3xl rounded-2xl bg-surface p-6 ring-1 ring-line">
      <h3 className="label text-ink-faint">{title}</h3>
      <p className="text-body mt-3 text-ink-soft">{text}</p>
    </aside>
  );
}

function Block({ block }: { block: InsightBlock }) {
  switch (block.kind) {
    case "prose":
      return <Prose paragraphs={block.paragraphs} />;
    case "points":
      return <Points items={block.items} />;
    case "stats":
      return <Stats items={block.items} caption={block.caption} />;
    case "table":
      return <Table columns={block.columns} rows={block.rows} caption={block.caption} />;
    case "steps":
      return <Steps items={block.items} />;
    case "note":
      return <Note title={block.title} text={block.text} />;
    default:
      return null;
  }
}

function Section({ section }: { section: InsightSection }) {
  return (
    <section id={section.id} className="scroll-mt-28 border-t border-line pt-12 lg:pt-16">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <SectionNumber>{section.number}</SectionNumber>
        <div>
          <h2 className="text-headline max-w-[18ch] text-balance">{section.title}</h2>
          {section.lead ? <p className="text-lede mt-4 max-w-[52ch] text-ink-soft">{section.lead}</p> : null}
        </div>
      </div>
      {section.blocks.length > 0 ? (
        <div className="mt-10 flex flex-col gap-8 lg:mt-12">
          {section.blocks.map((block, index) => (
            <Block key={`${section.id}-${index}`} block={block} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function InsightArticle({ post, index, cta }: { post: Post; index: number; cta: Cta }) {
  const hasPaper = Boolean(post.sections?.length);
  return (
    <>
      <PageHero
        file="posts"
        path={post.hero ? `items.${index}.hero` : "hero"}
        eyebrow={post.kicker || post.category}
        title={post.title}
        text={post.excerpt}
        backgroundImage={post.hero?.backgroundImage ?? { src: "", alt: "" }}
        actions={
          hasPaper
            ? [
                { label: "Read the paper", href: "#summary" },
                { label: "Start a conversation", href: "/contact", variant: "arrow" },
              ]
            : [{ label: "Start a conversation", href: "/contact" }]
        }
        field="torus"
      />

      <article className="container-site flex flex-col gap-16 pt-32 pb-8 lg:gap-20 lg:pt-48">
        <div className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-faint">
          <span>{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.author ? <span>{post.author}</span> : null}
        </div>

        {hasPaper ? (
          post.sections?.map((section) => <Section key={section.id} section={section} />)
        ) : (
          <div className="lg:ml-auto lg:w-2/3">
            <Prose paragraphs={post.body} />
          </div>
        )}
      </article>

      <CtaBanner cta={cta} file="insights" />
    </>
  );
}
