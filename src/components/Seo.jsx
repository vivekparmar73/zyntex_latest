// React 19 hoists <title>, <meta> and <link> rendered anywhere into <head>.
export default function Seo({ title, description, path = '/' }) {
  const fullTitle = title ? `${title} | Zyntex` : 'Zyntex | Apparel Manufacturing & Integrated Systems';
  const url = `https://zyntex.in${path}`;
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </>
  );
}
