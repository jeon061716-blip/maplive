import https from 'https';

export default async function handler(req, res) {
  const { minX, maxX, minY, maxY } = req.query;
  const apiKey = "38152b3c8b464f699dc6b776329f02b4";

  if (!minX || !maxX || !minY || !maxY) {
    return res.status(400).json({ error: "좌표 값이 누락되었습니다." });
  }

  const itsUrl = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${apiKey}&type=all&cctvType=1&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}&getType=json`;

  try {
    const data = await new Promise((resolve, reject) => {
      const options = {
        rejectUnauthorized: false // SSL 인증서 및 포트 통신 문제 우회
      };

      https.get(itsUrl, options, (apiRes) => {
        let body = '';
        apiRes.on('data', (chunk) => body += chunk);
        apiRes.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error("JSON 파싱 실패: " + body));
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("CCTV 연동 상세 오류:", error);
    return res.status(500).json({ error: error.message });
  }
}