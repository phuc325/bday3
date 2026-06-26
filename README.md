# Website sinh nhật cho dợ iu 💗


## Cách dễ nhất trên Windows

1. Giải nén toàn bộ file ZIP.
2. Mở thư mục `birthday_love_web`.
3. Nhấp đúp file `CHAY_WEB_WINDOWS.bat`.
4. Lần đầu chạy, máy sẽ tự cài thư viện rồi mở website.
5. Giữ nguyên cửa sổ màu đen trong lúc dùng website.

Nếu Windows hiện cảnh báo SmartScreen, chọn **More info** rồi **Run anyway**.
File này chỉ chạy Python và cài các thư viện trong `requirements.txt`.


Website được làm bằng Python Flask, HTML, CSS và JavaScript.

## Tính năng

- Màn mở đầu "hapi bớt đây dợ iu!!"
- Lời nhắn kỷ niệm 900 ngày (+2 tiếng)
- Chọn nhiều buổi: sáng, trưa, chiều, tối
- Chọn món ăn, nhập món khác hoặc để ank chọn
- Nút bánh tráng bí mật
- Tạo vé hẹn hò
- Lưu lựa chọn vào `data/submissions.jsonl`
- Trang bí mật có khóa để ank xem kết quả
- Màn chúc sinh nhật cuối, hiệu ứng tim bay
- Nút sao chép vé để gửi lại cho ank
- Giao diện ưu tiên điện thoại

## Chạy trên máy

Cần cài Python 3.10 trở lên.

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Mở trình duyệt tại:

```text
http://127.0.0.1:5000
```

### macOS hoặc Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Xem câu trả lời đã gửi

Khi chạy trên máy, mở:

```text
http://127.0.0.1:5000/ank-xem-ket-qua?key=doi-key-nay-truoc-khi-deploy
```

Khóa mặc định chỉ dành cho lúc thử trên máy. Trước khi triển khai, hãy đặt biến
môi trường `ADMIN_KEY` thành một chuỗi riêng mà người yêu không đoán được.

Ví dụ:

```text
ADMIN_KEY=mot-khoa-bi-mat-rat-dai-2706
```

Sau đó trang xem kết quả sẽ là:

```text
https://ten-web-cua-ban.onrender.com/ank-xem-ket-qua?key=mot-khoa-bi-mat-rat-dai-2706
```

Dữ liệu thô cũng nằm ở:

```text
data/submissions.jsonl
```

## Đưa lên Render

1. Tạo tài khoản GitHub.
2. Tạo repository mới và tải toàn bộ thư mục này lên.
3. Vào Render, chọn **New > Blueprint**.
4. Kết nối repository.
5. Render yêu cầu nhập giá trị cho `ADMIN_KEY`. Hãy dùng một khóa bí mật dài.
6. Render đọc file `render.yaml` và tự triển khai.
7. Sau khi xong, gửi đường link trang chủ cho người yêu. Giữ đường link trang kết quả cho riêng bạn.

Dữ liệu lưu vào file trên Render có thể mất khi dịch vụ khởi động lại.
Với một lần chốt kèo sinh nhật thường vẫn đủ dùng, nhưng cách chắc chắn hơn
là tích hợp Telegram, Google Sheets hoặc cơ sở dữ liệu.

## Chỉnh nội dung

- Nội dung và các màn hình: `templates/index.html`
- Màu sắc, hiệu ứng và giao diện: `static/style.css`
- Logic nút bấm và gửi dữ liệu: `static/script.js`
- Backend Python: `app.py`

## Thêm nhạc nền

Đặt file nhạc vào:

```text
static/music.mp3
```

Sau đó thêm thẻ sau ngay trước `</body>` trong `templates/index.html`:

```html
<audio id="bg-music" loop>
    <source src="{{ url_for('static', filename='music.mp3') }}" type="audio/mpeg">
</audio>
```

Trình duyệt thường chặn nhạc tự chạy. Cách tử tế hơn là phát nhạc sau khi cô ấy
bấm nút `OMG!`, thay vì tấn công tai người dùng ngay khi trang vừa mở.
