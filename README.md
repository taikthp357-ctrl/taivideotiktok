# TaiVideoTikTok (MVP)

MVP web checker cho TikTok/Douyin/YouTube URL với định hướng an toàn pháp lý và ads policy.

## Nguyên tắc
- Không lưu video.
- Không lưu URL gốc lâu dài.
- Không proxy hoặc tải video qua server.
- YouTube mặc định chỉ metadata/embed.

## Tech stack
- Astro
- TypeScript
- Vanilla CSS

## Chạy local
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## ENV
Sao chép `.env.example` thành `.env` và cấu hình theo hạ tầng.

## Deploy
- Vercel/Cloudflare Pages: dùng mode server để giữ API route.
- GitHub Pages (static): cần tách `/api/resolve` thành serverless endpoint riêng.
