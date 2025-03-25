# Test posting with unsupported Content-Type returns 415
POST http://localhost:8080/v1/fragments
Content-Type: application/unsupported-type
[BasicAuth]
user1@email.com:password1
`Test content`

HTTP/1.1 415
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415

jsonpath "$.error.message" contains "Unsupported media type"
