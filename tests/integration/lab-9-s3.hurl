# tests/integration/lab-9-s3.hurl
# Test full fragment lifecycle with S3 integration

# 1. Create new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

HTTP/1.1 201
[Asserts]
header "Location" exists
header "Location" matches "^http://localhost:8080/v1/fragments/[A-Za-z0-9_-]+$"
[Captures]
url: header "Location"

# 2. Retrieve created fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" == "text/plain; charset=utf-8"
body == "Hello S3!"

# 3. Delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 4. Verify deletion
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404