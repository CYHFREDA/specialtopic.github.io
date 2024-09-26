<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>控制台</title>
    <link rel="stylesheet" type="text/css" href="./control.css">
    <script>
        // 發佈公告的函數
        async function postAnnouncement() {
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

            const response = await fetch('/control/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                alert('公告已成功發佈！');
                fetchAnnouncements(); // 重新載入公告列表
                document.getElementById('title').value = '';
                document.getElementById('content').value = '';
            } else {
                const { error } = await response.json();
                alert(`發佈公告時發生錯誤: ${error}`);
            }
        }

        async function fetchAnnouncements() {
            const response = await fetch('/control/api/announcements');
            const announcements = await response.json();
            const announcementsList = document.getElementById('announcements-list');
            announcementsList.innerHTML = ''; // 清空現有公告

            announcements.forEach(announcement => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${announcement.title}</strong>: ${announcement.content}`;
                
                // 創建刪除按鈕
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => deleteAnnouncement(announcement._id);
                listItem.appendChild(deleteButton);
                
                announcementsList.appendChild(listItem);
            });
        }

        async function deleteAnnouncement(id) {
            const response = await fetch(`/control/api/announcements/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('公告已成功刪除！');
                fetchAnnouncements(); // 刪除後重新載入公告列表
            } else {
                const { error } = await response.json();
                alert(`刪除公告時發生錯誤: ${error}`);
            }
        }

        async function postUser() {
            const username = document.getElementById('username').value;

            const response = await fetch('/control/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                alert('使用者已成功添加！');
                fetchUsers(); // 添加後重新載入使用者列表
                document.getElementById('username').value = '';
            } else {
                const { error } = await response.json();
                alert(`添加使用者時發生錯誤: ${error}`);
            }
        }

        async function fetchUsers() {
            const response = await fetch('/control/api/users');
            const users = await response.json();
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = ''; // 清空現有使用者

            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${user.username}</strong>`;
                
                // 創建刪除按鈕
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => deleteUser(user._id);
                listItem.appendChild(deleteButton);
                
                usersList.appendChild(listItem);
            });
        }

        async function deleteUser(id) {
            const response = await fetch(`/control/api/users/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('使用者已成功刪除！');
                fetchUsers(); // 刪除後重新載入使用者列表
            } else {
                const { error } = await response.json();
                alert(`刪除使用者時發生錯誤: ${error}`);
            }
        }

        async function fetchRecords() {
            try {
                const response = await fetch('/api/records');
                const records = await response.json();
                const recordsList = document.getElementById('records-list');
                recordsList.innerHTML = ''; // 清空現有記錄
                records.forEach(record => {
                    const listItem = document.createElement('li');
                    listItem.className = 'record-item'; // 新增類別
                    
                    // 假設 record.user 需要從 userId 找到對應的 username
                    const recordContent = document.createElement('span');
                    recordContent.textContent = `${record.userId.username} 打卡於 ${new Date(record.checkedAt).toLocaleString()}`; // 使用 username 和 checkedAt
                    listItem.appendChild(recordContent);
        
                    // 創建刪除按鈕
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '刪除';
                    deleteButton.className = 'delete-button';
                    deleteButton.onclick = () => deleteRecord(record._id); // 調用刪除函數
                    listItem.appendChild(deleteButton);
                    
                    recordsList.appendChild(listItem);
                });
            } catch (error) {
                console.error('Fetch records error:', error);
                alert('查詢打卡記錄失敗：無法連接到伺服器');
            }
        }
        
        async function deleteRecord(id) {
            const response = await fetch(`/api/records/${id}`, {
                method: 'DELETE'
            });
        
            if (response.ok) {
                alert('打卡紀錄已成功刪除！');
                fetchRecords(); // 刪除後重新載入打卡紀錄列表
            } else {
                const { error } = await response.json();
                alert(`刪除打卡紀錄時發生錯誤: ${error}`);
            }
        }
        
        function goBack() {
            window.history.back(); // 返回上一頁
        }

        window.onload = function() {
            fetchAnnouncements(); // 確保在頁面加載時獲取公告
            fetchUsers(); // 確保在頁面加載時獲取使用者
            fetchRecords(); // 確保在頁面加載時獲取打卡紀錄
        };
        
    </script>
</head>
<body>
    <div class="container">
        <h1>控制台</h1>
        
        <h2>發佈公告</h2>
        <input type="text" id="title" placeholder="公告標題" required>
        <textarea id="content" placeholder="公告內容" required></textarea>
        <button onclick="postAnnouncement()">發佈公告</button>

        <h2>現有公告</h2>
        <ul id="announcements-list"></ul>
        
        <h2>管理使用者</h2>
        <input type="text" id="username" placeholder="使用者名稱" required>
        <button onclick="postUser()">添加使用者</button>
        <ul id="users-list"></ul>

        <h2>打卡紀錄</h2>
        <ul id="records-list"></ul>

        <button onclick="goBack()">返回</button>
    </div>
</body>
</html>
