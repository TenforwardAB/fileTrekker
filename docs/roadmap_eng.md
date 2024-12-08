
# Expanded Routes and Features Roadmap

## Proposed Endpoints and Their Purpose

### 1. Tags
**Purpose:** Add, manage, and search files and folders based on tags.

**Endpoints:**
- **POST /api/tags**  
  Add tags to a file or folder.  
  **Payload:**
  ```json
  {
    "itemId": "fileOrFolderId",
    "tags": ["tag1", "tag2"]
  }
  ```

- **DELETE /api/tags**  
  Remove tags from a file or folder.  
  **Payload:**
  ```json
  {
    "itemId": "fileOrFolderId",
    "tags": ["tag1"]
  }
  ```

- **GET /api/tags/:tag**  
  List all files and folders with a specific tag.

---

### 2. Notifications
**Purpose:** Notify users about changes in shared folders or files.

**Endpoints:**
- **POST /api/notifications**  
  Send a notification to a user or group.  
  **Payload:**
  ```json
  {
    "userId": "recipientId",
    "message": "A new file was added to your shared folder."
  }
  ```

- **GET /api/notifications**  
  Retrieve all notifications for a user.  
  Optional query params: `read=false` for unread notifications.

- **PATCH /api/notifications/:notificationId**  
  Mark a notification as read.

---

### 3. Shares
**Purpose:** Manage file and folder sharing.

**Endpoints:**
- **POST /api/shares**  
  Share a file or folder with a user or group.  
  **Payload:**
  ```json
  {
    "itemId": "fileOrFolderId",
    "sharedWith": [
      { "id": "userId", "permissions": ["read", "write"] }
    ]
  }
  ```

- **DELETE /api/shares/:itemId/:userId**  
  Remove sharing of a file or folder for a specific user.

- **GET /api/shares/:itemId**  
  List all users and their permissions for a file or folder.

---

### 4. Services
**Purpose:** Add a service layer to handle complex business logic.

Examples:
- **TagService:** Logic for managing tags.
- **NotificationService:** Manage notifications and integrate with third-party tools.
- **ShareService:** Manage sharing and permissions.

---

### 5. Versioning
**Purpose:** Track and restore previous versions of files.

**Endpoints:**
- **POST /api/files/:fileId/versions**  
  Create a new version of a file.

- **GET /api/files/:fileId/versions**  
  List all versions of a file.

- **GET /api/files/:fileId/versions/:versionId**  
  Retrieve a specific version of a file.

- **DELETE /api/files/:fileId/versions/:versionId**  
  Delete a specific version of a file.

---

### 6. Access Logs
**Purpose:** Track activity on files and folders.

**Endpoints:**
- **GET /api/logs/:itemId**  
  List all logs for a specific file or folder.  
  **Example log data:**
  ```json
  {
    "userId": "userId",
    "action": "download",
    "timestamp": "2024-12-05T15:00:00Z"
  }
  ```

- **POST /api/logs**  
  Create a log entry for events (download, upload, etc.).

---

### 7. Advanced Search
**Purpose:** Find files and folders based on metadata.

**Endpoint:**
- **GET /api/search**  
  Query parameters:
    - `q=<search term>`
    - `owner=<userId>`
    - `tags=["tag1", "tag2"]`
    - `createdAfter=YYYY-MM-DD`
    - `createdBefore=YYYY-MM-DD`

---

## Enhanced Features and Their Purpose

### 1. Permission System
**Purpose:** Granular control over access to files and folders.

**Description:**  
Permissions array defines access levels (`read`, `write`, `delete`, etc.).  
**Example:**
```json
{
  "permissions": [
    { "userId": "user1", "access": ["read", "write"] },
    { "userId": "user2", "access": ["read"] }
  ]
}
```

---

### 2. File Previews
**Purpose:** Provide previews of files (images, PDFs, text).

---

### 3. Expiring Links
**Purpose:** Share files/folders with temporary links.

---

### 4. Trash/Recycle Bin
**Purpose:** Restore deleted files/folders within a set timeframe.

---

### 5. Favorites/Bookmarks
**Purpose:** Allow users to flag files/folders as favorites.

---

## Services Structure

**Example Folder Structure:**
```
services/
  - permissionService.ts
  - filePreviewService.ts
  - linkService.ts
  - trashService.ts
  - notificationService.ts
  - favoriteService.ts
  - activityLogService.ts
```

---

## Summary of New Features

| **Feature**      | **Purpose**                              | **Service**            |
|-------------------|------------------------------------------|------------------------|
| Tags              | Organize files/folders with tags.        | TagService             |
| Notifications     | Inform users of changes.                 | NotificationService    |
| Shares            | Control sharing and permissions.         | ShareService           |
| Versioning        | Track and restore previous versions.     | VersioningService      |
| Activity Logs     | Track user activity.                     | ActivityLogService     |
| Favorites         | Mark files/folders as favorites.         | FavoriteService        |
| Expiring Links    | Create temporary sharing links.          | LinkService            |
| Trash             | Manage deleted objects.                  | TrashService           |
| Permissions       | Control access to files/folders.         | PermissionService      |