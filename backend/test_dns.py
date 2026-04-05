import socket
try:
    host = 'tg-76b91015-5241-4bcd-81f2-358bfbb88347.tg-2369025212.i.tgcloud.io'
    res = socket.getaddrinfo(host, 443)
    print("SUCCESS:", res)
except Exception as e:
    print("FAIL:", type(e), e)
