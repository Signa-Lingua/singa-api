# Project: Singa Api

## End-point: Api Status

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Auth

## End-point: Register

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/register
> ```

### Body formdata

| Param     | value         | Type |
| --------- | ------------- | ---- |
| name      | test          | text |
| email     | test@mail.com | text |
| password  | test12345     | text |
| providers | password      | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Register success"
  }
}
```

### Response: 422

```json
{
  "errors": [
    {
      "message": "The name field must be defined",
      "rule": "required",
      "field": "name"
    },
    {
      "message": "The email field must be defined",
      "rule": "required",
      "field": "email"
    },
    {
      "message": "The password field must be defined",
      "rule": "required",
      "field": "password"
    },
    {
      "message": "The providers field must be defined",
      "rule": "required",
      "field": "providers"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Guest

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/guest
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Login as guest success"
  },
  "data": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNTU5NzAyNiwiZXhwIjoxNzE1NjA0MjI2fQ.VKE4KXk0R6aDLc7ndFKzbSmT6INS5LYjlZ3z_FDxcgI",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNTU5NzAyNn0.oeznlnHeLwK-yxY8orVpD9iatPV11zLWGfNZBwbzIvs"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/login
> ```

### Body formdata

| Param    | value           | Type |
| -------- | --------------- | ---- |
| email    | admin@admin.com | text |
| password | admin12345      | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Login success"
  },
  "data": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTU5NzEwMCwiZXhwIjoxNzE1NjA0MzAwfQ.hF2N4ymg9CML_ixTNbGAqPhoqr1jg1Vqv6YtvRUhYOo",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTU5NzEwMH0.B2jqpQJCvfCE1uvfOBbhgBKGmupjCWOnFTasigKgiDU"
  }
}
```

### Response: 422

```json
{
  "errors": [
    {
      "message": "The email field must be defined",
      "rule": "required",
      "field": "email"
    },
    {
      "message": "The password field must be defined",
      "rule": "required",
      "field": "password"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Me

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/users/me
> ```

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get user success"
  },
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@admin.com",
    "avatarUrl": null,
    "isSignUser": true,
    "createdAt": "2024-06-08T11:51:57.916+00:00",
    "updatedAt": "2024-06-08T11:51:57.916+00:00",
    "quota": {
      "used": 1609342,
      "quota": 1048576
    }
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Logout

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/logout
> ```

### Body formdata

| Param        | value                | Type |
| ------------ | -------------------- | ---- |
| refreshToken | {{userRefreshToken}} | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Logout success"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Access Token

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/refresh
> ```

### Body formdata

| Param | value                | Type |
| ----- | -------------------- | ---- |
| token | {{userRefreshToken}} | text |

### 🔑 Authentication noauth

| Param | value | Type |
| ----- | ----- | ---- |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update access token success"
  },
  "data": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNzQ4NTMyOCwiZXhwIjoxNzE3NDkyNTI4fQ.ZZvy3aiNymSIhMWs0voODJHVc6NW8JRC2QaS_x925U4"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Users

## End-point: Upload Avatar

### Method: PUT

> ```
> {{protocol}}://{{host}}:{{port}}/users/me
> ```

### Body formdata

| Param  | value                                                | Type |
| ------ | ---------------------------------------------------- | ---- |
| avatar | /C:/Users/rizrm/OneDrive/Pictures/default-avatar.png | file |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update user success"
  },
  "data": {
    "id": 2,
    "name": "GuestHQFvUUQ2qQPu57Su",
    "email": null,
    "avatarUrl": "https://storage.googleapis.com/download/storage/v1/b/singa-test-bucket/o/uploads%2Favatar%2F1715849162627_GuestHQFvUUQ2qQPu57Su.png?generation=1715849168736922&alt=media",
    "isSignUser": false,
    "createdAt": "2024-05-16T08:43:36.025+00:00",
    "updatedAt": "2024-05-16T08:46:02.928+00:00"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Upload Avatar

### Method: PUT

> ```
> {{protocol}}://{{host}}:{{port}}/users/me
> ```

### Body formdata

| Param                 | value                                                                                 | Type |
| --------------------- | ------------------------------------------------------------------------------------- | ---- |
| avatar                | /C:/Users/rizrm/OneDrive/Pictures/441655911_806846777574763_8442118511948688487_n.jpg | file |
| password              | asdasdasdasd                                                                          | text |
| password_confirmation |                                                                                       | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update user success"
  },
  "data": {
    "id": 1,
    "name": "test",
    "email": "test@mail.com",
    "avatarUrl": "https://storage.googleapis.com/download/storage/v1/b/singa-test-bucket/o/uploads%2Favatar%2F1715849136020_test.jpg?generation=1715849142374890&alt=media",
    "isSignUser": false,
    "createdAt": "2024-05-16T08:43:34.336+00:00",
    "updatedAt": "2024-05-16T08:45:36.565+00:00"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Static Translation

## End-point: All Owned Static Translation

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/translation/static
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get list of static translations"
  },
  "data": [
    {
      "id": 1,
      "title": "First Static Translation for userid 1",
      "videoUrl": "https://www.youtube.com/watch?v=123456",
      "createdAt": "2024-05-25T16:26:30.248+00:00",
      "updatedAt": "2024-05-25T16:26:30.248+00:00"
    },
    {
      "id": 2,
      "title": "Second Static Translation for userid 1",
      "videoUrl": "https://www.youtube.com/watch?v=123456",
      "createdAt": "2024-05-25T16:26:30.254+00:00",
      "updatedAt": "2024-05-25T16:26:30.254+00:00"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Owned Static Translation By id

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/translation/static/1
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Static translation found"
  },
  "data": {
    "id": 1,
    "title": "First Static Translation for userid 1",
    "videoUrl": "https://www.youtube.com/watch?v=123456",
    "createdAt": "2024-05-25T16:26:30.248+00:00",
    "updatedAt": "2024-05-25T16:26:30.248+00:00",
    "transcripts": [
      {
        "id": 1,
        "staticTranslationId": 1,
        "userId": 1,
        "timestamp": "00:00:01.123",
        "text": "First",
        "createdAt": "2024-05-25T16:26:30.261+00:00",
        "updatedAt": "2024-05-25T16:26:30.261+00:00"
      },
      {
        "id": 2,
        "staticTranslationId": 1,
        "userId": 1,
        "timestamp": "00:00:02.123",
        "text": "Second",
        "createdAt": "2024-05-25T16:26:30.266+00:00",
        "updatedAt": "2024-05-25T16:26:30.266+00:00"
      },
      {
        "id": 3,
        "staticTranslationId": 1,
        "userId": 1,
        "timestamp": "00:00:05.123",
        "text": "Third",
        "createdAt": "2024-05-25T16:26:30.269+00:00",
        "updatedAt": "2024-05-25T16:26:30.269+00:00"
      },
      {
        "id": 4,
        "staticTranslationId": 1,
        "userId": 1,
        "timestamp": "00:00:20.123",
        "text": "Fourth",
        "createdAt": "2024-05-25T16:26:30.271+00:00",
        "updatedAt": "2024-05-25T16:26:30.271+00:00"
      }
    ]
  }
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Static translation not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: New Static Translation

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/translation/static
> ```

### Body formdata

| Param | value                                          | Type |
| ----- | ---------------------------------------------- | ---- |
| title | New Static Translation                         | text |
| file  | /C:/Users/Andrien/Desktop/code/sand/blahaj.mp4 | file |

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create static translation success"
  },
  "data": {
    "title": "New Static Translation",
    "videoUrl": "https://storage.googleapis.com/singa-test-bucket/uploads/static-translation/uyrYwRlP11taWd-y_1.mp4",
    "userId": 1,
    "createdAt": "2024-05-26T10:31:07.723+00:00",
    "updatedAt": "2024-05-26T10:31:07.723+00:00",
    "id": 4
  }
}
```

### Response: 400

```json
{
  "errors": [
    {
      "message": "The title field must be defined",
      "rule": "required",
      "field": "title"
    },
    {
      "message": "The file field must be defined",
      "rule": "required",
      "field": "file"
    }
  ]
}
```

### Response: 403

```json
{
  "meta": {
    "code": 403,
    "status": "error",
    "message": "User storage quota exceeded"
  }
}
```

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create static translation success"
  },
  "data": {
    "title": "New Static Translation",
    "video": "45J5CzxJ7F7rOjH8_1.mp4",
    "videoUrl": "https://storage.googleapis.com/singa-test-bucket/uploads/static/45J5CzxJ7F7rOjH8_1.mp4",
    "userId": 1,
    "createdAt": "2024-06-10T00:56:16.190+00:00",
    "updatedAt": "2024-06-10T00:56:16.190+00:00",
    "id": 4
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Edit Static Translation

### Method: PUT

> ```
> {{protocol}}://{{host}}:{{port}}/translation/static/1
> ```

### Body formdata

| Param | value         | Type |
| ----- | ------------- | ---- |
| title | updated value | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update static translation success"
  },
  "data": {
    "id": 1,
    "userId": 1,
    "title": "updated value",
    "videoUrl": "https://www.youtube.com/watch?v=123456",
    "createdAt": "2024-05-25T16:26:30.248+00:00",
    "updatedAt": "2024-05-26T10:35:16.596+00:00"
  }
}
```

### Response: 400

```json
{
  "errors": [
    {
      "message": "The title field must be defined",
      "rule": "required",
      "field": "title"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete

### Method: DELETE

> ```
> {{protocol}}://{{host}}:{{port}}/translation/static/1
> ```

### Response: undefined

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Delete static translation success"
  }
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Static translation not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Conversation Translation

## End-point: All Owned Conversation Translation

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get list of conversation translations"
  },
  "data": [
    {
      "id": 1,
      "title": "First Conversation Translation for userid 1",
      "createdAt": "2024-05-25T16:26:30.290+00:00",
      "updatedAt": "2024-05-25T16:26:30.290+00:00"
    },
    {
      "id": 2,
      "title": "Second Conversation Translation for userid 1",
      "createdAt": "2024-05-25T16:26:30.294+00:00",
      "updatedAt": "2024-05-25T16:26:30.294+00:00"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Owned Conversation Translation By id

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation/1
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get conversation node success"
  },
  "data": [
    {
      "id": 1,
      "conversationTranslationId": 1,
      "userId": 1,
      "video": null,
      "videoUrl": "https://www.youtube.com/watch?v=123456",
      "type": "video",
      "createdAt": "2024-06-03T00:41:11.839+00:00",
      "updatedAt": "2024-06-03T00:41:11.839+00:00",
      "transcripts": "First Second Third Fourth"
    },
    {
      "id": 2,
      "conversationTranslationId": 1,
      "userId": 1,
      "video": null,
      "videoUrl": null,
      "type": "speech",
      "createdAt": "2024-06-03T00:41:11.840+00:00",
      "updatedAt": "2024-06-03T00:41:11.840+00:00",
      "transcripts": "Speech to text result"
    },
    {
      "id": 3,
      "conversationTranslationId": 1,
      "userId": 1,
      "video": null,
      "videoUrl": "https://www.youtube.com/watch?v=123456",
      "type": "video",
      "createdAt": "2024-06-03T00:41:11.841+00:00",
      "updatedAt": "2024-06-03T00:41:11.841+00:00",
      "transcripts": "First Second Third Fourth"
    },
    {
      "id": 4,
      "conversationTranslationId": 1,
      "userId": 1,
      "video": null,
      "videoUrl": null,
      "type": "speech",
      "createdAt": "2024-06-03T00:41:11.841+00:00",
      "updatedAt": "2024-06-03T00:41:11.841+00:00",
      "transcripts": "Speech to text result"
    }
  ]
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Conversation translation not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: New Conversation Translation

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation
> ```

### Body formdata

| Param | value                  | Type |
| ----- | ---------------------- | ---- |
| title | New Static Translation | text |

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create conversation translation success"
  },
  "data": {
    "title": "New Static Translation",
    "userId": 1,
    "createdAt": "2024-05-26T10:44:37.718+00:00",
    "updatedAt": "2024-05-26T10:44:37.718+00:00",
    "id": 4
  }
}
```

### Response: 201

```json
{
  "errors": [
    {
      "message": "Title is required",
      "rule": "required",
      "field": "title"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: New Speech Node

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation/1/speech
> ```

### Body formdata

| Param | value                 | Type |
| ----- | --------------------- | ---- |
| text  | speech to text result | text |
| type  | speech                | text |

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create conversation translation node speech success"
  },
  "data": {
    "conversationTranslationId": 5,
    "userId": 6,
    "type": "speech",
    "createdAt": "2024-06-02T14:42:39.789+00:00",
    "updatedAt": "2024-06-02T14:42:39.789+00:00",
    "id": 14,
    "transcript": {
      "userId": 6,
      "conversationNodeId": 14,
      "text": "speech to text result",
      "timestamp": "00:00:00.000",
      "createdAt": "2024-06-02T14:42:39.798+00:00",
      "updatedAt": "2024-06-02T14:42:39.798+00:00",
      "id": 31
    }
  }
}
```

### Response: 400

```json
{
  "errors": [
    {
      "message": "The file field must be defined",
      "rule": "required",
      "field": "file"
    },
    {
      "message": "The type field must be defined",
      "rule": "required",
      "field": "type"
    }
  ]
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Conversation translation not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: New Video Node

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation/1/video
> ```

### Body formdata

| Param | value                                          | Type |
| ----- | ---------------------------------------------- | ---- |
| file  | /C:/Users/Andrien/Desktop/code/sand/blahaj.mp4 | file |
| type  | video                                          | text |

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create conversation translation node video success"
  },
  "data": {
    "conversationTranslationId": 1,
    "userId": 1,
    "videoUrl": "https://storage.googleapis.com/singa-test-bucket/uploads/conversation-translation/MIF7Qr6s0skAvN-T_1.mp4",
    "type": "video",
    "createdAt": "2024-05-26T10:56:49.651+00:00",
    "updatedAt": "2024-05-26T10:56:49.651+00:00",
    "id": 15
  }
}
```

### Response: 400

```json
{
  "errors": [
    {
      "message": "The file field must be defined",
      "rule": "required",
      "field": "file"
    },
    {
      "message": "The type field must be defined",
      "rule": "required",
      "field": "type"
    }
  ]
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Conversation translation not found"
  }
}
```

### Response: 403

```json
{
  "meta": {
    "code": 403,
    "status": "error",
    "message": "User storage quota exceeded"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Edit Conversation Translation

### Method: PUT

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation/1
> ```

### Body formdata

| Param | value         | Type |
| ----- | ------------- | ---- |
| title | updated value | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update conversation translation success"
  },
  "data": {
    "id": 1,
    "userId": 1,
    "title": "updated value",
    "createdAt": "2024-05-25T16:26:30.290+00:00",
    "updatedAt": "2024-05-26T10:45:57.668+00:00"
  }
}
```

### Response: 400

```json
{
  "errors": [
    {
      "message": "Title is required",
      "rule": "required",
      "field": "title"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete

### Method: DELETE

> ```
> {{protocol}}://{{host}}:{{port}}/translation/conversation/1
> ```

### Response: undefined

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Delete conversation translation success"
  }
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Static translation not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Bulk Delete

### Method: GET

> ```
> undefined
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Delete conversation nodes success"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Detail Node

### Method: GET

> ```
> undefined
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get conversation translation success"
  },
  "data": {
    "id": 28,
    "conversationTranslationId": 1,
    "userId": 1,
    "video": "lfxR4JnxuqUviszS_1.mp4",
    "videoUrl": "https://storage.googleapis.com/singa-test-bucket/uploads/conversations/lfxR4JnxuqUviszS_1.mp4",
    "status": "success",
    "type": "video",
    "createdAt": "2024-06-08T05:31:19.709+00:00",
    "updatedAt": "2024-06-08T05:31:19.709+00:00",
    "transcripts": [
      {
        "id": 117,
        "conversationNodeId": 28,
        "userId": 1,
        "timestamp": "00:00:05",
        "text": "i-love-you",
        "createdAt": "2024-06-08T05:31:25.524+00:00",
        "updatedAt": "2024-06-08T05:31:25.524+00:00"
      }
    ]
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Articles

## End-point: List All Articles

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/articles
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get list of articles"
  },
  "data": [
    {
      "id": 2,
      "title": "Article 2",
      "description": "Description 2",
      "imageUrl": "https://www.example.com/image2.jpg",
      "createdAt": "2024-06-03T10:05:39.639+00:00",
      "updatedAt": "2024-06-03T10:05:39.639+00:00"
    },
    {
      "id": 1,
      "title": "Article 1",
      "description": "Description 1",
      "imageUrl": "https://www.example.com/image1.jpg",
      "createdAt": "2024-06-03T10:05:39.630+00:00",
      "updatedAt": "2024-06-03T10:05:39.631+00:00"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Detail Article

### Method: GET

> ```
> {{protocol}}://{{host}}:{{port}}/articles/1
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Get article success"
  },
  "data": {
    "id": 1,
    "title": "test",
    "description": "test",
    "imageUrl": "https://storage.googleapis.com/singa-test-bucket/uploads/article/article-2Qtyzq0qfm9KNFmD.jpg",
    "createdBy": 1,
    "createdAt": "2024-06-06T04:05:12.707+00:00",
    "updatedAt": "2024-06-06T04:05:12.707+00:00",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@admin.com",
      "roleId": 1,
      "role": {
        "id": 1,
        "name": "admin",
        "createdAt": "2024-06-06T03:51:04.309+00:00",
        "updatedAt": "2024-06-06T03:51:04.309+00:00"
      }
    }
  }
}
```

### Response: 401

```json
{
  "meta": {
    "code": 401,
    "status": "error",
    "message": "Unauthorized access"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: New Article

### Method: POST

> ```
> {{protocol}}://{{host}}:{{port}}/articles
> ```

### Body formdata

| Param       | value                              | Type |
| ----------- | ---------------------------------- | ---- |
| title       | New Article                        | text |
| description | Description                        | text |
| imageUrl    | https://www.example.com/image2.jpg | text |

### Response: 201

```json
{
  "meta": {
    "code": 201,
    "status": "success",
    "message": "Create article success"
  },
  "data": {
    "title": "New Article",
    "description": "Description",
    "imageUrl": "https://www.example.com/image2.jpg",
    "createdAt": "2024-06-03T10:14:13.341+00:00",
    "updatedAt": "2024-06-03T10:14:13.341+00:00",
    "id": 3
  }
}
```

### Response: 422

```json
{
  "errors": [
    {
      "message": "The title field must be defined",
      "rule": "required",
      "field": "title"
    },
    {
      "message": "The description field must be defined",
      "rule": "required",
      "field": "description"
    },
    {
      "message": "The imageUrl field must be defined",
      "rule": "required",
      "field": "imageUrl"
    }
  ]
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Update Article

### Method: PUT

> ```
> {{protocol}}://{{host}}:{{port}}/articles/3
> ```

### Body formdata

| Param       | value                              | Type |
| ----------- | ---------------------------------- | ---- |
| title       | Updated Title                      | text |
| description | Updated Description                | text |
| imageUrl    | https://www.example.com/image1.jpg | text |

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Update article success"
  },
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Description",
    "imageUrl": "https://www.example.com/image1.jpg",
    "createdAt": "2024-06-03T10:05:39.630+00:00",
    "updatedAt": "2024-06-03T10:15:57.086+00:00"
  }
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Article not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete Article

### Method: DELETE

> ```
> {{protocol}}://{{host}}:{{port}}/articles/1
> ```

### Response: 200

```json
{
  "meta": {
    "code": 200,
    "status": "success",
    "message": "Delete article success"
  }
}
```

### Response: 404

```json
{
  "meta": {
    "code": 404,
    "status": "error",
    "message": "Article not found"
  }
}
```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

---

Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
