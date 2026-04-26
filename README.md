# TaiVideoTikTok

Website MVP cho công cụ xử lý link TikTok theo hướng an toàn, hợp lệ và dễ mở rộng.

## Mục tiêu

- Cho người dùng nhập link TikTok.
- Kiểm tra định dạng link phía client.
- Hiển thị trạng thái xử lý rõ ràng.
- Chuẩn bị sẵn điểm nối backend `/api/resolve` cho giai đoạn sau.
- Có thông báo quyền sử dụng nội dung trước khi xử lý.

## Ranh giới an toàn

Dự án này không triển khai cơ chế vượt bảo vệ, tải trái phép, hoặc gỡ watermark/logo khỏi nội dung mà người dùng không có quyền. Backend sau này chỉ nên xử lý:

- Video do người dùng sở hữu.
- Video được cấp phép rõ ràng.
- Video hoặc file do người dùng tự tải lên hợp lệ.
- Nguồn API hợp lệ theo điều khoản của nền tảng.

## Cấu trúc thư mục

```text
.
├── index.html
├── terms.html
├── assets/
│   ├── css/style.css
│   └── js/app.js
├── data/
│   └── posts.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── LEGAL.md
├── .gitignore
└── README.md
```

## Chạy local

Mở trực tiếp file `index.html` bằng trình duyệt hoặc dùng extension Live Server trong VS Code.

## Deploy GitHub Pages

Vào repo GitHub:

```text
Settings → Pages → Deploy from branch → main → /root
```

## Giai đoạn tiếp theo

1. Hoàn thiện UI/UX.
2. Tạo backend `/api/resolve`.
3. Thêm rate limit, captcha, logging.
4. Thêm điều khoản sử dụng và form báo cáo nội dung vi phạm.
5. Chỉ xử lý video khi người dùng có quyền hợp lệ.
