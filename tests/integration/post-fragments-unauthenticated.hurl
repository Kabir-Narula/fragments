# Test unauthenticated post returns 401
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`Test content`

HTTP/1.1 401
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
header "WWW-Authenticate" matches /Basic.*/