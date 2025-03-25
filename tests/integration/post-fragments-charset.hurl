# Test posting with charset in Content-Type
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`Test content with charset`

HTTP/1.1 201
[Captures]
fragment_url: header "Location"

# Verify GET returns same type with charset
GET {{fragment_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" == "text/plain; charset=utf-8"
body == "Test content with charset"