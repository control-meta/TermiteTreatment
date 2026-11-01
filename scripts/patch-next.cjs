const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../node_modules/next/dist/server/lib/start-server.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  const targetCode = 'const networkHostname = hostname ?? (0, _getnetworkhost.getNetworkHost)((0, _isipv6.isIPv6)(actualHostname) ? \'IPv6\' : \'IPv4\');';
  const replacementCode = `const networkHostname = (!hostname || hostname === '0.0.0.0' || hostname === '::')
                ? (0, _getnetworkhost.getNetworkHost)((0, _isipv6.isIPv6)(actualHostname) ? 'IPv6' : 'IPv4')
                : hostname;`;

  if (content.includes(targetCode)) {
    content = content.replace(targetCode, replacementCode);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✅ Successfully patched Next.js network URL resolution in node_modules.');
  }
}
