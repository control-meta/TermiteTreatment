import os from 'os';
import qrcode from 'qrcode-terminal';

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const localIps = getLocalIpAddresses();
const port = process.env.PORT || '3000';

if (!globalThis.__NEXT_QR_LOGGED && localIps.length > 0 && process.env.NODE_ENV !== 'production') {
  globalThis.__NEXT_QR_LOGGED = true;
  const primaryIp = localIps[0];
  const previewUrl = `http://${primaryIp}:${port}`;

  console.log('\n' + '='.repeat(48));
  console.log(`📱 \x1b[1;32mPhone Preview URL:\x1b[0m \x1b[1;36m${previewUrl}\x1b[0m`);
  console.log('   Scan this QR code with your phone camera:');
  qrcode.generate(previewUrl, { small: true });
  console.log('='.repeat(48) + '\n');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    ...localIps,
    ...localIps.map((ip) => `${ip}:${port}`),
    ...localIps.map((ip) => `${ip}:3000`),
    ...localIps.map((ip) => `${ip}:3001`),
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
