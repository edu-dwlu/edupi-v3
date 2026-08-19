export default async function handler(req, res) {
  const { id1, id2, id3 } = req.query;

  if (!id1 || !id2 || !id3) {
    return res.status(400).json({ error: 'Missing required ID parameters' });
  }

  const endpoint = `https://play.edustream.qzz.io/api/public/s/y124xkpxpvrg6t96f2yq0qxly26h574lr648rrd7njsf36pfyzy99ysvq38z2g38rndb/api/v2/get-signedurl/${id1}/${id2}/${id3}`;

  try {
    const upstreamResponse = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({ 
        error: `Upstream error: ${upstreamResponse.statusText}` 
      });
    }

    const data = await upstreamResponse.json();

    // Cache the signed URL response at the edge for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stream details', details: error.message });
  }
}
