# ใช้ Node base image
FROM node:18

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ไปยัง container
COPY package*.json ./
RUN npm install

# คัดลอก source ทั้งหมด
COPY . .

# เปิดพอร์ต
EXPOSE 4000

# กำหนดคำสั่งเริ่มต้น
CMD ["node", "server.js"]
