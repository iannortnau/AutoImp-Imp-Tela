const qz = require("qz-tray");

qz.security.setCertificatePromise(function(resolve, reject) {
    resolve("-----BEGIN CERTIFICATE-----\n"+
    "MIIEJTCCAw2gAwIBAgIUcWG3RFgeTtdWVmaRAQCQjimdsYIwDQYJKoZIhvcNAQEL\n"+
    "BQAwgaAxCzAJBgNVBAYTAkJSMRowGAYDVQQIDBFSaW8gR3JhbmRlIERvIFN1bDEX\n"+
    "MBUGA1UEBwwOU8OGbyBKZXLCk25pbW8xETAPBgNVBAoMCElhbm4gRGV2MQ0wCwYD\n"+
    "VQQLDARJT0NTMRIwEAYDVQQDDAlsb2NhbGhvc3QxJjAkBgkqhkiG9w0BCQEWF2lh\n"+
    "bm5fb3J0bmF1QGhvdG1haWwuY29tMCAXDTIxMDUxNzAwMTQ1OFoYDzIwNTIxMTA5\n"+
    "MDAxNDU4WjCBoDELMAkGA1UEBhMCQlIxGjAYBgNVBAgMEVJpbyBHcmFuZGUgRG8g\n"+
    "U3VsMRcwFQYDVQQHDA5Tw4ZvIEplcsKTbmltbzERMA8GA1UECgwISWFubiBEZXYx\n"+
    "DTALBgNVBAsMBElPQ1MxEjAQBgNVBAMMCWxvY2FsaG9zdDEmMCQGCSqGSIb3DQEJ\n"+
    "ARYXaWFubl9vcnRuYXVAaG90bWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB\n"+
    "DwAwggEKAoIBAQCoQLC1llcpLUvW5CHBA0hrk19Pkm4xru5X1ghogLaSPvWGfCY/\n"+
    "yPAUh2oD+JHkUJ6HymAV6Umw1tTjb3GxwCmNrbZb9qLhLaaLeikM/CYf1yfcQoUM\n"+
    "CgT1XDx1NBieBZLLAYEWBUVk+l8s+1E/jYsf5QnMhKGDFl11vFtd1I7iFZ0qpgzI\n"+
    "s8CGjdam0npl6/D/L9JL7i+5/vTkWqupe1P8rG72P6itGNylXZ39RS8QUNAFqxIw\n"+
    "r6oYNR3KAGKMzOlDvHD9/jy+1Nn0CrgwuvTfchdneJ1Z5Nmq3XQ/Eu15OYG6cLeU\n"+
    "dnQK7HHNyf9K8LEzORXwZ+JkrqbMvqdJJl+nAgMBAAGjUzBRMB0GA1UdDgQWBBSR\n"+
    "KNqTlbHzIOfLCXKKJfVYorArbDAfBgNVHSMEGDAWgBSRKNqTlbHzIOfLCXKKJfVY\n"+
    "orArbDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQBm6VqA0+Cx\n"+
    "HokdzdFHd4TsgeLjba8paxOswS8UwFCOHgem9y0Pp2Kxe2/09gzGbFDrNHCTCjpe\n"+
    "hKGcBs3qBh+3TXCby+BCFiBz56TUe+Dw2c8vnVSXPF0+USAVN0Lsc49kyzRH8BGx\n"+
    "4SUmQykzkozXCOHDXHcYmWSm6xrX6/eOGgzfP3vHw2N04ZTEVDyFQXCd8elkLuTI\n"+
    "LPp2RPlvPMx965K08p8LazXhCEpKCvr5jn0H2ts62C8bSqbg1wRMfgtiZ2oS2pGg\n"+
    "KU3I5R3dDbkGQ74Ecm5u6Z08pq2I6Fw8gov8BNTvAh0OKKf1Xik7uDdSLPdl6XC3\n"+
    "IQvhrAMBys+m\n"+
    "-----END CERTIFICATE-----");
  });
  
  var privateKey = "-----BEGIN PRIVATE KEY-----\n"+
  "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoQLC1llcpLUvW\n"+
  "5CHBA0hrk19Pkm4xru5X1ghogLaSPvWGfCY/yPAUh2oD+JHkUJ6HymAV6Umw1tTj\n"+
  "b3GxwCmNrbZb9qLhLaaLeikM/CYf1yfcQoUMCgT1XDx1NBieBZLLAYEWBUVk+l8s\n"+
  "+1E/jYsf5QnMhKGDFl11vFtd1I7iFZ0qpgzIs8CGjdam0npl6/D/L9JL7i+5/vTk\n"+
  "Wqupe1P8rG72P6itGNylXZ39RS8QUNAFqxIwr6oYNR3KAGKMzOlDvHD9/jy+1Nn0\n"+
  "CrgwuvTfchdneJ1Z5Nmq3XQ/Eu15OYG6cLeUdnQK7HHNyf9K8LEzORXwZ+JkrqbM\n"+
  "vqdJJl+nAgMBAAECggEBAIbBMQZuv6ZKEgitNF+LCpCmOtrXM4x1R41v7dIM7Kya\n"+
  "4jhw7I1/mNFIV1+Q0QAklaO6MVS7QHryxRTXKB8uAdnoPDrRgUiKMG5bS8+Lj9lG\n"+
  "kDU3zamDyM7erclNDT5axmPy83k4hYjHgjzbmAonijrkTQHRZC5CVl46mo6+9CUb\n"+
  "z192u+77sHGc9dhqXI3cA+OuT9Fidb1emw+EUnoKKhFQG7v2Rvw/zU60WcUXbEvy\n"+
  "apWMu9fYA5SM7ovbGSQeisUO4hmvBBwbv060P9scxm2yLPcbhW+veIPER7zyvYoS\n"+
  "VuikhHGvYAQPlFCDZwMGdgud6F3mNhxYDJyfhPmWkOECgYEA3ViUz+lhGPwvqQ1u\n"+
  "TieXxbS5u+7/e66fwOqoE78kadmDoyuoyMN3HsE0fij1tNejz8sZ7aJQSorAR/Mm\n"+
  "mHad1k1QGEnRohb7NrnV3tQT2HcmGSeN7hPr3vetuqLgA3qkwqTclJrXJMG5p8/X\n"+
  "FCwQS53jwpxNRHUdjwV6oZ3AnfcCgYEAwpgo4C1say77SRhW2TK2nypHy5jKAuym\n"+
  "DVylB6kKTsV7XLZnC0m5QwgkOa0o/oxRBhniGkRsydRC4ebSCh5XEpgIBr6OqBd+\n"+
  "v6yHzEeLxsQhvleZHZIK/Cg2FRxEa70tn2voelMxdPNVCPTTNElV0zpBp+F91YJJ\n"+
  "g9+msKs/n9ECgYEAmstABsanaNm0Wv1RjsaRlWn2Gj/h25Ubk8aHFIgv5vZ+4LW/\n"+
  "q+dGfvOOykvKyVWk8cSPtWg1zmuKXMbmzujlKOGYiePV/w0jUfpUXyjhWBi7RAwt\n"+
  "bbnw0lVT4ZnWH5i9cIHq4OIIY2Q3eewX9bt7Cea5SXgVcTKWIVcrk6rG8bECgYAZ\n"+
  "tqmQFfCBqU+jNQgk40KmfZvHF4V6JXM7yMY14OxvxECs2516LF/Cr8y5olwMZtY+\n"+
  "DCWIewo1EUtVNn8Cv0eaOWS2H3ASXihtg4reP4YE2d3rnP+qnKW+9EFRQM75vaHN\n"+
  "syChKWUboxvVdySBgD9LDiOm33EVSYYVWvRX3AkoQQKBgH8kh8o+qdCrUFM2uZ/g\n"+
  "0fAF6+Eh7d2/MWqxjzBcOBjdNaO34VTCnmDg7Mg6FZVCTCppvYQiK8kzJgwS4kFE\n"+
  "HVDE21IUOqOTsPzWap14AygMQin/yC6I75CeoO8UM16N0tjt/8KxMwvm8P3KgrQJ\n"+
  "CYCSrNFvu2mO7jFw5MSMouHA\n"+
  "-----END PRIVATE KEY-----";
  
  qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
  qz.security.setSignaturePromise(function(toSign) {
      return function(resolve, reject) {
          try {
              var pk = KEYUTIL.getKey(privateKey);
              var sig = new KJUR.crypto.Signature({"alg": "SHA512withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
              sig.init(pk); 
              sig.updateString(toSign);
              var hex = sig.sign();
              //console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
              resolve(stob64(hextorstr(hex)));
          } catch (err) {
              console.error(err);
              reject(err);
          }
      };
  });
  qz.websocket.connect({}).then(function() {
    console.log("Connected!");
  });