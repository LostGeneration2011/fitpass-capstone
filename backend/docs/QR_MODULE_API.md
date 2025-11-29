# **QR ATTENDANCE MODULE API DOCUMENTATION**

## **Overview**
Hệ thống điểm danh QR Code cho phép:
- Giáo viên bắt đầu session và tạo QR code
- Học sinh quét QR để điểm danh
- Real-time updates qua WebSocket

---

## **🔐 Authentication**
Tất cả endpoints cần JWT token trong header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## **📡 WebSocket Connection**

### **Connection**
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### **Events**

#### **Client → Server**
```javascript
// Tham gia session room
socket.emit('join_session', { sessionId: 'session_id' });

// Rời session room  
socket.emit('leave_session', { sessionId: 'session_id' });

// Lấy danh sách attendance hiện tại (teacher only)
socket.emit('get_session_attendance', { sessionId: 'session_id' });
```

#### **Server → Client**
```javascript
// Thông báo đã tham gia session
socket.on('joined_session', (data) => {
  console.log('Joined session:', data.sessionId);
});

// Thông báo đã rời session
socket.on('left_session', (data) => {
  console.log('Left session:', data.sessionId);
});

// Real-time attendance update
socket.on('attendance:update', (data) => {
  console.log('New attendance:', data);
  // data = { studentId, studentName, sessionId, status, checkedInAt }
});

// Danh sách attendance hiện tại
socket.on('session_attendance', (data) => {
  console.log('Session attendance:', data);
  // data = { sessionId, attendances: [...] }
});

// Lỗi
socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

---

## **🎯 QR API Endpoints**

### **1. Giáo viên bắt đầu session**

```http
POST /api/qr/sessions/:sessionId/start
```

**Headers:**
```http
Authorization: Bearer <teacher_jwt_token>
Content-Type: application/json
```

**Params:**
- `sessionId`: ID của session cần bắt đầu

**Response Success (200):**
```json
{
  "success": true,
  "message": "Session started successfully",
  "data": {
    "sessionId": "cm4yf9x4c0001tdjc8vzsm8ol",
    "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expiresAt": "2024-12-18T11:20:00.000Z",
    "teacherName": "Nguyễn Văn A"
  }
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "Only teachers can start sessions"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Session not found or you are not the teacher of this session"
}
```

---

### **2. Học sinh điểm danh bằng QR**

```http
POST /api/qr/attendance/qr-checkin
```

**Headers:**
```http
Authorization: Bearer <student_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Check-in successful",
  "data": {
    "attendanceId": "cm4yf9x4c0002tdjc8vzsm8om",
    "sessionId": "cm4yf9x4c0001tdjc8vzsm8ol",
    "studentId": "cm4yf9x4c0003tdjc8vzsm8on",
    "studentName": "Nguyễn Thị B", 
    "status": "PRESENT",
    "checkedInAt": "2024-12-18T11:15:30.000Z"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "QR token is required"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid or expired QR token"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "You are not enrolled in this session's class"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "You have already checked in for this session"
}
```

---

## **🔄 Complete Workflow**

### **For Teachers:**

1. **Login và lấy JWT token**
2. **Connect WebSocket:**
   ```javascript
   const socket = io('http://localhost:3001', {
     auth: { token: teacherToken }
   });
   ```

3. **Tham gia session room:**
   ```javascript
   socket.emit('join_session', { sessionId: 'session_id' });
   ```

4. **Bắt đầu session:**
   ```http
   POST /api/qr/sessions/session_id/start
   ```

5. **Hiển thị QR code** từ response `qrCodeUrl`

6. **Lắng nghe real-time attendance:**
   ```javascript
   socket.on('attendance:update', (data) => {
     // Update UI with new attendance
     addStudentToList(data);
   });
   ```

### **For Students:**

1. **Login và lấy JWT token**
2. **Connect WebSocket (optional):**
   ```javascript
   const socket = io('http://localhost:3001', {
     auth: { token: studentToken }
   });
   ```

3. **Quét QR code** để lấy `qrToken`

4. **Điểm danh:**
   ```http
   POST /api/qr/attendance/qr-checkin
   Body: { "qrToken": "..." }
   ```

---

## **⏰ QR Token Security**

- **Expiry Time**: 5 phút từ khi teacher start session
- **Secret Key**: Sử dụng `QR_SECRET` riêng biệt (không phải JWT_SECRET chính)
- **One-time Use**: Mỗi session chỉ có 1 QR token duy nhất
- **Scope Limited**: Token chỉ chứa `sessionId` và `teacherId`

---

## **🧪 Testing với Postman/Thunder Client**

### **Test Teacher Start Session:**
```http
POST http://localhost:3001/api/qr/sessions/cm4yf9x4c0001tdjc8vzsm8ol/start
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Test Student Check-in:**
```http
POST http://localhost:3001/api/qr/attendance/qr-checkin
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "qrToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## **📊 Real-time Updates**

Khi học sinh điểm danh thành công:

1. **Database** được update với attendance record
2. **WebSocket** emit `attendance:update` tới tất cả users trong `session_${sessionId}` room
3. **Teacher UI** nhận real-time update và hiển thị học sinh vừa điểm danh
4. **Student** nhận confirmation về việc điểm danh thành công

---

## **🛠️ Environment Variables Required**

```env
# Main JWT secret
JWT_SECRET="fitpass_jwt_secret_key_2024"

# QR-specific JWT secret  
QR_SECRET="fitpass_qr_secret_key_2024_secure"

# Database
DATABASE_URL="postgresql://..."

# Server
PORT=3001
```

---

## **✅ Session 8 Implementation Status**

- ✅ **QR Token Generation & Verification** (`src/utils/qr.ts`)
- ✅ **QR Controller** với teacher/student endpoints (`src/controllers/qr.controller.ts`)
- ✅ **QR Routes** (`src/routes/qr.routes.ts`)
- ✅ **WebSocket Server** (`src/ws/index.ts`)
- ✅ **Server Integration** (WebSocket + HTTP)
- ✅ **Environment Configuration** (QR_SECRET)
- ✅ **Real-time Attendance Updates**
- ✅ **Authorization & Security**

**🎯 Ready for testing and frontend integration!**